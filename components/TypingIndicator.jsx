'use client';

import { motion } from 'framer-motion';
import { CpuChipIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-3 max-w-4xl mx-auto"
    >
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center">
        <CpuChipIcon className="h-4 w-4" />
      </div>

      {/* Typing Content */}
      <div className="flex flex-col space-y-1">
        {/* Bot Name */}
        <span className="text-xs font-medium text-green-600 dark:text-green-400 px-1">
          ByteBuddy
        </span>

        {/* Typing Bubble */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="relative px-4 py-3 bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900 rounded-2xl shadow-sm"
        >
          {/* Typing Animation */}
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">ByteBuddy is typing</span>
            <div className="flex space-x-1 ml-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Message Tail */}
          <div className="absolute top-3 w-3 h-3 bg-white dark:bg-gray-800 border-l border-b border-green-100 dark:border-green-900 transform rotate-45 -left-1.5" />
        </motion.div>
      </div>
    </motion.div>
  );
}