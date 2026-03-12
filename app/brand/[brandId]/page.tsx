import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBrandById, getModelsByBrand } from '@/lib/catalog'
import { VehicleCard } from '@/components/VehicleCard'
import { BrandNavBar } from '@/components/BrandNavBar'
import { SiteFooter } from '@/components/SiteFooter'
import { Clock } from 'lucide-react'

interface Props {
  params: Promise<{ brandId: string }>
}

export default async function BrandPage({ params }: Props) {
  const { brandId } = await params
  const brand = getBrandById(brandId)
  if (!brand) return notFound()

  const models = getModelsByBrand(brand.name)
  const totalVariants = models.reduce((acc, m) => acc + m.variants.length, 0)

  const isMercedes = brandId === 'mercedes-benz'

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

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
              <Link href="/" className="hover:text-text-primary transition-colors">Showroom</Link>
              <span>/</span>
              <span className="text-text-primary">{brand.name}</span>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-accent" />
              <p className="section-label tracking-[0.2em]">
                Divemotor · {brand.name} 2026
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-black text-text-primary leading-[1.05] tracking-tight mb-5">
              {isMercedes ? (
                <>
                  <span className="text-accent">Mercedes</span>
                  <span className="text-text-primary">-Benz</span>
                </>
              ) : (
                <>
                  Catálogo{' '}
                  <span className="text-accent">{brand.name}</span>
                  {brand.name === 'Jeep' && <span className="text-accent">®</span>}
                </>
              )}
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
              {isMercedes
                ? 'Descubre el catálogo Mercedes-Benz, explora variantes y genera nuevas combinaciones de color con inteligencia artificial.'
                : 'Descubre cada modelo, explora variantes y genera nuevas combinaciones de color con inteligencia artificial.'}
            </p>

            {/* Stats bar */}
            {models.length > 0 && (
              <div className="flex flex-wrap gap-10 mt-8 pt-6 border-t border-border">
                <div>
                  <p className="text-3xl font-black text-text-primary">{models.length}</p>
                  <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Modelos</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-text-primary">{totalVariants}</p>
                  <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Submodelos</p>
                </div>
                <div>
                  <p className="leading-none">
                    <span className="inline-flex items-center bg-accent text-zinc-950 font-black px-2.5 py-1 rounded-lg text-2xl tracking-wide">IA</span>
                  </p>
                  <p className="text-xs text-text-muted mt-1.5 uppercase tracking-wider">Color AI</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Brand bar ──────────────────────────────────────────────────────────── */}
      <BrandNavBar activeBrandId={brandId} />

      {/* ── Content ──────────────────────────────────────────────────────────────── */}
      {models.length > 0 ? (
        <section id="catalogo" className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-6 bg-accent" />
                <p className="section-label">Catálogo {brand.name} 2026</p>
              </div>
              <h2 className="text-2xl font-black text-text-primary">Todos los modelos</h2>
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
      ) : (
        /* ── Coming soon state ─── */
        <section className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center mb-6">
            <Clock size={28} className="text-text-muted" />
          </div>
          <h2 className="text-2xl font-black text-text-primary mb-3">Próximamente</h2>
          <p className="text-text-muted max-w-md mb-8">
            Estamos preparando el catálogo {brand.name} para el Showroom Digital Divemotor.
            Pronto podrás explorar todos los modelos y generar variantes de color con IA.
          </p>
          <Link href="/" className="btn-ghost">
            ← Volver al Showroom
          </Link>
        </section>
      )}

      <SiteFooter />
    </div>
  )
}
