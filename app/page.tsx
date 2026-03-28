import Link from 'next/link'
import { getModelsByBrand } from '@/lib/catalog'
import { ChevronRight, Clock } from 'lucide-react'
import { BrandNavBar } from '@/components/BrandNavBar'
import { SiteFooter } from '@/components/SiteFooter'

// ── Brand logo renderers (large, styled text) ───────────────────────────────

function JeepLogo() {
  return (
    <span
      className="text-7xl lg:text-8xl font-black text-text-primary select-none tracking-wide"
      style={{ fontFamily: "'Helvetica Neue', Impact, Arial Black, sans-serif" }}
    >
      Jeep
    </span>
  )
}

function MercedesLogo() {
  return (
    <svg viewBox="0 0 120 120" className="w-28 h-28 lg:w-32 lg:h-32" fill="none">
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="3" className="text-text-primary" />
      <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1.5" className="text-text-primary/40" />
      <path d="M60 10 L60 60 L103 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary" />
      <path d="M60 60 L17 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary" />
      <path d="M60 60 L60 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-text-primary" />
    </svg>
  )
}

function RamLogo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 60" className="w-24 h-14 lg:w-28 lg:h-16" fill="currentColor">
        <path d="M50 5 C45 5 35 12 30 18 C25 24 20 28 15 30 C10 32 5 33 2 35 C5 37 12 40 20 42 C28 44 35 48 40 52 C43 54 47 56 50 58 C53 56 57 54 60 52 C65 48 72 44 80 42 C88 40 95 37 98 35 C95 33 90 32 85 30 C80 28 75 24 70 18 C65 12 55 5 50 5Z" className="text-text-primary" />
      </svg>
      <span
        className="text-5xl lg:text-6xl font-black text-text-primary select-none tracking-[0.25em]"
        style={{ fontFamily: "'Helvetica Neue', Impact, Arial Black, sans-serif" }}
      >
        RAM
      </span>
    </div>
  )
}

function FiatLogo() {
  return (
    <div className="relative w-28 h-28 lg:w-32 lg:h-32 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-[3px] border-text-primary" />
      <div className="absolute inset-2 rounded-full border border-text-primary/40" />
      <span
        className="text-4xl lg:text-5xl font-black text-text-primary select-none tracking-wider"
        style={{ fontFamily: "'Helvetica Neue', Impact, Arial Black, sans-serif" }}
      >
        FIAT
      </span>
    </div>
  )
}

function DodgeLogo() {
  return (
    <span
      className="text-6xl lg:text-7xl font-black text-text-primary select-none tracking-wider italic"
      style={{ fontFamily: "'Helvetica Neue', Impact, Arial Black, sans-serif" }}
    >
      DODGE
    </span>
  )
}

// ── Brand card data ──────────────────────────────────────────────────────────

interface BrandCardData {
  id: string
  href: string
  logo: React.ReactNode
  name: React.ReactNode
  description: string
  brandKey: string
  available: boolean
  hoverBorder: string
  hoverShadow: string
}

const BRAND_CARDS: BrandCardData[] = [
  {
    id: 'jeep',
    href: '/brand/jeep',
    logo: <JeepLogo />,
    name: <><span>Jeep</span><span className="text-accent">®</span></>,
    description: 'SUVs y todo-terreno para cada aventura. Explora variantes y genera colores con IA.',
    brandKey: 'Jeep',
    available: true,
    hoverBorder: 'hover:border-accent/50',
    hoverShadow: 'hover:shadow-accent/10',
  },
  {
    id: 'mercedes-benz',
    href: '/brand/mercedes-benz',
    logo: <MercedesLogo />,
    name: <><span>Mercedes</span><span className="text-text-muted">-Benz</span></>,
    description: 'Berlinas, SUVs y eléctricos de la máxima ingeniería alemana.',
    brandKey: 'Mercedes-Benz',
    available: true,
    hoverBorder: 'hover:border-white/20',
    hoverShadow: 'hover:shadow-white/5',
  },
  {
    id: 'ram',
    href: '/brand/ram',
    logo: <RamLogo />,
    name: 'RAM',
    description: 'Pickups robustas y potentes para trabajo y aventura.',
    brandKey: 'RAM',
    available: true,
    hoverBorder: 'hover:border-white/20',
    hoverShadow: 'hover:shadow-white/5',
  },
  {
    id: 'fiat',
    href: '/brand/fiat',
    logo: <FiatLogo />,
    name: <><span>FIAT</span><span className="text-accent">®</span></>,
    description: 'SUVs compactos y comerciales con diseño italiano y eficiencia.',
    brandKey: 'FIAT',
    available: true,
    hoverBorder: 'hover:border-orange-500/30',
    hoverShadow: 'hover:shadow-orange-500/5',
  },
  {
    id: 'dodge',
    href: '/brand/dodge',
    logo: <DodgeLogo />,
    name: 'Dodge',
    description: 'Muscle cars y SUVs de alto rendimiento próximamente en el showroom.',
    brandKey: 'Dodge',
    available: false,
    hoverBorder: 'hover:border-border-light',
    hoverShadow: '',
  },
]

