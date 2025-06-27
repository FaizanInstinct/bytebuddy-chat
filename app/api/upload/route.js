import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

// Create uploads directory if it doesn't exist
async function ensureUploadsDirectory() {
  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  try {
    await mkdir(uploadsDir, { recursive: true });
    return uploadsDir;
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { userId } = auth();
    
    // Process the form data
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are supported' },
        { status: 400 }
      );
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const uniqueId = uuidv4();
    const fileExtension = file.type.split('/')[1];
    const filename = `${uniqueId}.${fileExtension}`;
    
    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDirectory();
    
    // Save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);
    
    // Generate the public URL
    const imageUrl = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      imageUrl,
    });
    
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}