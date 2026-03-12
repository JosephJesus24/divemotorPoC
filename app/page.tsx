import Link from 'next/link'
import Image from 'next/image'
import { getModelsByBrand } from '@/lib/catalog'
import { ChevronRight, Clock } from 'lucide-react'
import { BrandNavBar } from '@/components/BrandNavBar'
import { SiteFooter } from '@/components/SiteFooter'

// ── Reusable "Próximamente" card ─────────────────────────────────────────────
function ComingSoonCard({
  href,
  label,
  description,
  initials,
}: {
  href: string
  label: React.ReactNode
  description: string
  initials: string
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-border bg-bg-secondary hover:border-border-light transition-all duration-300 hover:-translate-y-1"
    >
      {/* Placeholder bg */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-bg-card to-bg-secondary flex items-center justify-center">
        <span
          className="relative text-5xl font-black text-text-primary/[0.06] select-none tracking-widest"
          style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
        >
          {initials}
        </span>
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-950/80 border border-border text-[10px] font-bold uppercase tracking-wider text-text-muted">
            <Clock size={9} />
            Próximamente
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="section-label mb-0.5 text-[9px]">Grupo Kaufmann</p>
        <h3 className="text-lg font-black text-text-primary mb-1">{label}</h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">{description}</p>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted group-hover:text-text-primary transition-colors">
          Ver página <ChevronRight size={13} />
        </div>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ShowroomPage() {
  const jeepModels = getModelsByBrand('Jeep')
  const jeepVariants = jeepModels.reduce((acc, m) => acc + m.variants.length, 0)
  const mbModels = getModelsByBrand('Mercedes-Benz')
  const mbVariants = mbModels.reduce((acc, m) => acc + m.variants.length, 0)

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
              <p className="text-3xl font-black text-text-primary">{jeepModels.length}</p>
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

        <div className="space-y-6 max-w-4xl">

          {/* Row 1 — Jeep (active) + Mercedes-Benz */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* ── Jeep® ── */}
            <Link href="/brand/jeep" className="group relative overflow-hidden rounded-2xl border border-border bg-bg-secondary hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10">
              <div className="relative h-52 overflow-hidden">
                <Image
                  src="/images/jeep/wrangler/rubicon_4door/frontal.jpeg"
                  alt="Jeep Wrangler"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-border text-[10px] font-bold uppercase tracking-wider text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Disponible
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="section-label mb-1">Grupo Kaufmann</p>
                <h3 className="text-2xl font-black text-text-primary mb-1">
                  Jeep<span className="text-accent">®</span>
                </h3>
                <p className="text-sm text-text-secondary mb-5">
                  SUVs y todo-terreno para cada aventura. Explora variantes y genera colores con IA.
                </p>
                <div className="flex gap-6 mb-5 py-4 border-t border-border">
                  <div>
                    <p className="text-xl font-black text-text-primary">{jeepModels.length}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Modelos</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-text-primary">{jeepVariants}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Submodelos</p>
                  </div>
                  <div>
                    <p className="leading-none">
                      <span className="inline-flex items-center bg-accent text-zinc-950 font-black px-2 py-0.5 rounded-md text-sm tracking-wide">IA</span>
                    </p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">Color AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all">
                  Explorar catálogo <ChevronRight size={16} />
                </div>
              </div>
            </Link>

            {/* ── Mercedes-Benz ── */}
            <Link href="/brand/mercedes-benz" className="group relative overflow-hidden rounded-2xl border border-border bg-bg-secondary hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5">
              <div className="relative h-52 overflow-hidden">
                <Image
                  src="/images/mercedes-benz/cla/200_coupe_kit_amg/frontal.jpeg"
                  alt="Mercedes-Benz CLA"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-border text-[10px] font-bold uppercase tracking-wider text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Disponible
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="section-label mb-1">Grupo Kaufmann</p>
                <h3 className="text-2xl font-black text-text-primary mb-1">
                  Mercedes<span className="text-text-muted">-Benz</span>
                </h3>
                <p className="text-sm text-text-secondary mb-5">
                  Berlinas, SUVs y eléctricos de la máxima ingeniería alemana.
                </p>
                <div className="flex gap-6 mb-5 py-4 border-t border-border">
                  <div>
                    <p className="text-xl font-black text-text-primary">{mbModels.length}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Modelos</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-text-primary">{mbVariants}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Submodelos</p>
                  </div>
                  <div>
                    <p className="leading-none">
                      <span className="inline-flex items-center bg-accent text-zinc-950 font-black px-2 py-0.5 rounded-md text-sm tracking-wide">IA</span>
                    </p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">Color AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary group-hover:text-text-primary group-hover:gap-3 transition-all">
                  Explorar catálogo <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </div>

          {/* Row 2 — Dodge · RAM · FIAT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ComingSoonCard
              href="/brand/dodge"
              label="Dodge"
              description="Muscle cars y SUVs de alto rendimiento próximamente en el showroom."
              initials="D"
            />
            <ComingSoonCard
              href="/brand/ram"
              label="RAM"
              description="Pickups y comerciales RAM próximamente en el Showroom Digital."
              initials="RAM"
            />
            <ComingSoonCard
              href="/brand/fiat"
              label="FIAT"
              description="La gama FIAT llegará pronto al Showroom Digital Divemotor."
              initials="F"
            />
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
