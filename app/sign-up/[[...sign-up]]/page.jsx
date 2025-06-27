"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from 'framer-motion';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="h-10 w-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75c0 2.485 2.514 4.5 5.625 4.5.504 0 .995-.035 1.47-.102a.75.75 0 01.675.21l2.347 2.347c.527.527 1.433.154 1.433-.592v-1.342a.75.75 0 01.75-.75h.375c3.111 0 5.625-2.015 5.625-4.5v-3c0-2.485-2.514-4.5-5.625-4.5h-6c-3.111 0-5.625 2.015-5.625 4.5v3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join ByteBuddy</h1>
          <p className="text-gray-600">Create an account to save your conversations</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white",
                footerActionLink: "text-green-600 hover:text-green-700",
                card: "shadow-none",
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}