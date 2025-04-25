import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", // Allow root path
  "/blog",
  "/cookies",
  "/pricing",
  "/privacy",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/terms",
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
