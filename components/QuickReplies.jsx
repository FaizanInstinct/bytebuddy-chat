'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const quickReplies = [
  { id: 1, text: "👋 Hello", category: "greeting" },
  { id: 2, text: "❓ Help me", category: "help" },
  { id: 3, text: "💡 Give me ideas", category: "creative" },
  { id: 4, text: "📚 Explain something", category: "educational" },
  { id: 5, text: "🔍 Search for info", category: "search" },
  { id: 6, text: "✨ Surprise me", category: "fun" },
];

export default function QuickReplies({ onSelect }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900 rounded-xl shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-sm font-medium text-green-600 dark:text-white">Quick Replies</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply, index) => (
          <motion.button
            key={reply.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(reply.text)}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-full",
              "bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
              "hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-700",
              "transition-all duration-200 shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            )}
          >
            {reply.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}