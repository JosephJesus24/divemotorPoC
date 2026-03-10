/**
 * lib/auth.ts
 *
 * JWT session utilities — Edge Runtime compatible (no @azure/msal-node imports).
 * Used by middleware.ts and API routes alike.
 */

import { SignJWT, jwtVerify } from 'jose'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SessionUser {
  email: string
  name:  string
  sub:   string  // homeAccountId from MSAL
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const SESSION_COOKIE   = 'dm_session'
export const PKCE_COOKIE      = 'pkce_verifier'
export const ALLOWED_DOMAINS  = ['@grupokaufmann.com', '@divemotor.com.pe']
const SESSION_DURATION_HOURS  = 8

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET env var is not set')
  return new TextEncoder().encode(secret)
}

// ─── Create session JWT ───────────────────────────────────────────────────────

export async function createSession(user: SessionUser): Promise<string> {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS)

  return new SignJWT({ email: user.email, name: user.name, sub: user.sub })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .sign(getSecret())
}

// ─── Verify session JWT ───────────────────────────────────────────────────────

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return {
      email: payload.email as string,
      name:  payload.name  as string,
      sub:   payload.sub   as string,
    }
  } catch {
    return null
  }
}

// ─── Read session from request ────────────────────────────────────────────────

export async function getSessionFromRequest(
  request: Request
): Promise<SessionUser | null> {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  if (!match) return null
  return verifySession(decodeURIComponent(match[1]))
}

// ─── Domain validation ────────────────────────────────────────────────────────

export function isAllowedDomain(email: string): boolean {
  const lower = email.toLowerCase()
  return ALLOWED_DOMAINS.some(domain => lower.endsWith(domain))
}
