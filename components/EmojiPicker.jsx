'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const emojiCategories = {
  smileys: {
    name: "Smileys & People",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"]
  },
  gestures: {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏", "🙌", "🤝", "🙏"]
  },
  hearts: {
    name: "Hearts",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"]
  },
  objects: {
    name: "Objects",
    emojis: ["💬", "💭", "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💣", "💤", "🎉", "🎊", "🎈", "🎁", "🎀", "🎗️", "🎟️", "🎫"]
  }
};

export default function EmojiPicker({ onEmojiSelect, onClose }) {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={pickerRef}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-3 w-80 max-h-64 overflow-y-auto z-50"
      >
        <div className="space-y-3">
          {Object.entries(emojiCategories).map(([key, category]) => (
            <div key={key}>
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                {category.name}
              </h4>
              <div className="grid grid-cols-8 gap-1">
                {category.emojis.map((emoji, index) => (
                  <motion.button
                    key={`${key}-${index}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEmojiSelect(emoji)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center text-lg",
                      "hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors duration-150",
                      "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                    )}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Close button */}
        <div className="flex justify-end mt-3 pt-2 border-t border-green-100 dark:border-green-800">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1 rounded"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}