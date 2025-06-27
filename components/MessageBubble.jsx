'use client';

import { motion } from 'framer-motion';
import { UserIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { cn, formatTime } from '@/lib/utils';
import Image from 'next/image';

export default function MessageBubble({ message }) {
  const isBot = message.sender === 'bot';
  const isUser = message.sender === 'user';
  const hasImage = message.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        duration: 0.3 
      }}
      className={cn(
        "flex items-start space-x-3 max-w-4xl mx-auto",
        isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isBot 
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
        )}
      >
        {isBot ? (
          <CpuChipIcon className="h-4 w-4" />
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col space-y-1 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Sender Name */}
        <span className={cn(
          "text-xs font-medium px-1",
          isBot ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
        )}>
          {isBot ? "ByteBuddy" : "You"}
        </span>

        {/* Message Bubble */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          className={cn(
            "relative px-4 py-3 rounded-2xl shadow-sm",
            "break-words whitespace-pre-wrap",
            isBot 
              ? "bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900 text-gray-800 dark:text-gray-200" 
              : "bg-gradient-to-r from-green-500 to-green-600 text-white"
          )}
        >
          {/* Message Text */}
          <p className="text-sm leading-relaxed">{message.text}</p>
          
          {/* Image if present */}
          {hasImage && (
            <div className="mt-2 rounded-lg overflow-hidden">
              <Image 
                src={message.imageUrl} 
                alt="Uploaded image" 
                width={300} 
                height={200} 
                className="object-contain max-w-full h-auto"
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}
          
          {/* Message Tail */}
          <div className={cn(
            "absolute top-3 w-3 h-3 transform rotate-45",
            isBot 
              ? "bg-white dark:bg-gray-800 border-l border-b border-green-100 dark:border-green-900 -left-1.5" 
              : "bg-green-500 -right-1.5"
          )} />
        </motion.div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 dark:text-gray-500 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}