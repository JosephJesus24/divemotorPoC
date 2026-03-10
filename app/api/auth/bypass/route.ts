import { NextRequest, NextResponse } from 'next/server'
import { createSession, isAllowedDomain, SESSION_COOKIE } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (process.env.AUTH_BYPASS_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Bypass not enabled' }, { status: 403 })
  }

  const { email, name } = await request.json()

  if (!email || !isAllowedDomain(email)) {
    return NextResponse.json(
      { error: 'Correo no pertenece a un dominio corporativo autorizado.' },
      { status: 400 }
    )
  }

  const sessionToken = await createSession({
    email,
    name: name || email.split('@')[0],
    sub:  'bypass-user',
  })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 8,
    path:     '/',
  })

  return response
}
