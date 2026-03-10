import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  // Return JSON so the caller (NavBar) handles navigation — avoids hardcoded URL issues
  const response = NextResponse.json({ ok: true })

  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    maxAge:   0,
    path:     '/',
  })

  return response
}
