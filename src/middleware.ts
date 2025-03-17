import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Get the token using next-auth's getToken helper
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const isAuthenticated = !!token
  const pathname = request.nextUrl.pathname

  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/account', '/settings']
  
  // Define authentication routes (login/register)
  const authRoutes = ['/login', '/register', '/auth']

  // If the user is not logged in and trying to access a protected route
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is logged in and trying to access auth routes
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/account/:path*', '/settings/:path*', '/auth/:path*'],
} 