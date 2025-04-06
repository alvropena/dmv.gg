import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/api/webhooks(.*)',
];

// Create a matcher for routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  ...publicRoutes,
  // Add static files patterns
  '/_next(.*)',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
]);

export default clerkMiddleware((auth, req) => {
  // If the route is public, don't require authentication
  if (isPublicRoute(req)) {
    return;
  }
  
  // Protect all other routes
  auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Always run for API routes except webhooks (which need to be public)
    '/(api(?!/webhooks).*)',
  ],
};