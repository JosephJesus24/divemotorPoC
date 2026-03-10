'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sparkles, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "anthony.vidal@grupokaufmann.com" → "Anthony Vidal" */
function parseNameFromEmail(email: string): string {
  const local = email.split('@')[0]           // "anthony.vidal"
  return local
    .split('.')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')                                // "Anthony Vidal"
}

/** "Anthony Vidal" → "AV" */
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase())
    .join('')
}

/**
 * Divemotor wordmark — fiel al logo real:
 * tipografía ultra-light (Helvetica Neue UltraLight), todo en mayúsculas,
 * espaciado generoso, sin icono adicional.
 */
function DivemotorWordmark() {
  return (
    <span
      className="text-white uppercase select-none tracking-[0.22em]"
      style={{
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
        fontWeight: 100,          // UltraLight — igual que el logo real
        fontSize: '19px',
        letterSpacing: '0.22em',
        lineHeight: 1,
      }}
    >
      DIVEMOTOR
    </span>
  )
}

export function NavBar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user) })
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout')
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(18px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo ────────────────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-4 group">
          <DivemotorWordmark />
          {/* Delimitador vertical */}
          <span className="h-5 w-px bg-white/20 hidden sm:block" />
          {/* Jeep® badge */}
          <span className="hidden sm:inline-block text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
            Jeep®
          </span>
        </Link>

        {/* ── Nav links ───────────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === '/'
                ? 'text-white bg-white/10'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Catálogo
          </Link>
        </nav>

        {/* ── Right side: AI pill + user ──────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-white/40 border border-white/10 rounded-full px-3 py-1.5">
            <Sparkles size={11} className="text-accent" />
            NanoBanana AI
          </div>

          {user && (
            <div className="flex items-center gap-2.5">

              {/* ── Avatar + info ─────────────────────────────────────────── */}
              <div className="flex items-center gap-2.5">

                {/* Initials circle */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-accent/40"
                  style={{ background: 'rgba(220,38,38,0.12)' }}
                >
                  <span className="text-[11px] font-bold text-accent leading-none">
                    {getInitials(parseNameFromEmail(user.email))}
                  </span>
                </div>

                {/* Name + role — visible solo en md+ */}
                <div className="hidden md:flex flex-col leading-tight gap-0.5">
                  <span className="text-[13px] font-medium text-white/90 whitespace-nowrap">
                    {parseNameFromEmail(user.email)}
                  </span>
                  <span className="text-[10px] text-white/35 whitespace-nowrap">
                    Asesor Comercial&nbsp;·&nbsp;
                    <span className="text-accent/70">Jeep®</span>
                  </span>
                </div>
              </div>

              {/* Separador vertical */}
              <span className="hidden md:block h-6 w-px bg-white/10" />

              {/* ── Logout ────────────────────────────────────────────────── */}
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/80 transition-colors px-1 py-1"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline text-[11px]">Salir</span>
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Franja roja inferior — acento de marca */}
      <div className="h-[2px] bg-accent" />
    </header>
  )
}
