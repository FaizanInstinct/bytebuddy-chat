'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import { format, parseISO, isToday, isYesterday, isSameWeek, isSameMonth, isSameYear } from 'date-fns';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function HistoryPage() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const router = useRouter();
  const { userId, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    async function fetchConversations() {
      if (!isLoaded) return;
      
      try {
        setIsLoading(true);
        const url = isSignedIn ? `/api/conversations?userId=${userId}` : '/api/conversations';
        const response = await fetch(url);
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchConversations();
  }, [userId, isLoaded, isSignedIn]);

  const handleConversationClick = (conversationId) => {
    router.push(`/?conversationId=${conversationId}`);
  };

  const handleDeleteClick = (e, conversationId) => {
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    if (!conversationToDelete) return;

    try {
      await fetch(`/api/conversations?id=${conversationToDelete}`, {
        method: 'DELETE',
      });
      setConversations(conversations.filter(conv => conv.id !== conversationToDelete));
      toast.success('Conversation deleted successfully!');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Error deleting conversation.');
    } finally {
      setConversationToDelete(null);
    }
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conversation) => {
    const date = parseISO(conversation.createdAt);
    let groupKey;

    if (isToday(date)) {
      groupKey = 'Today';
    } else if (isYesterday(date)) {
      groupKey = 'Yesterday';
    } else if (isSameWeek(date, new Date())) {
      groupKey = 'This Week';
    } else if (isSameMonth(date, new Date())) {
      groupKey = 'This Month';
    } else if (isSameYear(date, new Date())) {
      groupKey = format(date, 'MMMM yyyy');
    } else {
      groupKey = format(date, 'yyyy');
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(conversation);
    return groups;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 px-4 py-8">
        <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600 dark:text-green-400 transform hover:scale-105 transition-transform duration-300 drop-shadow-lg">Conversation History</h1>
        <ConfirmationModal
          isOpen={isModalOpen}
          message="Are you sure you want to delete this conversation?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      <p className="text-sm text-green-600 dark:text-green-400 text-center mt-4 transition-all duration-200 ease-in-out transform hover:scale-105 hover:text-gray-700 dark:hover:text-gray-300">
            Conversations older than 7 days will be deleted.
          </p>
      
      {!isSignedIn && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg text-center max-w-4xl mx-auto">
          <p className="text-yellow-700 dark:text-yellow-400">Sign in to save your conversation history.</p>
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No conversation history found.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-md hover:scale-105 hover:shadow-lg transform transition-all duration-300 font-semibold"
          >
            Start a New Conversation
          </button>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 max-w-7xl mx-auto"
        >
          {Object.entries(groupedConversations).map(([dateGroup, convos]) => (
            <div key={dateGroup} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400 border-b border-green-100 dark:border-green-800 pb-2">{dateGroup}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {convos.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    variants={itemVariants}
                    onClick={() => handleConversationClick(conversation.id)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-green-100 dark:border-green-900 hover:shadow-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate flex-1">
                        {conversation.title || (conversation.messages && conversation.messages[0] 
                          ? conversation.messages[0].content.substring(0, 40) + (conversation.messages[0].content.length > 40 ? '...' : '')
                          : 'Untitled Conversation')}
                      </h3>
                      <button
                        onClick={(e) => handleDeleteClick(e, conversation.id)}
                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200"
                        aria-label="Delete conversation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conversation.messages && conversation.messages[0] 
                        ? conversation.messages[0].content.substring(0, 60) + (conversation.messages[0].content.length > 60 ? '...' : '')
                        : 'No messages'}
                    </p>
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      {format(parseISO(conversation.createdAt), 'MMM d, yyyy • h:mm a')}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}