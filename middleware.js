import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes should be protected (require authentication)
const isProtectedRoute = createRouteMatcher([
  '/history(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is protected and the user is not authenticated,
  // they will be redirected to the sign-in page
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|api).*)',
    '/api/(.*)',
  ],
};