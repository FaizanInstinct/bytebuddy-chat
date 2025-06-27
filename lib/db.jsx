import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper functions for database operations
export async function createConversation(userId = null, title = null) {
  return await prisma.conversation.create({
    data: {
      userId,
      title,
    },
  });
}

export async function addMessage(conversationId, content, role, imageUrl = null) {
  return await prisma.message.create({
    data: {
      conversationId,
      content,
      role,
      imageUrl,
    },
  });
}

export async function getConversationWithMessages(conversationId) {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

export async function getUserConversations(userId) {
  return await prisma.conversation.findMany({
    where: { userId },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function createOrUpdateChatSession(sessionId, context) {
  return await prisma.chatSession.upsert({
    where: { sessionId },
    update: {
      context,
      updatedAt: new Date(),
    },
    create: {
      sessionId,
      context,
    },
  });
}

export async function getChatSession(sessionId) {
  return await prisma.chatSession.findUnique({
    where: { sessionId },
  });
}

export async function deleteOldConversations() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  await prisma.conversation.deleteMany({
    where: {
      updatedAt: {
        lt: sevenDaysAgo,
      },
    },
  });
}