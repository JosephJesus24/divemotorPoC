/**
 * lib/msal.ts
 *
 * MSAL (Microsoft Authentication Library) client for Azure AD OAuth2 + PKCE.
 * Node.js runtime only — NOT compatible with Edge Runtime.
 * Import only from API routes (app/api/auth/*).
 */

import {
  ConfidentialClientApplication,
  CryptoProvider,
  Configuration,
  LogLevel,
} from '@azure/msal-node'

// ─── Config ───────────────────────────────────────────────────────────────────

function getMsalConfig(): Configuration {
  const tenantId     = process.env.AZURE_AD_TENANT_ID
  const clientId     = process.env.AZURE_AD_CLIENT_ID
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      'Missing Azure AD config. Set AZURE_AD_TENANT_ID, AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET.'
    )
  }

  return {
    auth: {
      clientId,
      clientSecret,
      authority: `https://login.microsoftonline.com/${tenantId}`,
    },
    system: {
      loggerOptions: {
        loggerCallback: () => {},
        piiLoggingEnabled: false,
        logLevel: LogLevel.Warning,
      },
    },
  }
}

// Each API route invocation creates a fresh client — no shared in-memory token cache.
export function getMsalClient(): ConfidentialClientApplication {
  return new ConfidentialClientApplication(getMsalConfig())
}

// ─── PKCE helpers ─────────────────────────────────────────────────────────────

const cryptoProvider = new CryptoProvider()

export async function generatePkceCodes(): Promise<{ verifier: string; challenge: string }> {
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes()
  return { verifier, challenge }
}

// ─── Generate Microsoft login URL ─────────────────────────────────────────────

export async function getLoginUrl(codeChallenge: string): Promise<string> {
  const redirectUri = process.env.AZURE_AD_REDIRECT_URI
  if (!redirectUri) throw new Error('AZURE_AD_REDIRECT_URI env var is not set')

  const client = getMsalClient()
  return client.getAuthCodeUrl({
    redirectUri,
    scopes:              ['openid', 'profile', 'email'],
    codeChallenge,
    codeChallengeMethod: 'S256',
    prompt:              'select_account',
  })
}

// ─── Exchange authorization code for token ────────────────────────────────────

export async function exchangeCode(
  code:         string,
  codeVerifier: string,
): Promise<{ email: string; name: string; sub: string }> {
  const redirectUri = process.env.AZURE_AD_REDIRECT_URI
  if (!redirectUri) throw new Error('AZURE_AD_REDIRECT_URI env var is not set')

  const client = getMsalClient()
  const result = await client.acquireTokenByCode({
    code,
    redirectUri,
    scopes:       ['openid', 'profile', 'email'],
    codeVerifier,
  })

  if (!result?.account) throw new Error('No account in token response')

  return {
    email: result.account.username,
    name:  result.account.name ?? result.account.username,
    sub:   result.account.homeAccountId,
  }
}
