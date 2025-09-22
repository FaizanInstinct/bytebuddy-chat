import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes should be protected (require authentication)
const isProtectedRoute = createRouteMatcher([
  '/history(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      console.warn('Clerk environment variables not properly configured');
      // Allow the request to continue without authentication if env vars are missing
      return;
    }

    // If the route is protected and the user is not authenticated,
    // they will be redirected to the sign-in page
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // Allow the request to continue to prevent complete failure
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};