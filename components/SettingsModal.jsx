'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from './ThemeProvider';
import ConfirmationModal from './ConfirmationModal';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  
  // General Settings
  const [soundEffects, setSoundEffects] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  
  // Chat Settings
  const [sendOnEnter, setSendOnEnter] = useState(true);
  const [speechRecognition, setSpeechRecognition] = useState(true);
  const [imageUpload, setImageUpload] = useState(true);
  const [quickReplies, setQuickReplies] = useState(true);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // General Settings
      const storedSoundEffects = localStorage.getItem('soundEffects');
      const storedDesktopNotifications = localStorage.getItem('desktopNotifications');
      
      // Chat Settings
      const storedSendOnEnter = localStorage.getItem('sendOnEnter');
      const storedSpeechRecognition = localStorage.getItem('speechRecognition');
      const storedImageUpload = localStorage.getItem('imageUpload');
      const storedQuickReplies = localStorage.getItem('quickReplies');
      
      // Set states with stored values or defaults
      setSoundEffects(storedSoundEffects !== null ? storedSoundEffects === 'true' : true);
      setDesktopNotifications(storedDesktopNotifications !== null ? storedDesktopNotifications === 'true' : true);
      setSendOnEnter(storedSendOnEnter !== null ? storedSendOnEnter === 'true' : true);
      setSpeechRecognition(storedSpeechRecognition !== null ? storedSpeechRecognition === 'true' : true);
      setImageUpload(storedImageUpload !== null ? storedImageUpload === 'true' : true);
      setQuickReplies(storedQuickReplies !== null ? storedQuickReplies === 'true' : true);
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // General Settings
      localStorage.setItem('soundEffects', soundEffects);
      localStorage.setItem('desktopNotifications', desktopNotifications);
      
      // Chat Settings
      localStorage.setItem('sendOnEnter', sendOnEnter);
      localStorage.setItem('speechRecognition', speechRecognition);
      localStorage.setItem('imageUpload', imageUpload);
      localStorage.setItem('quickReplies', quickReplies);
    }
  }, [soundEffects, desktopNotifications, sendOnEnter, speechRecognition, imageUpload, quickReplies]);
  
  // Handle clear all conversations
  const handleClearAllConversations = () => {
    setIsConfirmationModalOpen(true);
  };
  
  const confirmClearConversations = async () => {
    try {
      const response = await fetch('/api/conversations/clear', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Show success message or notification here
        console.log('All conversations cleared successfully');
        // Optional: Add a visual notification
        if (typeof window !== 'undefined' && soundEffects) {
          // Play a sound effect if enabled
          const audio = new Audio('/notification.mp3'); // Assuming you have this file
          audio.play().catch(e => console.log('Audio play failed:', e));
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to clear conversations:', errorData.error || 'Unknown error');
        alert('Failed to clear conversations: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error clearing conversations:', error);
      alert('Error clearing conversations. Please try again later.');
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };
  
  // Handle export conversations
  const handleExportConversations = async () => {
    try {
      const response = await fetch('/api/conversations/export');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to export conversations:', errorData.error || 'Unknown error');
        alert('Failed to export conversations: ' + (errorData.error || 'Unknown error'));
        return;
      }
      
      const data = await response.json();
      
      // Check if we have data to export
      if (!data || (Array.isArray(data) && data.length === 0)) {
        alert('No conversations to export.');
        return;
      }
      
      // Create a downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bytebuddy-conversations-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Optional: Add a visual notification
      if (soundEffects) {
        // Play a sound effect if enabled
        const audio = new Audio('/notification.mp3'); // Assuming you have this file
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (error) {
      console.error('Error exporting conversations:', error);
      alert('Error exporting conversations. Please try again later.');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl max-h-[80vh] overflow-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'general' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveTab('general')}
                >
                  General
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'chat' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveTab('chat')}
                >
                  Chat
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    {/* Theme/Appearance */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Theme/Appearance</h3>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Current theme: <span className="font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You can toggle the theme using the sun/moon icon in the navigation bar.
                        </p>
                      </div>
                    </div>
                    
                    {/* Language */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Language</h3>
                      <div className="ml-4">
                        <select 
                          className="w-full max-w-xs p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          defaultValue="en"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Notifications */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Notifications</h3>
                      <div className="ml-4 space-y-3">
                        {/* Sound Effects */}
                        <div className="flex items-center justify-between">
                          <label htmlFor="sound-effects" className="text-gray-700 dark:text-gray-300">
                            Sound Effects
                          </label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="sound-effects" 
                              checked={soundEffects}
                              onChange={() => setSoundEffects(!soundEffects)}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="sound-effects" 
                              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${soundEffects ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></label>
                          </div>
                        </div>
                        
                        {/* Desktop Notifications */}
                        <div className="flex items-center justify-between">
                          <label htmlFor="desktop-notifications" className="text-gray-700 dark:text-gray-300">
                            Desktop Notifications
                          </label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="desktop-notifications" 
                              checked={desktopNotifications}
                              onChange={() => setDesktopNotifications(!desktopNotifications)}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="desktop-notifications" 
                              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${desktopNotifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'chat' && (
                  <div className="space-y-6">
                    {/* Conversation History */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Conversation History</h3>
                      <div className="ml-4 space-y-3">
                        <button
                          onClick={handleClearAllConversations}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                        >
                          Clear All Conversations
                        </button>
                        <button
                          onClick={handleExportConversations}
                          className="ml-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                        >
                          Export Conversations
                        </button>
                      </div>
                    </div>
                    
                    {/* Input Preferences */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Input Preferences</h3>
                      <div className="ml-4 space-y-3">
                        {/* Send on Enter */}
                        <div className="flex items-center justify-between">
                          <label htmlFor="send-on-enter" className="text-gray-700 dark:text-gray-300">
                            Send on Enter
                          </label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="send-on-enter" 
                              checked={sendOnEnter}
                              onChange={() => setSendOnEnter(!sendOnEnter)}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="send-on-enter" 
                              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${sendOnEnter ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></label>
                          </div>
                        </div>
                        
                        {/* Speech Recognition */}
                        <div className="flex items-center justify-between">
                          <label htmlFor="speech-recognition" className="text-gray-700 dark:text-gray-300">
                            Speech Recognition
                          </label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="speech-recognition" 
                              checked={speechRecognition}
                              onChange={() => setSpeechRecognition(!speechRecognition)}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="speech-recognition" 
                              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${speechRecognition ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></label>
                          </div>
                        </div>
                        
                        {/* Image Upload */}
                        <div className="flex items-center justify-between">
                          <label htmlFor="image-upload" className="text-gray-700 dark:text-gray-300">
                            Image Upload
                          </label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="image-upload" 
                              checked={imageUpload}
                              onChange={() => setImageUpload(!imageUpload)}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="image-upload" 
                              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${imageUpload ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Replies */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Quick Replies</h3>
                      <div className="ml-4 space-y-3">
                        {/* Enable/Disable Quick Replies */}
                        <div className="flex items-center justify-between">
                          <label htmlFor="quick-replies" className="text-gray-700 dark:text-gray-300">
                            Enable Quick Replies
                          </label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="quick-replies" 
                              checked={quickReplies}
                              onChange={() => setQuickReplies(!quickReplies)}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="quick-replies" 
                              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${quickReplies ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            message="Are you sure you want to clear all conversations? This action cannot be undone."
            onConfirm={confirmClearConversations}
            onCancel={() => setIsConfirmationModalOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;