import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getModelById } from '@/lib/catalog'
import { VariantCard } from '@/components/VariantCard'

interface Props {
  params: Promise<{ modelId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { modelId } = await params
  const model = getModelById(modelId)
  if (!model) return { title: 'Modelo no encontrado' }
  return {
    title: `${model.name} — Vehicle Showroom AI`,
    description: model.description,
  }
}

export default async function VariantsPage({ params }: Props) {
  const { modelId } = await params
  const model = getModelById(modelId)
  if (!model) notFound()

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link
              href="/"
              className="hover:text-text-primary transition-colors"
            >
              Showroom
            </Link>
            <ChevronRight size={14} />
            <span className="text-text-primary font-medium">{model.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Model Hero ──────────────────────────────────────────────────────── */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(ellipse at 80% 50%, #e8a020 0%, transparent 60%)`,
            }}
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="max-w-xl">
            <p className="section-label mb-3">{model.brand} · 2026</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-text-primary tracking-tight mb-4">
              {model.name}
            </h1>
            {model.description && (
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                {model.description}
              </p>
            )}
            <div className="flex items-center gap-4">
              <span className="badge bg-accent/10 text-accent border border-accent/20">
                {model.variants.length} versiones
              </span>
              <span className="badge bg-bg-secondary text-text-secondary border border-border">
                Modelo 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Variants Grid ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-10">
          <p className="section-label mb-2">Selecciona una versión</p>
          <h2 className="text-2xl font-bold text-text-primary">
            Versiones disponibles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {model.variants.map((variant, i) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              modelId={model.id}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