// ── Unified brand card component ─────────────────────────────────────────────

function BrandCard({ brand }: { brand: BrandCardData }) {
  const models = getModelsByBrand(brand.brandKey)
  const variants = models.reduce((acc, m) => acc + m.variants.length, 0)

  return (
    <Link
      href={brand.href}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-bg-secondary ${brand.hoverBorder} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${brand.hoverShadow} flex flex-col h-full`}
    >
      {/* Logo area — fixed height for all cards */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-bg-card to-bg-secondary flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
        {brand.logo}
        <div className="absolute top-4 left-4">
          {brand.available ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-border text-[10px] font-bold uppercase tracking-wider text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Disponible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-border text-[10px] font-bold uppercase tracking-wider text-text-muted">
              <Clock size={9} />
              Próximamente
            </span>
          )}
        </div>
      </div>

      {/* Content area — flex-1 so all cards stretch equally */}
      <div className="p-6 flex flex-col flex-1">
        <p className="section-label mb-1">Grupo Kaufmann</p>
        <h3 className="text-2xl font-black text-text-primary mb-1">{brand.name}</h3>
        <p className="text-sm text-text-secondary mb-5 flex-1">{brand.description}</p>

        <div className="flex gap-6 mb-5 py-4 border-t border-border">
          <div>
            <p className="text-xl font-black text-text-primary">{models.length}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Modelos</p>
          </div>
          <div>
            <p className="text-xl font-black text-text-primary">{variants}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Submodelos</p>
          </div>
          <div>
            <p className="leading-none">
              <span className="inline-flex items-center bg-accent text-zinc-950 font-black px-2 py-0.5 rounded-md text-sm tracking-wide">IA</span>
            </p>
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">Color AI</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${brand.available ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'}`}>
          Explorar catálogo <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ShowroomPage() {
  const totalModels = BRAND_CARDS.reduce((acc, b) => acc + getModelsByBrand(b.brandKey).length, 0)

  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-bg-primary" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(ellipse_80%_50%_at_100%_0%,_#fe142f,_transparent)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(ellipse_60%_40%_at_0%_100%,_#003a75,_transparent)]" />
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent" />
              <p className="section-label tracking-[0.2em]">Divemotor · Showroom Digital 2026</p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-text-primary leading-[1.05] tracking-tight mb-6">
              Bienvenido al{' '}
              <span className="text-accent">Showroom</span>{' '}
              <span className="text-text-primary">Digital</span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
              Explora el catálogo de cada marca, descubre variantes y genera
              nuevas combinaciones de color con inteligencia artificial.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-10 mt-8 pt-6 border-t border-border">
            <div>
              <p className="text-3xl font-black text-text-primary">5</p>
              <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Marcas</p>
            </div>
            <div>
              <p className="text-3xl font-black text-text-primary">{totalModels}</p>
              <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Modelos</p>
            </div>
            <div>
              <p className="leading-none">
                <span className="inline-flex items-center bg-accent text-zinc-950 font-black px-2.5 py-1 rounded-lg text-2xl tracking-wide">IA</span>
              </p>
              <p className="text-xs text-text-muted mt-1.5 uppercase tracking-wider">Color AI</p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: '#003a75' }}>28</p>
              <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Concesionarios</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand bar ──────────────────────────────────────────────────────────── */}
      <BrandNavBar />

      {/* ── Brand Cards ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-6 bg-accent" />
          <p className="section-label">Marcas disponibles</p>
        </div>
        <h2 className="text-2xl font-black text-text-primary mb-10">Selecciona una marca</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {BRAND_CARDS.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
