'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <ChatInterface />
    </div>
  );
}