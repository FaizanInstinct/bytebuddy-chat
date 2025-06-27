'use client';

import { useTheme } from '@/components/ThemeProvider';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <SunIcon className="h-6 w-6 text-amber-400 drop-shadow-md" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-300" />
      )}
    </motion.button>
  );
}