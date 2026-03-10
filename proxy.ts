import { NextRequest, NextResponse } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimization)
     *  - favicon.ico
     *  - /images/*     (catalog images in public/)
     *  - /api/auth/*   (auth endpoints must be public)
     *  - /login        (login page must be public)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|images/|api/auth/).*)',
  ],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page without a session
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // Read session cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value

  if (!token) {
    return redirectToLogin(request)
  }

  // Verify JWT (jose — Edge Runtime compatible)
  const user = await verifySession(token)
  if (!user) {
    return redirectToLogin(request)
  }

  // Valid session — continue
  return NextResponse.next()
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl)
}
