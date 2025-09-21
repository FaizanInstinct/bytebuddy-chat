import { NextResponse } from 'next/server';
import { getUserConversations, createConversation } from '@/lib/db';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(request) {
  try {
    const { userId } = await auth();
    
    // Only return conversations for authenticated users
    // This prevents sharing of chat history between users
    if (!userId) {
      return NextResponse.json({ conversations: [] });
    }
    
    const conversations = await getUserConversations(userId);

    return NextResponse.json({ conversations });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title } = await request.json();
    const { userId } = await auth();

    const conversation = await createConversation(userId, title);

    return NextResponse.json({ conversation });

  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');
    const { userId } = await auth();

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Check if conversation belongs to the authenticated user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Verify the user has access to this conversation
    if (userId && conversation.userId && conversation.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to conversation' },
        { status: 403 }
      );
    }

    await prisma.conversation.delete({
      where: { id: conversationId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}