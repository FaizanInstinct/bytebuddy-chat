'use client';

import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { SignInButton, SignOutButton, UserButton, useAuth } from '@clerk/nextjs';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-green-100 dark:border-green-900 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">ByteBuddy</h1>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">AI Assistant</p>
            </div>
          </motion.a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white font-medium transition-all duration-200 p-2 rounded-md w-20 h-10 flex items-center justify-center"
            >
              Chat
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              href="/history"
              className="text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white font-medium transition-all duration-200 p-2 rounded-md w-20 h-10 flex items-center justify-center"
            >
              History
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white font-medium transition-all duration-200 p-2 rounded-md w-20 h-10 flex items-center justify-center"
            >
              About
            </motion.a>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400",
                "hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              )}
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </motion.button>

            {/* User Authentication */}
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-md"
                    }
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:block"
                >
                  <SignOutButton>
                    <button className="text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white font-medium transition-all duration-200 p-2 rounded-md w-20 h-10 flex items-center justify-center">
                      Sign Out
                    </button>
                  </SignOutButton>
                </motion.div>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SignInButton>
                  <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all duration-300 font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}