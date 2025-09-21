import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(request) {
  try {
    const { userId } = await auth();
    
    // If user is authenticated, delete only their conversations
    // Otherwise, return an error (anonymous users shouldn't clear all conversations)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete all conversations for this user
    await prisma.conversation.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Clear all conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}