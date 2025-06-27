'use client';

import React, { useState, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';

const SpeechRecognition = ({ onTranscript, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
        };
        
        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          if (event.results[0].isFinal) {
            onTranscript(transcript);
            setIsListening(false);
          }
        };
        
        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (onError) {
            onError(event.error);
          }
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, [onTranscript, onError]);

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-gray-400 text-sm">
        Speech recognition not supported
      </div>
    );
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`p-2 rounded-full transition-all duration-200 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
      }`}
      title={isListening ? 'Stop recording' : 'Start voice input'}
      disabled={!recognition}
    >
      {isListening ? (
        <StopIcon className="w-5 h-5" />
      ) : (
        <MicrophoneIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default SpeechRecognition;