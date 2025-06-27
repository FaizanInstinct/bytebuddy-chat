import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateChatResponse(messages, systemPrompt = null) {
  try {
    const systemMessage = systemPrompt || {
      role: 'system',
      content: `You are ByteBuddy, a helpful and friendly AI assistant. You provide accurate, helpful, and engaging responses. Keep your responses conversational and informative.`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate response');
  }
}

export async function generateConversationTitle(messages) {
  try {
    const prompt = {
      role: 'system',
      content: 'Generate a short, descriptive title (max 6 words) for this conversation based on the first few messages. Return only the title, no quotes or extra text.'
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [prompt, ...messages.slice(0, 3)],
      max_tokens: 20,
      temperature: 0.5,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Title generation error:', error);
    return 'New Conversation';
  }
}

export async function analyzeIntent(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Analyze the user message and return the intent category. Categories: greeting, question, request, complaint, compliment, goodbye, other. Return only the category name.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    return completion.choices[0].message.content.trim().toLowerCase();
  } catch (error) {
    console.error('Intent analysis error:', error);
    return 'other';
  }
}