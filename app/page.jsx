'use client';

import { Suspense } from 'react';
import ChatInterface from '@/components/ChatInterface';

function ChatInterfaceWrapper() {
  return <ChatInterface />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      }>
        <ChatInterfaceWrapper />
      </Suspense>
    </div>
  );
}