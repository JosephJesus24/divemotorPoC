'use client'

import { useSearchParams, useParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight,
  Sparkles,
  Download,
  RotateCcw,
  FlaskConical,
  Save,
  CheckCircle,
  Info,
} from 'lucide-react'
import { getModelById, getVariantById } from '@/lib/catalog'
import { getVariantColors } from '@/data/variant-colors'
import { ColorSelector } from '@/components/ColorSelector'
import type { GenerationResult, ColorOption, ImageView } from '@/types'

// ─── View options for tagging saved images ────────────────────────────────────
const VIEW_OPTIONS: { value: ImageView; label: string }[] = [
  { value: 'front', label: 'Frontal' },
  { value: 'side', label: 'Lateral' },
  { value: 'rear', label: 'Posterior' },
]

function GenerateContent() {
  const params = useParams<{ modelId: string; variantId: string }>()
  const { modelId, variantId } = params
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('imageUrl') ?? ''
  const imageName = searchParams.get('name') ?? 'Imagen subida'
  const originColorId = searchParams.get('color') ?? ''

  const model = getModelById(modelId)
  const variant = getVariantById(modelId, variantId)

  // Get official colors for this specific variant
  const variantColors = getVariantColors(modelId, variantId)

  // Derive original color info for exclusion
  const originColorObj = variantColors.find((col) => col.id === originColorId)
  const originColorLabel = originColorObj?.label ?? originColorId

  // Mark original color (shown but not selectable)
  const availableColors = variantColors
    .map((col) => ({
      ...col,
      isVariantColor: true,
      isOriginalColor: col.id === originColorId,
    }))

  const [selectedColors, setSelectedColors] = useState<ColorOption[]>(
    availableColors.filter(c => !(c as any).isOriginalColor).slice(0, 3)
  )
  const [results, setResults] = useState<GenerationResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // ── Global view selection (chosen before generating) ─────────────────────
  const [globalView, setGlobalView] = useState<ImageView>('front')
  const [savedResults, setSavedResults] = useState<Record<string, boolean>>({})
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({})
  const [isSavingAll, setIsSavingAll] = useState(false)


  // ── Generate handler ──────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (selectedColors.length === 0) return
    setIsGenerating(true)
    setError(null)
    setSavedResults({})

    setResults(
      selectedColors.map((c) => ({
        colorId: c.id,
        colorLabel: c.label,
        hex: c.hex,
        imageUrl: '',
        status: 'generating',
      }))
    )

    try {
      const response = await fetch('/api/generate-color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, colors: selectedColors, modelId, variantId }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Error al generar imágenes')
      }

      setResults(data.results)
      setIsDemoMode(data.demo === true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setResults((prev) =>
        prev.map((r) => ({ ...r, status: 'error', error: 'Falló la generación' }))
      )
    } finally {
      setIsGenerating(false)
    }
  }

  // ── Save a result to the gallery — copies to correct folder + updates catalog ─
  const handleSaveToGallery = async (result: GenerationResult) => {
    const view = globalView

    setSavingIds((prev) => ({ ...prev, [result.colorId]: true }))

    try {
      const response = await fetch('/api/save-to-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: result.imageUrl,
          view,
          color: result.colorLabel,
          colorId: result.colorId,
          modelId,
          variantId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Error al guardar')
      }

      setSavedResults((prev) => ({ ...prev, [result.colorId]: true }))

      // Also persist in localStorage so gallery shows image immediately on return
      try {
        const storageKey = `generated_gallery_${modelId}_${variantId}`
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
        const newImage = data.image
        if (newImage && !saved.find((img: { id: string }) => img.id === newImage.id)) {
          localStorage.setItem(storageKey, JSON.stringify([newImage, ...saved]))
        }
      } catch { /* localStorage not available */ }
    } catch (err) {
      console.error('[handleSaveToGallery]', err)
      alert(`Error al guardar: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setSavingIds((prev) => ({ ...prev, [result.colorId]: false }))
    }
  }

  // ── Save ALL completed results to the gallery at once ────────────────────
  const handleSaveAll = async () => {
    const pending = results.filter(
      (r) => r.status === 'done' && r.imageUrl && !savedResults[r.colorId]
    )
    if (pending.length === 0) return
    setIsSavingAll(true)
    for (const r of pending) {
      await handleSaveToGallery(r)
    }
    setIsSavingAll(false)
  }

  // Derived state for the single save button
  const doneResults = results.filter((r) => r.status === 'done' && r.imageUrl)
  const unsavedResults = doneResults.filter((r) => !savedResults[r.colorId])
  const allSaved = doneResults.length > 0 && unsavedResults.length === 0

  if (!model || !variant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Modelo no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
            <Link href="/" className="hover:text-text-primary transition-colors">Showroom</Link>
            <ChevronRight size={14} />
            <Link href={`/vehicle/${modelId}`} className="hover:text-text-primary transition-colors">
              {model.name}
            </Link>
            <ChevronRight size={14} />
            <Link href={`/vehicle/${modelId}/${variantId}`} className="hover:text-text-primary transition-colors">
              {variant.name}
            </Link>
            <ChevronRight size={14} />
            <span className="text-accent font-medium">Generar con IA</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── Page Title ────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Sparkles size={16} className="text-accent" />
            </div>
            <p className="section-label">NanoBanana Pro · Gemini 3 Pro Image · 4K</p>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Generación de color
          </h1>
          <p className="text-text-secondary">
            Selecciona los colores y genera variantes fotorrealistas del {variant.name}.
          </p>

          {/* Demo mode banner — only shown when API key is missing */}
          {isDemoMode && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <FlaskConical size={16} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-400">Modo demo activo</p>
                <p className="text-xs text-amber-400/70 mt-0.5">
                  No hay API key configurada. Se genera una vista previa con tinte de color.
                  Agrega <code className="bg-amber-500/10 px-1 rounded">NANOBANANA_API_KEY</code> en{' '}
                  <code className="bg-amber-500/10 px-1 rounded">.env.local</code> para resultados reales.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* ── Left: Source image + results ────────────────────────────────── */}
          <div className="space-y-8">

            {/* Source image */}
            <div>
              <p className="section-label mb-4">Imagen original</p>
              <div className="relative rounded-xl overflow-hidden border border-border bg-bg-secondary aspect-video">
                {imageUrl ? (
                  <Image src={imageUrl} alt="Imagen original" fill className="object-contain" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-text-muted">Sin imagen seleccionada</p>
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <span className="badge bg-bg-primary/80 border border-border text-text-secondary text-xs backdrop-blur-sm">
                    Original — {imageName}
                  </span>
                </div>
              </div>
            </div>

            {/* Generated results grid */}
            {results.length > 0 && (
              <div>
                <p className="section-label mb-4">Variantes generadas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Original thumbnail (reference) */}
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-accent/40 bg-bg-secondary aspect-video">
                      {imageUrl && (
                        <Image src={imageUrl} alt="Original" fill className="object-contain" unoptimized />
                      )}
                      <div className="absolute bottom-2 left-2">
                        <span className="badge bg-accent text-zinc-950 text-xs font-bold">Original</span>
                      </div>
                    </div>
                  </div>

                  {/* Each generated color */}
                  {results.map((result) => (
                    <div key={result.colorId} className="space-y-2">

                      {/* ── Image card ── */}
                      <div className="relative rounded-xl overflow-hidden border border-border bg-bg-secondary aspect-video group">
                        {result.status === 'generating' && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                            <p className="text-xs text-text-muted">Generando...</p>
                          </div>
                        )}

                        {result.status === 'done' && result.imageUrl && (
                          <>
                            <Image
                              src={result.imageUrl}
                              alt={result.colorLabel}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                            {/* Download overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a href={result.imageUrl} download className="btn-primary text-sm px-4 py-2">
                                <Download size={14} />
                                Descargar
                              </a>
                            </div>
                          </>
                        )}

                        {result.status === 'error' && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center">
                            <p className="text-red-400 text-xs">Error al generar</p>
                            <p className="text-text-muted text-xs">{result.error}</p>
                          </div>
                        )}

                        {/* Color name badge — bottom left */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: result.hex }}
                          />
                          <span className="badge bg-bg-primary/80 border border-border text-text-secondary text-xs backdrop-blur-sm">
                            {result.colorLabel}
                          </span>
                        </div>

                        {/* Hex code badge — top right */}
                        <div className="absolute top-2 right-2">
                          <span className="badge bg-bg-primary/80 border border-border text-text-muted text-[10px] backdrop-blur-sm font-mono">
                            {result.hex}
                          </span>
                        </div>
                      </div>

                      {/* ── Saved indicator ── */}
                      {savedResults[result.colorId] && (
                        <div className="flex items-center gap-2 text-xs text-green-400 px-1 py-1">
                          <CheckCircle size={13} className="shrink-0" />
                          <span className="font-semibold">Guardada</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
                <p className="text-red-400 text-sm font-medium">Error</p>
                <p className="text-red-400/70 text-sm mt-1">{error}</p>
              </div>
            )}
          </div>

          {/* ── Right: Color selector + controls ────────────────────────────── */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">

              <div className="rounded-xl border border-border bg-bg-card p-6">
                <h3 className="font-semibold text-text-primary mb-1">Selecciona colores</h3>
                <p className="text-xs text-text-muted mb-4">Elige hasta 5 colores para generar.</p>
                <ColorSelector
                  colors={availableColors}
                  selected={selectedColors}
                  onSelectionChange={setSelectedColors}
                  max={5}
                />
              </div>


              {/* View angle selector — global, chosen before generating */}
              <div className="rounded-xl border border-border bg-bg-card p-6">
                <h3 className="font-semibold text-text-primary mb-1">Vista a generar</h3>
                <p className="text-xs text-text-muted mb-4">Angulo de camara del resultado.</p>
                <div className="flex gap-2">
                  {VIEW_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setGlobalView(opt.value)}
                      className={
                        'flex-1 text-xs py-2.5 rounded-lg border transition-all ' +
                        (globalView === opt.value
                          ? 'border-accent bg-accent/10 text-accent font-semibold'
                          : 'border-border text-text-muted hover:border-accent/40 hover:text-text-secondary')
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-accent/10 bg-accent/5 p-5">
                <p className="text-xs font-semibold text-accent mb-2">¿Cómo funciona?</p>
                <ul className="text-xs text-text-muted space-y-1.5">
                  <li>✓ Mantiene la geometría del vehículo</li>
                  <li>✓ Mantiene el ángulo de cámara</li>
                  <li>✓ Solo modifica el color de la pintura</li>
                  <li>✓ Tonalidad exacta (hex bloqueado)</li>
                  <li>✓ Vista seleccionada al guardar</li>
                </ul>
              </div>

              {/* Single save-all button — shown when there are completed results */}
              {doneResults.length > 0 && (
                allSaved ? (
                  <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-green-500/30 bg-green-500/5">
                    <CheckCircle size={16} className="text-green-400 shrink-0" />
                    <span className="text-sm font-semibold text-green-400">
                      {doneResults.length === 1 ? 'Imagen guardada' : 'Todas guardadas'} en galeria
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleSaveAll}
                    disabled={isSavingAll || isGenerating}
                    className="btn-primary w-full py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSavingAll ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Guardar en galeria
                        {unsavedResults.length > 1 && (
                          <span className="ml-1 text-zinc-950/60 text-xs">({unsavedResults.length})</span>
                        )}
                      </>
                    )}
                  </button>
                )
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || selectedColors.length === 0 || !imageUrl}
                className="btn-primary w-full py-4 text-base"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                    Generando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generar{' '}
                    {selectedColors.length > 0
                      ? `${selectedColors.length} variante${selectedColors.length > 1 ? 's' : ''}`
                      : 'variantes'}
                  </>
                )}
              </button>

              {results.length > 0 && !isGenerating && (
                <button
                  onClick={() => {
                    setResults([])
                    setSavedResults({})
                  }}
                  className="btn-ghost w-full text-sm"
                >
                  <RotateCcw size={14} />
                  Limpiar resultados
                </button>
              )}

              {!imageUrl && (
                <p className="text-xs text-red-400 text-center">
                  No hay imagen seleccionada. Sube una imagen primero.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <GenerateContent />
    </Suspense>
  )
}
