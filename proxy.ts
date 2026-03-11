import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|images/|api/auth/).*)',
  ],
}

export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}
