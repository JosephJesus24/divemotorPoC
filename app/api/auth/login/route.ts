import { NextResponse } from 'next/server'
import { generatePkceCodes, getLoginUrl } from '@/lib/msal'
import { PKCE_COOKIE } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  // If bypass is enabled (no real Azure credentials), redirect straight to bypass
  if (process.env.AUTH_BYPASS_ENABLED === 'true') {
    return NextResponse.json({ url: '/api/auth/bypass' })
  }

  try {
    const { verifier, challenge } = await generatePkceCodes()
    const url = await getLoginUrl(challenge)

    const response = NextResponse.json({ url })

    // Store PKCE verifier in short-lived HTTP-only cookie
    response.cookies.set(PKCE_COOKIE, verifier, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 10, // 10 minutes
      path:     '/',
    })

    return response
  } catch (error) {
    console.error('[auth/login]', error)
    return NextResponse.json(
      { error: 'Failed to generate login URL' },
      { status: 500 }
    )
  }
}
