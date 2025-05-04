import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/", // Allow root path
  "/blog",
  "/cookies",
  "/pricing",
  "/privacy",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/terms",
  "/admin(.*)", // Add admin routes
  "/api/webhooks(.*)", // Allow Stripe webhook endpoint
  "/api/prices(.*)", // Allow public access to pricing data
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Run for API routes except webhooks
    "/(api(?!/webhooks)|trpc)(.*)",
  ],
};

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  if (host?.startsWith('admin.')) {
    // Rewrite all requests to the admin subdomain to the (admin) route group
    return NextResponse.rewrite(new URL('/(admin)', request.url));
  }
  // Default: continue as normal
  return NextResponse.next();
}
