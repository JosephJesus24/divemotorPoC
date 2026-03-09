import { getAllModels } from '@/lib/catalog'
import { VehicleCard } from '@/components/VehicleCard'

export default function ShowroomPage() {
  const models = getAllModels()
  const totalVariants = models.reduce((acc, m) => acc + m.variants.length, 0)

  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-[#0d0d12] to-zinc-950" />
        {/* Divemotor red radial glow */}
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(ellipse_80%_50%_at_100%_0%,_#fe142f,_transparent)]" />
        {/* Divemotor blue subtle glow */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(ellipse_60%_40%_at_0%_100%,_#003a75,_transparent)]" />

        {/* Vertical red stripe — right side decoration */}
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent" />
              <p className="section-label tracking-[0.2em]">
                Divemotor · Showroom Digital 2026
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-black text-text-primary leading-[1.05] tracking-tight mb-6">
              Explora la línea{' '}
              <span className="text-accent">Jeep</span>{' '}
              <span className="text-white/90">2026</span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
              Descubre cada modelo, explora variantes y genera nuevas
              combinaciones de color con inteligencia artificial.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="btn-primary px-8 py-3 text-sm font-bold"
              >
                Ver catálogo
              </a>
              <span className="inline-flex items-center gap-2 px-5 py-3 text-sm text-text-muted border border-border rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                IA disponible
              </span>
            </div>
          </div>

          {/* ── Stats bar ─────────────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-10 mt-14 pt-8 border-t border-border">
            <div>
              <p className="text-3xl font-black text-white">{models.length}</p>
              <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Modelos</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{totalVariants}</p>
              <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Submodelos</p>
            </div>
            <div>
              <p className="text-3xl font-black text-accent">IA</p>
              <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Color AI</p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: '#003a75' }}>28</p>
              <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Concesionarios</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand bar ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Grupo Kaufmann
          </span>
          <div className="h-3 w-px bg-border" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Jeep®
          </span>
          <div className="h-3 w-px bg-border" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Dodge
          </span>
          <div className="h-3 w-px bg-border" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            RAM
          </span>
          <div className="h-3 w-px bg-border" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            FIAT
          </span>
        </div>
      </div>

      {/* ── Vehicle Grid ───────────────────────────────────────────────────────── */}
      <section id="catalogo" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-6 bg-accent" />
              <p className="section-label">Catálogo Jeep 2026</p>
            </div>
            <h2 className="text-2xl font-black text-text-primary">
              Todos los modelos
            </h2>
          </div>
          <p className="text-sm text-text-muted hidden sm:block">
            {models.length} modelos disponibles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {models.map((model, i) => (
            <VehicleCard key={model.id} model={model} index={i} />
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border mt-4">
        {/* Red top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left — Divemotor wordmark (ultra-light, igual al logo real) */}
          <div className="flex items-center gap-3">
            <span
              className="text-white uppercase tracking-[0.22em]"
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontWeight: 100,
                fontSize: '15px',
                letterSpacing: '0.22em',
              }}
            >
              DIVEMOTOR
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-xs text-text-muted">Vehicle Showroom AI</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>© 2026 Divemotor · Grupo Kaufmann</span>
            <div className="h-3 w-px bg-border hidden sm:block" />
            <span>Powered by NanoBanana AI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
