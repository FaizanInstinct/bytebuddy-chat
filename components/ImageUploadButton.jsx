'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon } from '@heroicons/react/24/outline';

const ImageUploadButton = ({ onImageSelect }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create a local URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      // Pass the file and URL to the parent component
      onImageSelect(file, imageUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = null;
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        disabled={isUploading}
        className={`p-2 rounded-full transition-all duration-200 ${
          isUploading
            ? 'bg-gray-300 text-gray-500 cursor-wait'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
        }`}
        title="Upload image"
      >
        <PhotoIcon className="w-5 h-5" />
      </motion.button>
    </>
  );
};

export default ImageUploadButton;