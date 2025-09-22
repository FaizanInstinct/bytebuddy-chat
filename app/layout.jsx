import "./globals.css";
import ClientCleanupTrigger from '@/components/ClientCleanupTrigger';
import { ClerkProvider } from '@clerk/nextjs';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: "ByteBuddy - AI Chat Assistant",
  description: "Your intelligent chat companion powered by AI",
  icons: {
    icon: '/bytebuddy_logo.svg',
    type: 'image/svg+xml',
  },
};

export default function RootLayout({ children }) {
  // Provide fallback for build time when env vars might not be available
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';
  
  // Check if we have a valid Clerk key
  const hasValidClerkKey = clerkPublishableKey && clerkPublishableKey !== 'pk_test_placeholder';
  
  if (!hasValidClerkKey) {
    console.warn('Clerk publishable key not found, authentication features may not work');
  }
  
  return (
    <ClerkProvider 
      publishableKey={clerkPublishableKey}
      appearance={{
        elements: {
          // Prevent Clerk from throwing errors during SSR
          rootBox: "clerk-root-box"
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased flex flex-col min-h-screen">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            <main className="flex-grow">
              {children}
              <ClientCleanupTrigger />
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
