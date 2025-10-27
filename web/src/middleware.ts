import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/(.*)",  // Make all routes public temporarily for testing
  "/sign-in",
  "/sign-up"
]);

export default clerkMiddleware((auth, req) => {
  // No need to call auth().protect()
  // Just return for public routes, Clerk will handle the rest
  if (isPublicRoute(req)) return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};