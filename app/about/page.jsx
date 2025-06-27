// Initial content for the about page

'use client'; // Add client directive for using hooks like useState, useEffect

import { useState, useEffect } from 'react';

export default function AboutPage() {
  const descriptions = [
    "Your friendly AI companion for all your questions.",
    "Helping you navigate information with ease.",
    "Always ready to chat and assist you."
  ];

  const [currentDescription, setCurrentDescription] = useState(descriptions[0]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this email to your backend
    console.log('Subscribing with:', firstName, lastName, email);
    setSubscribeStatus({ type: 'success', message: 'Thank you for subscribing!' });
    setFirstName('');
    setLastName('');
    setEmail(''); // Clear the email input
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescription(prevDescription => {
        const currentIndex = descriptions.indexOf(prevDescription);
        const nextIndex = (currentIndex + 1) % descriptions.length;
        return descriptions[nextIndex];
      });
    }, 5000); // Change description every 5 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="text-center mb-12">
          <div className="inline-block w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="h-12 w-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75c0 2.485 2.514 4.5 5.625 4.5.504 0 .995-.035 1.47-.102a.75.75 0 01.675.21l2.347 2.347c.527.527 1.433.154 1.433-.592v-1.342a.75.75 0 01.75-.75h.375c3.111 0 5.625-2.015 5.625-4.5v-3c0-2.485-2.514-4.5-5.625-4.5h-6c-3.111 0-5.625 2.015-5.625 4.5v3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 blinking-heading">About ByteBuddy</h1>
        </div>

        <div className="prose prose-green dark:prose-invert max-w-none mb-12 w-full">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 blinking-description">{currentDescription}</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">ByteBuddy aims to make AI accessible to everyone. We believe in creating tools that enhance human capabilities rather than replace them.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Features</h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
            <li className="mb-2">Natural conversation with advanced AI</li>
            <li className="mb-2">Conversation history for registered users</li>
            <li className="mb-2">Dark mode for comfortable viewing</li>
            <li className="mb-2">Quick replies for common questions</li>
            <li>Emoji reactions to make conversations more expressive</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl shadow-md border border-green-100 dark:border-green-800 lg:w-1/2 lg:sticky lg:top-8 lg:self-start">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">Stay Updated</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">Subscribe to our newsletter to get the latest updates and news.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name" 
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white" 
                required 
              />
            </div>
            <div>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name" 
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white" 
                required 
              />
            </div>
            <div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Subscribe
            </button>
          </form>
          
          {subscribeStatus && (
            <div className={`mt-4 p-3 rounded-md ${subscribeStatus.type === 'success' ? 'bg-green-100 dark:bg-green-800/40 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'}`}>
              {subscribeStatus.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}