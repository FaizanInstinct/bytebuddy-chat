'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import { cn, formatTime, generateId } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';
import EmojiPicker from './EmojiPicker';
import SpeechRecognition from './SpeechRecognition';
import ImageUploadButton from './ImageUploadButton';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: generateId(),
      text: "Hello! I'm ByteBuddy, your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  
  const { userId, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationIdParam = searchParams.get('conversationId');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to adjust textarea height when input text changes programmatically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`;
    }
  }, [inputText]);

  // Load conversation if conversationId is provided in URL and it's different from current
  useEffect(() => {
    if (conversationIdParam && isLoaded && isSignedIn && conversationIdParam !== conversationId) {
      loadConversation(conversationIdParam);
    }
  }, [conversationIdParam, isSignedIn, isLoaded, conversationId]);

  const loadConversation = async (id) => {
    // Wait for authentication to be loaded
    if (!isLoaded) {
      return;
    }
    
    // Require authentication for loading conversations
    if (!isSignedIn) {
      setError('Please sign in to access your conversations.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat?conversationId=${id}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please sign in to access your conversations.');
        } else if (response.status === 403) {
          setError('You do not have access to this conversation.');
        } else if (response.status === 404) {
          // Conversation not found - this might be a new conversation, don't show error
          console.log('Conversation not found, might be a new conversation');
        } else {
          setError('Failed to load conversation. Please try again.');
        }
        return;
      }
      
      const data = await response.json();
      
      if (data.messages && data.messages.length > 0) {
        const formattedMessages = data.messages.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(msg.createdAt),
        }));
        
        setMessages(formattedMessages);
        setConversationId(id);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (file, previewUrl) => {
    setSelectedImage(file);
    setImageUrl(previewUrl);
  };

  const handleRemoveImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl); // Clean up the object URL
    }
    setSelectedImage(null);
    setImageUrl(null);
  };

  const handleSendMessage = async (text = inputText.trim()) => {
    // Don't send if there's no text and no image
    if (!text && !selectedImage) return;

    let userMessage = {
      id: generateId(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    // If there's an image, upload it first
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append('image', selectedImage);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        userMessage.imageUrl = uploadData.imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image. Please try again.');
        return;
      }
    }

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setError(null);
    handleRemoveImage(); // Clear the image after sending

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationId,
          imageUrl: userMessage.imageUrl, // Pass the image URL to the API
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          setError('You do not have access to this conversation.');
          return;
        } else {
          throw new Error(errorData.error || 'Failed to get response');
        }
      }

      const data = await response.json();
      
      // Update conversation ID if this is a new conversation and user is signed in
      if (data.conversationId && !conversationId && isSignedIn) {
        setConversationId(data.conversationId);
        // Update URL with conversation ID without refreshing the page
        router.push(`/?conversationId=${data.conversationId}`, { scroll: false });
      }

      const botResponse = {
        id: generateId(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        intent: data.intent,
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Optional: Speak the response using Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        // Uncomment to enable auto-speech
        // speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      const errorMessage = {
        id: generateId(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setInputText(prev => {
      const newText = prev + ' ' + transcript;
      // The height adjustment will happen in the useEffect that watches inputText
      return newText;
    });
    // Focus the input after voice transcript is added
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleVoiceError = (error) => {
    setError(`Voice recognition error: ${error}`);
    setTimeout(() => setError(null), 3000);
  };

  const handleEmojiSelect = (emoji) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // For Shift+Enter, we let the default behavior happen (new line)
      // But we should also make sure the textarea resizes
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = 'auto';
          inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`;
        }
      }, 0);
    }
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: generateId(),
        text: "Hello! I'm ByteBuddy, your AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
    setConversationId(null);
    router.push('/', { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto px-4 py-8">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-6 scrollbar-thin scrollbar-thumb-green-200 dark:scrollbar-thumb-green-800 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
        
        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 1 && (
        <div className="mb-4">
          <QuickReplies onSelect={handleQuickReply} />
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-2">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-green-100 dark:border-green-900 p-4">
          <div className="flex items-end space-x-2">
            {/* Emoji Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-full transition-colors"
              >
                <FaceSmileIcon className="h-6 w-6" />
              </motion.button>
              
              {showEmojiPicker && (
                <EmojiPicker 
                  onEmojiSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  // Auto-resize the textarea
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={cn(
                  "w-full px-4 py-3 pr-12 border rounded-2xl",
                  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
                  "resize-none max-h-32 min-h-[48px]",
                  "placeholder-gray-400 dark:placeholder-gray-500",
                  "text-black dark:text-white",
                  "border-green-200 dark:border-green-800",
                  "bg-white dark:bg-gray-800",
                  "transition-height duration-100 ease-in-out"
                )}
                rows={1}
                style={{
                  height: '48px',
                  minHeight: '48px',
                  maxHeight: '128px',
                  overflow: 'hidden'
                }}
              />
              
              {/* Image Preview */}
              {selectedImage && (
                <div className="absolute -top-16 left-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-200 dark:border-green-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 mr-2">
                      Image selected
                    </span>
                    <button 
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Input Button */}
            <SpeechRecognition 
              onTranscript={handleVoiceTranscript}
              onError={handleVoiceError}
            />

            {/* Image Upload Button */}
            <ImageUploadButton 
              onImageSelect={handleImageSelect}
            />

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() && !selectedImage || isTyping}
              className={cn(
                "p-3 rounded-full transition-all duration-200",
                (inputText.trim() || selectedImage) && !isTyping
                  ? "bg-green-500 text-white hover:bg-green-600 shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              )}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </motion.button>
          </div>
          
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Auth Prompt */}
          {!isSignedIn && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg text-sm text-center"
            >
              <div className="font-medium mb-1">💡 Tip: Sign in for conversation history</div>
              <div>You can chat anonymously, but sign in to save and continue your conversations later</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}