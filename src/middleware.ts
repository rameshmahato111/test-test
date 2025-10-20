import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { tokenKey } from './lib/localStorage'

const protectedRoutes = [
  '/profile',
  '/bookings',
  '/reviews',
  '/rewards',
  '/travel-hub',
  '/delete',
  '/api/get-blogs',
  '/create-bucket',
  '/interest',
  '/payment',
  '/booking-detail',
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get(tokenKey)
  
  // Add paths that should be protected
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/reviews/:path*', '/pick-interest/:path*', '/travel-hub/:path*', '/interest/:path*', '/bookings/:path*', '/rewards/:path*', '/settings/:path*',
     '/delete/:path*',
     '/payment/:path*',
     '/booking-detail/:path*'
  ]
} 