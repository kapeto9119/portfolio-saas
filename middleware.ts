import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req }); // Retrieves session token

  const isLoggedIn = !!token;

  // Protected routes - must be logged in
  const protectedPaths = ["/dashboard", "/account", "/settings"];
  const isProtectedRoute = protectedPaths.some(
    (path) => nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
  );

  // Auth routes - redirect to dashboard if already logged in
  const authRoutes = ["/auth/login", "/auth/register", "/auth"];
  const isAuthRoute = authRoutes.some(
    (path) => nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
  );

  if (isProtectedRoute && !isLoggedIn) {
    // Redirect to login if trying to access a protected route while not logged in
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthRoute && isLoggedIn) {
    // Redirect to dashboard if trying to access auth routes while logged in
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
