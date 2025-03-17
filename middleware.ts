import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware for route protection and authentication redirects
 * Handles access control for protected routes and redirects for auth pages
 */
export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isLoggedIn = !!token;
  const path = nextUrl.pathname;

  // Define protected routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/account", 
    "/settings",
    "/api/portfolio",
    "/api/education",
    "/api/experience"
  ];
  
  const isProtectedRoute = protectedPaths.some(
    (protectedPath) => 
      path === protectedPath || 
      path.startsWith(`${protectedPath}/`)
  );

  // Define authentication routes (redirect to dashboard if logged in)
  const authRoutes = ["/auth/login", "/auth/register", "/auth"];
  const isAuthRoute = authRoutes.some(
    (authPath) => 
      path === authPath || 
      path.startsWith(`${authPath}/`)
  );

  // Public API routes that don't require redirect
  const publicApiRoutes = ["/api/p/"];
  const isPublicApiRoute = publicApiRoutes.some(
    (apiPath) => path.startsWith(apiPath)
  );

  // Handle protected routes - redirect to login if not authenticated
  if (isProtectedRoute && !isLoggedIn) {
    // Store the URL they were trying to access to redirect back after login
    const returnUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?returnUrl=${returnUrl}`, req.url)
    );
  }

  // Handle auth routes - redirect to dashboard if already logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

/**
 * Configure which routes use this middleware
 * Exclude static files, images, and favicon
 */
export const config = {
  matcher: [
    // Include all paths except excluded ones
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)",
    // Include specific API routes that need protection
    "/api/portfolio/:path*",
    "/api/education/:path*",
    "/api/experience/:path*",
  ],
};
