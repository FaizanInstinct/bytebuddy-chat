# 🤖 ByteBuddy Chat

An intelligent AI assistant chatbot built with Next.js that provides conversational AI capabilities to answer user queries with advanced features like conversation history, image uploads, and multi-modal interactions.

## 🎯 Problem Statement

In today's fast-paced digital world, users need quick, intelligent, and contextual responses to their queries. Traditional chatbots often lack:
- **Conversation continuity** - Users lose context when switching between sessions
- **Multi-modal support** - Limited ability to process images alongside text
- **Personalized experience** - No user-specific conversation history
- **Advanced AI capabilities** - Basic responses without intelligent context understanding

ByteBuddy Chat solves these problems by providing a sophisticated AI assistant that maintains conversation history, supports image uploads, and delivers intelligent responses using state-of-the-art AI models.

## ✨ Key Features

- 🧠 **Intelligent AI Responses** - Powered by Cohere AI for natural language understanding
- 💬 **Conversation History** - Persistent chat history with user authentication
- 🖼️ **Image Upload Support** - Multi-modal conversations with image analysis
- 🔐 **User Authentication** - Secure sign-in/sign-up with Clerk
- 🌙 **Dark/Light Theme** - Beautiful UI with theme switching
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎤 **Speech Recognition** - Voice input capabilities
- 😊 **Emoji Support** - Rich text interactions with emoji picker
- 📤 **Export Conversations** - Download chat history
- 🗑️ **Conversation Management** - Clear and organize chat history
- ⚡ **Real-time Updates** - Instant message delivery and typing indicators

## 🛠️ Technologies Used

### Frontend
- **Next.js 15.3.2** - React framework with App Router
- **React 19.0.0** - UI library
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 11.11.17** - Animation library
- **Lucide React 0.460.0** - Icon library
- **Next Themes 0.4.6** - Theme management

### Backend & Database
- **Prisma 6.8.2** - Database ORM
- **PostgreSQL** - Primary database
- **Next.js API Routes** - Serverless API endpoints

### AI & ML
- **Cohere AI 7.17.1** - Primary AI model for chat responses
- **Google Generative AI 0.24.1** - Additional AI capabilities

### Authentication & Security
- **Clerk 6.20.2** - User authentication and management

### Additional Libraries
- **React Hot Toast 2.5.2** - Notification system
- **React Speech Kit 3.0.1** - Speech recognition
- **Date-fns 4.1.0** - Date manipulation
- **UUID 11.0.3** - Unique identifier generation
- **Heroicons 2.1.5** - Additional icons

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **PostgreSQL** database
- **Clerk** account for authentication
- **Cohere AI** API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/FaizanInstinct/bytebuddy-chat.git
cd bytebuddy-chat
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bytebuddy_chat"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cohere AI
COHERE_API_KEY=your_cohere_api_key

# Google AI (Optional)
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
