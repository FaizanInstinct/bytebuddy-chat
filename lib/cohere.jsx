import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function generateChatResponse(messages, systemPrompt = null) {
  try {
    // Extract the last message (user's message)
    const lastMessage = messages[messages.length - 1];
    let messageContent = lastMessage.content;
    
    // If the message has an image, add a reference to it
    if (lastMessage.imageUrl) {
      messageContent += `\n\nPlease analyze the image at: ${lastMessage.imageUrl}`;
    }
    
    // Convert previous messages for chat history
    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'USER' : 'CHATBOT',
      message: msg.content,
    }));
    
    const response = await cohere.chat({
      model: 'command-r-plus',
      message: messageContent,
      chatHistory: chatHistory,
      // systemPrompt: systemPrompt ? systemPrompt.content : undefined,
    });
    return response.text;
  } catch (error) {
    console.error('Cohere API Error:', error);
    throw new Error('Failed to generate response');
  }
}

export async function generateConversationTitle(messages) {
  try {
    const prompt = 'Generate a short, descriptive title (max 6 words) for this conversation based on the first few messages. Return only the title, no quotes or extra text: ' + messages.slice(0, 3).map(msg => msg.content).join(' ');
    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      maxTokens: 20,
    });
    return response.generations[0].text.trim();
  } catch (error) {
    console.error('Cohere Title generation error:', error);
    return 'New Conversation';
  }
}

export async function analyzeIntent(message) {
  try {
    const prompt = `Analyze the user message and return the intent category. Categories: greeting, question, request, complaint, compliment, goodbye, other. Return only the category name.\nUser message: ${message}\nCategory:`;
    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      maxTokens: 10,
    });
    const category = response.generations[0].text.trim().toLowerCase();

    const validCategories = ['greeting', 'question', 'request', 'complaint', 'compliment', 'goodbye', 'other'];
    if (validCategories.includes(category)) {
      return category;
    } else {
      return 'other';
    }
  } catch (error) {
    console.error('Cohere Intent analysis error:', error);
    return 'other';
  }
}