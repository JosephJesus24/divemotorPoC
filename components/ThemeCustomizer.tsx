'use client'

import { useState, useEffect } from 'react'
import { Settings, Check, Moon, Sun, X } from 'lucide-react'

// Brand color palette
const COLORS = [
  { id: 'torch-red',  label: 'Torch Red',  hex: '#fe142f', hover: '#ff3347', muted: '#801020' },
  { id: 'brand-blue', label: 'Brand Blue', hex: '#00adef', hover: '#00c4ff', muted: '#004d6e' },
  { id: 'dark-blue',  label: 'Dark Blue',  hex: '#0088c6', hover: '#00a8e8', muted: '#00446b' },
  { id: 'light-blue', label: 'Light Blue', hex: '#b9e8fb', hover: '#cdf0ff', muted: '#5fb0d0' },
  { id: 'charcoal',   label: 'Charcoal',   hex: '#333333', hover: '#4a4a4a', muted: '#1a1a1a' },
]

type ThemeType = 'dark' | 'light'

function applyAccent(hex: string, hover: string, muted: string) {
  const root = document.documentElement
  root.style.setProperty('--accent',       hex)
  root.style.setProperty('--accent-hover', hover)
  root.style.setProperty('--accent-muted', muted)
}

function applyTheme(theme: ThemeType) {
  const root = document.documentElement
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light')
    root.classList.remove('dark')
  } else {
    root.removeAttribute('data-theme')
    root.classList.add('dark')
  }
}

export function ThemeCustomizer() {
  const [open,        setOpen]        = useState(false)
  const [activeColor, setActiveColor] = useState('torch-red')
  const [theme,       setTheme]       = useState<ThemeType>('dark')

  useEffect(() => {
    try {
      const savedId    = localStorage.getItem('dm_accent_id')
      const savedTheme = localStorage.getItem('dm_theme') as ThemeType | null

      if (savedId) {
        const found = COLORS.find((c) => c.id === savedId)
        if (found) {
          setActiveColor(found.id)
          applyAccent(found.hex, found.hover, found.muted)
        }
      }
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme)
        applyTheme(savedTheme)
      }
    } catch {
      /* localStorage not available */
    }
  }, [])

  const handleColorSelect = (color: (typeof COLORS)[number]) => {
    setActiveColor(color.id)
    applyAccent(color.hex, color.hover, color.muted)
    try {
      localStorage.setItem('dm_accent_id', color.id)
      localStorage.setItem('dm_accent',    color.hex)
    } catch { /* noop */ }
  }

  const handleThemeSelect = (t: ThemeType) => {
    setTheme(t)
    applyTheme(t)
    try {
      localStorage.setItem('dm_theme', t)
    } catch { /* noop */ }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Personalizar tema"
        className="fixed top-1/2 -translate-y-1/2 right-0 z-50 w-10 h-10 rounded-l-xl flex items-center justify-center bg-accent text-white shadow-lg hover:w-12 transition-all duration-200"
      >
        <Settings size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={
          'fixed top-0 right-0 h-full z-50 w-72 ' +
          'bg-bg-secondary border-l border-border shadow-2xl ' +
          'flex flex-col ' +
          'transition-transform duration-300 ease-in-out ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Personalizar</h2>
            <p className="text-xs text-text-muted mt-0.5">Colores y tema visual</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Color principal
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  title={color.label}
                  onClick={() => handleColorSelect(color)}
                  className="relative w-9 h-9 rounded-full transition-all duration-150 hover:scale-110 focus:outline-none"
                  style={{
                    backgroundColor: color.hex,
                    outline: activeColor === color.id ? ('2px solid ' + color.hex) : '2px solid transparent',
                    outlineOffset: '3px',
                  }}
                >
                  {activeColor === color.id && (
                    <Check
                      size={14}
                      strokeWidth={3}
                      className="absolute inset-0 m-auto"
                      style={{ color: color.id === 'light-blue' ? '#004d6e' : '#ffffff' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3">
              {COLORS.find((c) => c.id === activeColor)?.label}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Tema
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeSelect('dark')}
                className={
                  'flex flex-col items-center gap-2 rounded-xl border py-4 px-3 transition-all duration-150 ' +
                  (theme === 'dark'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-bg-card text-text-muted hover:border-border-light hover:text-text-secondary')
                }
              >
                <Moon size={20} />
                <span className="text-xs font-medium">Oscuro</span>
              </button>

              <button
                onClick={() => handleThemeSelect('light')}
                className={
                  'flex flex-col items-center gap-2 rounded-xl border py-4 px-3 transition-all duration-150 ' +
                  (theme === 'light'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-bg-card text-text-muted hover:border-border-light hover:text-text-secondary')
                }
              >
                <Sun size={20} />
                <span className="text-xs font-medium">Claro</span>
              </button>
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}
