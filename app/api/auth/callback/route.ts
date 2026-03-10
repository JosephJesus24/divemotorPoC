import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode } from '@/lib/msal'
import { createSession, isAllowedDomain, SESSION_COOKIE, PKCE_COOKIE } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const baseUrl = () =>
  process.env.AZURE_AD_REDIRECT_URI?.replace('/api/auth/callback', '') ??
  'http://localhost:3000'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  // Microsoft returned an error
  if (error) {
    console.error('[auth/callback] Microsoft error:', error, searchParams.get('error_description'))
    return NextResponse.redirect(`${baseUrl()}/login?error=microsoft`)
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl()}/login?error=no_code`)
  }

  // Read PKCE verifier from cookie
  const verifier = request.cookies.get(PKCE_COOKIE)?.value
  if (!verifier) {
    return NextResponse.redirect(`${baseUrl()}/login?error=no_verifier`)
  }

  try {
    const user = await exchangeCode(code, verifier)

    // Validate corporate domain
    if (!isAllowedDomain(user.email)) {
      return NextResponse.redirect(`${baseUrl()}/login?error=domain`)
    }

    // Create session JWT
    const sessionToken = await createSession(user)

    const response = NextResponse.redirect(`${baseUrl()}/`)

    // Set session cookie
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 8, // 8 hours
      path:     '/',
    })

    // Clear PKCE verifier cookie
    response.cookies.set(PKCE_COOKIE, '', {
      httpOnly: true,
      maxAge:   0,
      path:     '/',
    })

    return response
  } catch (err) {
    console.error('[auth/callback]', err)
    return NextResponse.redirect(`${baseUrl()}/login?error=auth_failed`)
  }
}
