import { NextResponse } from 'next/server';
import { generateChatResponse, generateConversationTitle, analyzeIntent } from '@/lib/cohere';
import { createConversation, addMessage, getConversationWithMessages, prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
  try {
    const { message, conversationId, imageUrl } = await request.json();
    const { userId } = auth();

    if (!message && !imageUrl) {
      return NextResponse.json(
        { error: 'Message or image is required' },
        { status: 400 }
      );
    }

    let currentConversationId = conversationId;
    let conversation;

    // Create new conversation if none exists
    if (!currentConversationId) {
      conversation = await createConversation(userId);
      currentConversationId = conversation.id;
    } else {
      conversation = await getConversationWithMessages(currentConversationId);
      
      // Verify the user has access to this conversation
      if (userId && conversation.userId && conversation.userId !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized access to conversation' },
          { status: 403 }
        );
      }
    }

    // Prepare the message content
    let content = message || '';
    
    // If there's an image, add a reference to it in the message
    if (imageUrl) {
      if (content) {
        content += '\n\n[Image attached]';
      } else {
        content = '[Image attached]';
      }
    }

    // Add user message to database with image URL if present
    await addMessage(currentConversationId, content, 'user', imageUrl);

    // Get conversation history for context
    const updatedConversation = await getConversationWithMessages(currentConversationId);
    const messages = updatedConversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      // Include image URL in the context if present
      ...(msg.imageUrl && { imageUrl: msg.imageUrl })
    }));

    // Analyze intent for better responses
    const intent = await analyzeIntent(message || 'analyze image');

    // Generate AI response
    const aiResponse = await generateChatResponse(messages);

    // Add AI response to database
    await addMessage(currentConversationId, aiResponse, 'assistant');

    // Generate title for new conversations
    let title = conversation.title;
    if (!title && messages.length <= 2) {
      title = await generateConversationTitle(messages);
      // Update conversation with title
      await prisma.conversation.update({
        where: { id: currentConversationId },
        data: { title }
      });
    }

    return NextResponse.json({
      response: aiResponse,
      conversationId: currentConversationId,
      intent,
      title
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const { userId } = auth();

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const conversation = await getConversationWithMessages(conversationId);

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

    return NextResponse.json({
      conversation,
      messages: conversation.messages
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}