import { NextResponse } from 'next/server';
import { generateChatResponse, generateConversationTitle, analyzeIntent } from '@/lib/cohere';
import { createConversation, addMessage, getConversationWithMessages, createOrGetUser, prisma } from '@/lib/db.jsx';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
  try {
    const { userId } = await auth();
    const { message, conversationId, imageUrl } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let conversation;
    let messages = [];

    if (userId) {
      // Ensure user exists in database
      await createOrGetUser(userId);
      
      // Authenticated user - handle conversation history
      if (conversationId) {
        conversation = await getConversationWithMessages(conversationId);
        if (!conversation || conversation.userId !== userId) {
          return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }
        messages = conversation.messages;
      } else {
        // Create new conversation for authenticated user
        conversation = await createConversation(userId);
      }

      // Add user message to database
      await addMessage(conversation.id, message, 'user', imageUrl);
    } else {
      // Anonymous user - no conversation history, no database storage
      messages = [];
    }

    // Analyze intent for better responses
    // Prepare messages for AI context
    let contextMessages;
    if (userId) {
      // For authenticated users, get full conversation history
      const updatedConversation = await getConversationWithMessages(conversation.id);
      contextMessages = updatedConversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        ...(msg.imageUrl && { imageUrl: msg.imageUrl })
      }));
    } else {
      // For anonymous users, only use current message
      contextMessages = [{
        role: 'user',
        content: message,
        ...(imageUrl && { imageUrl: imageUrl })
      }];
    }

    const intent = await analyzeIntent(message || 'analyze image');

    // Generate AI response
    const aiResponse = await generateChatResponse(contextMessages);

    if (userId) {
      // Add AI response to database for authenticated users
      await addMessage(conversation.id, aiResponse, 'assistant');

      // Generate title for new conversations
      let title = conversation.title;
      if (!title && contextMessages.length <= 2) {
        // Pass the user's message content for title generation
        const userMessage = message || (imageUrl ? 'Image analysis request' : 'New conversation');
        title = await generateConversationTitle(userMessage);
        // Update conversation with title
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { title }
        });
      }

      return NextResponse.json({
        response: aiResponse,
        conversationId: conversation.id,
        intent,
        title
      });
    } else {
      // For anonymous users, return response without conversation data
      return NextResponse.json({
        response: aiResponse,
        intent,
        isAnonymous: true
      });
    }

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
    const { userId } = await auth();

    // Require authentication
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

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
    if (conversation.userId !== userId) {
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