import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes that anyone can hit without a session.
// Everything else falls through but we don't auto-protect — protected
// pages do their own `await auth.protect()` server-side as needed.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/insights(.*)",
  "/directory(.*)",
  "/feed(.*)",
  "/events(.*)",
  "/contributors(.*)",
  "/terms",
  "/privacy",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next internals + static files
    "/((?!_next|.*\\..*).*)",
    // Always run on API routes
    "/(api|trpc)(.*)",
  ],
};
