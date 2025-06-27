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
  return (
    <ClerkProvider>
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
