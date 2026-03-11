'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'

function DivemotorWordmark() {
  return (
    <span
      className="text-white uppercase select-none tracking-[0.22em]"
      style={{
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
        fontWeight: 100,
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(18px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo ────────────────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-4 group">
          <DivemotorWordmark />

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

        {/* ── Right side: AI pill ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-white/40 border border-white/10 rounded-full px-3 py-1.5">
            <Sparkles size={11} className="text-accent" />
            NanoBanana AI
          </div>
        </div>
      </div>

      {/* Franja roja inferior — acento de marca */}
      <div className="h-[2px] bg-accent" />
    </header>
  )
}
