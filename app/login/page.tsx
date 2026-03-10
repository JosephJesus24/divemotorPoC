'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

const ERROR_MESSAGES: Record<string, string> = {
  domain:      'Tu cuenta no pertenece a un dominio corporativo autorizado.',
  microsoft:   'Ocurrió un error durante la autenticación con Microsoft.',
  no_code:     'No se recibió el código de autorización. Intenta nuevamente.',
  no_verifier: 'La sesión de inicio de sesión expiró. Intenta nuevamente.',
  auth_failed: 'No se pudo completar la autenticación. Intenta nuevamente.',
}

const BYPASS = process.env.NEXT_PUBLIC_AUTH_BYPASS_ENABLED === 'true'

function LoginContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const errorKey     = searchParams.get('error')

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(
    errorKey ? (ERROR_MESSAGES[errorKey] ?? 'Error desconocido.') : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (BYPASS) {
      // Demo mode: POST credentials to bypass route
      try {
        const res  = await fetch('/api/auth/bypass', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email, name: email.split('@')[0] }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? 'Error al iniciar sesión.')
          setLoading(false)
          return
        }
        router.push('/')
        router.refresh()
      } catch {
        setError('Error de conexión. Intenta nuevamente.')
        setLoading(false)
      }
    } else {
      // Production: redirect to Microsoft login
      try {
        const res  = await fetch('/api/auth/login')
        const data = await res.json()
        if (data.url) {
          window.location.assign(data.url)
        } else {
          setError('No se pudo obtener la URL de login.')
          setLoading(false)
        }
      } catch {
        setError('Error de conexión. Intenta nuevamente.')
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <span
            className="text-white uppercase tracking-widest text-3xl select-none"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 100 }}
          >
            Divemotor
          </span>
          <div className="mt-2 text-xs text-zinc-500 uppercase tracking-widest">
            Vehicle Showroom AI
          </div>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-white text-xl font-semibold mb-1">Acceso corporativo</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Ingresa con tu cuenta Microsoft corporativa.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-5 bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Correo corporativo</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="usuario@grupokaufmann.com"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white text-sm rounded-lg px-3 py-2.5 placeholder-zinc-600 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-zinc-500 outline-none text-white text-sm rounded-lg px-3 py-2.5 placeholder-zinc-600 transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-medium rounded-lg px-4 py-3 mt-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {/* Microsoft logo */}
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
                <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión con Microsoft'}
            </button>
          </form>

          <p className="mt-5 text-xs text-zinc-600 text-center">
            Solo cuentas <span className="text-zinc-500">@grupokaufmann.com</span> y{' '}
            <span className="text-zinc-500">@divemotor.com.pe</span>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-700 text-xs mt-6">
          Powered by <span className="text-zinc-500">NanoBanana AI</span>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
