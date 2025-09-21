import { CohereClientV2 } from 'cohere-ai';

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

export async function generateChatResponse(messages, systemPrompt = null) {
  try {
    // Convert messages to the correct format for V2 API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content + (msg.imageUrl ? `\n\nPlease analyze the image at: ${msg.imageUrl}` : ''),
    }));

    // Add system message if provided
    if (systemPrompt) {
      formattedMessages.unshift({
        role: 'system',
        content: systemPrompt.content
      });
    }
    
    const response = await cohere.chat({
      model: 'command-r-08-2024',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    return response.message.content[0].text;
  } catch (error) {
    console.error('Cohere API Error:', error);
    throw new Error('Failed to generate response');
  }
}

export async function generateConversationTitle(userMessage) {
  try {
    const response = await cohere.chat({
      model: 'command-r-08-2024',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise, descriptive titles for conversations. Generate a title that captures the main topic or question being asked. Keep it under 6 words and make it specific to the user\'s request.'
        },
        {
          role: 'user',
          content: `Create a short, descriptive title (maximum 6 words) for a conversation where the user asks: "${userMessage}"\n\nRespond with only the title, no quotes or extra text.`
        }
      ],
      max_tokens: 25,
      temperature: 0.2,
    });

    const title = response.message.content[0].text.trim();
    // Remove quotes if present and ensure it's not too long
    const cleanTitle = title.replace(/^["']|["']$/g, '').substring(0, 50);
    return cleanTitle || 'New Conversation';
  } catch (error) {
    console.error('Error generating conversation title:', error);
    return 'New Conversation';
  }
}

export async function analyzeIntent(message) {
  try {
    const response = await cohere.chat({
      model: 'command-r-08-2024',
      messages: [
        {
          role: 'user',
          content: `Analyze the intent of this message and categorize it as one of: question, request, greeting, complaint, compliment, other.\n\nMessage: "${message}"\n\nIntent:`
        }
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    return response.message.content[0].text.trim().toLowerCase();
  } catch (error) {
    console.error('Error analyzing intent:', error);
    return 'other';
  }
}