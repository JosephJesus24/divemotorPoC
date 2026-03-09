'use client'

import { useSearchParams, useParams } from 'next/navigation'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight,
  Video,
  Play,
  Download,
  RotateCcw,
  Clock,
  CheckCircle2,
  ImageIcon,
  AlertCircle,
  Save,
  Filter,
} from 'lucide-react'
import { getModelById, getVariantById } from '@/lib/catalog'
import type { VideoGenerationStatus } from '@/types'

// ─── Duration options ──────────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { value: 4 as const, label: '4s' },
  { value: 6 as const, label: '6s' },
  { value: 8 as const, label: '8s' },
]

// ─── Default prompt ────────────────────────────────────────────────────────────

function buildDefaultPrompt(variantName: string): string {
  return (
    `Animated still photograph of the ${variantName}. ` +
    `The vehicle is completely stationary — it does not move at all. ` +
    `The camera performs only a single, very slow and subtle movement: a gentle push-in or a barely perceptible lateral drift of a few centimeters. Minimal motion, almost frozen. ` +
    `The result must look like the reference photo brought to life with a breath of movement — not a 3D reconstruction, not a new render. ` +
    `The vehicle must be a perfect pixel-accurate reproduction of what is shown in the reference images: exact body shape, exact paint color and finish, exact wheels, exact trim details, exact badges, exact headlights, exact grille — nothing added, nothing removed, nothing changed. ` +
    `DO NOT generate any angle or surface of the vehicle not already visible in the reference photos. ` +
    `DO NOT hallucinate, invent, or extrapolate any body panel, accessory, feature, or part. ` +
    `Soft diffuse studio lighting, neutral very dark background, subtle ground reflection. ` +
    `Ultra-photorealistic. No people, no text, no overlays.`
  )
}

// ─── Image selection card ──────────────────────────────────────────────────────

interface ImageCardProps {
  url:            string
  isSelected:     boolean
  selectionOrder: number | null
  disabled:       boolean
  onClick:        () => void
}

function ImageCard({ url, isSelected, selectionOrder, disabled, onClick }: ImageCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled && !isSelected}
      className={`relative rounded-xl overflow-hidden border-2 aspect-video transition-all duration-200 group
        ${isSelected
          ? 'border-accent ring-2 ring-accent/30'
          : disabled
          ? 'border-border opacity-40 cursor-not-allowed'
          : 'border-border hover:border-accent/50 cursor-pointer'
        }`}
    >
      <Image src={url} alt="" fill className="object-cover" unoptimized />

      {!isSelected && !disabled && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
      )}

      {/* Número de selección */}
      {isSelected && selectionOrder !== null && (
        <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-lg z-10">
          <span className="text-white text-xs font-bold">{selectionOrder}</span>
        </div>
      )}

      {!isSelected && (
        <div className="absolute top-2 left-2 w-7 h-7 rounded-full border-2 border-white/40 bg-black/30" />
      )}
    </button>
  )
}

// ─── Progress bar ──────────────────────────────────────────────────────────────

function ProgressSection({ elapsed }: { elapsed: number }) {
  const messages = [
    'Iniciando generación con Veo 3.1...',
    'Procesando imágenes de referencia...',
    'Generando video cinematográfico...',
    'Aplicando efectos de iluminación...',
    'Finalizando video...',
  ]
  const msgIndex = Math.min(Math.floor(elapsed / 18), messages.length - 1)

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
        <p className="text-sm font-medium text-text-primary">{messages[msgIndex]}</p>
        <span className="ml-auto text-xs text-text-muted font-mono tabular-nums shrink-0">
          {elapsed}s
        </span>
      </div>

      <div className="h-1 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-1000"
          style={{ width: `${Math.min((elapsed / 90) * 100, 95)}%` }}
        />
      </div>

      <p className="text-xs text-text-muted">
        La generación de video con Veo 3.1 tarda entre 30 y 90 segundos.
        La página se actualiza automáticamente.
      </p>
    </div>
  )
}

// ─── Video player ──────────────────────────────────────────────────────────────

function VideoPlayer({
  videoUrl,
  variantName,
  onSave,
  isSaving,
  saved,
}: {
  videoUrl:    string
  variantName: string
  onSave:      () => void
  isSaving:    boolean
  saved:       boolean
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle2 size={16} className="shrink-0" />
        <p className="text-sm font-semibold">Video generado exitosamente</p>
      </div>

      <div className="rounded-xl overflow-hidden border border-border bg-black">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          playsInline
          className="w-full aspect-video"
        />
      </div>

      <div className="flex gap-3">
        <a
          href={videoUrl}
          download={`${variantName.replace(/\s+/g, '_')}_360.mp4`}
          className="btn-ghost flex-1 justify-center"
        >
          <Download size={16} />
          Descargar MP4
        </a>

        <button
          onClick={onSave}
          disabled={isSaving || saved}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
            ${saved
              ? 'bg-green-600/20 border border-green-500/30 text-green-400 cursor-default'
              : 'btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Guardando...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 size={16} />
              Guardado en galería
            </>
          ) : (
            <>
              <Save size={16} />
              Guardar en galería
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Main page content ─────────────────────────────────────────────────────────

function VideoPageContent() {
  const params                 = useParams<{ modelId: string; variantId: string }>()
  const { modelId, variantId } = params
  const searchParams           = useSearchParams()

  const model   = getModelById(modelId)
  const variant = getVariantById(modelId, variantId)

  // All image URLs and their colors passed via query params
  const allImageUrls:   string[] = searchParams.getAll('images')
  const allImageColors: string[] = searchParams.getAll('imgcolors')

  // Build url→color map
  const colorMap: Record<string, string> = {}
  allImageUrls.forEach((url, i) => {
    colorMap[url] = allImageColors[i] ?? 'sin color'
  })

  // Unique colors for filter
  const uniqueColors = Array.from(
    new Set(allImageUrls.map((url) => colorMap[url]).filter(Boolean))
  ).sort()

  // States
  const [activeColor,   setActiveColor]   = useState<string | null>(null)
  const [selectedUrls,  setSelectedUrls]  = useState<string[]>([])
  const [prompt,        setPrompt]        = useState(() => buildDefaultPrompt(variant?.name ?? 'Jeep'))
  const [duration,      setDuration]      = useState<4 | 6 | 8>(8)
  const [isSavingVideo, setIsSavingVideo] = useState(false)
  const [videoSaved,    setVideoSaved]    = useState(false)

  const [status, setStatus] = useState<VideoGenerationStatus>({
    phase:          'idle',
    operationName:  null,
    videoUrl:       null,
    elapsedSeconds: 0,
    error:          null,
  })

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isGenerating = ['starting', 'polling', 'saving'].includes(status.phase)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pollRef.current)  clearTimeout(pollRef.current)
    }
  }, [])

  // Filtered images based on active color
  const filteredImageUrls = activeColor
    ? allImageUrls.filter((url) => colorMap[url] === activeColor)
    : allImageUrls

  // Deselect images that are no longer visible when filter changes
  useEffect(() => {
    setSelectedUrls((prev) =>
      prev.filter((url) => filteredImageUrls.includes(url))
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeColor])

  // ── Toggle image selection (max 3) ──────────────────────────────────────────
  const toggleImage = (url: string) => {
    if (isGenerating) return
    setSelectedUrls((prev) => {
      if (prev.includes(url)) return prev.filter((u) => u !== url)
      if (prev.length >= 3)   return prev
      return [...prev, url]
    })
  }

  // ── Polling loop ────────────────────────────────────────────────────────────
  const startPolling = (operationName: string) => {
    setStatus((s) => ({ ...s, phase: 'polling', operationName }))

    const poll = async () => {
      try {
        const qs = new URLSearchParams({ operationName, modelId, variantId })
        const res  = await fetch(`/api/generate-video/status?${qs}`)
        const data = await res.json()

        if (!data.success) throw new Error(data.error ?? 'Error al consultar el estado')

        if (data.done) {
          if (timerRef.current) clearInterval(timerRef.current)
          setStatus((s) => ({ ...s, phase: 'done', videoUrl: data.videoUrl, error: null }))
        } else {
          pollRef.current = setTimeout(poll, 10_000)
        }
      } catch (err) {
        if (timerRef.current) clearInterval(timerRef.current)
        setStatus((s) => ({
          ...s,
          phase: 'error',
          error: err instanceof Error ? err.message : 'Error al consultar el estado',
        }))
      }
    }

    pollRef.current = setTimeout(poll, 10_000)
  }

  // ── Start generation ────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (selectedUrls.length === 0 || isGenerating) return

    if (timerRef.current) clearInterval(timerRef.current)
    if (pollRef.current)  clearTimeout(pollRef.current)

    setVideoSaved(false)
    setStatus({
      phase:          'starting',
      operationName:  null,
      videoUrl:       null,
      elapsedSeconds: 0,
      error:          null,
    })

    timerRef.current = setInterval(() => {
      setStatus((s) => ({ ...s, elapsedSeconds: s.elapsedSeconds + 1 }))
    }, 1_000)

    try {
      const res = await fetch('/api/generate-video', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageUrls: selectedUrls, prompt, durationSeconds: duration }),
      })

      let data: { success: boolean; operationName?: string; error?: string }
      try {
        data = await res.json()
      } catch {
        const text = await res.text().catch(() => `HTTP ${res.status}`)
        throw new Error(`Error del servidor: ${text}`)
      }

      if (!data.success) throw new Error(data.error ?? 'Error al iniciar la generación')
      startPolling(data.operationName!)

    } catch (err) {
      if (timerRef.current) clearInterval(timerRef.current)
      setStatus((s) => ({
        ...s,
        phase: 'error',
        error: err instanceof Error ? err.message : 'Error desconocido',
      }))
    }
  }

  // ── Save video to gallery ────────────────────────────────────────────────────
  const handleSaveVideo = async () => {
    if (!status.videoUrl || isSavingVideo || videoSaved) return

    setIsSavingVideo(true)
    try {
      const res  = await fetch('/api/save-video-to-catalog', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          videoUrl: status.videoUrl,
          modelId,
          variantId,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Error al guardar')
      setVideoSaved(true)
    } catch (err) {
      console.error('[handleSaveVideo]', err)
      alert(err instanceof Error ? err.message : 'Error al guardar el video')
    } finally {
      setIsSavingVideo(false)
    }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (pollRef.current)  clearTimeout(pollRef.current)
    setVideoSaved(false)
    setStatus({ phase: 'idle', operationName: null, videoUrl: null, elapsedSeconds: 0, error: null })
  }

  if (!model || !variant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Modelo no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
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
            <span className="text-accent font-medium">Generar Video 360°</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Video size={16} className="text-accent" />
            </div>
            <p className="section-label">Veo 3.1 · Video Generation · 16:9</p>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Generar Video 360°
          </h1>
          <p className="text-text-secondary">
            Selecciona hasta 3 imágenes de referencia de la galería y genera un video
            del {variant.name} con Google Veo 3.1. El video mostrará el vehículo exactamente como aparece en las fotos de referencia.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* ── LEFT: selector + resultado ─────────────────────────────────── */}
          <div className="space-y-8">

            {/* Image selection grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="section-label">Imágenes de referencia</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  selectedUrls.length === 3
                    ? 'border-accent/40 text-accent bg-accent/10'
                    : 'border-border text-text-muted'
                }`}>
                  {selectedUrls.length} / 3
                </span>
              </div>

              {allImageUrls.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <ImageIcon size={32} className="text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted text-sm mb-4">
                    No hay imágenes disponibles. Agrega fotos a la galería primero.
                  </p>
                  <Link href={`/vehicle/${modelId}/${variantId}`} className="btn-ghost text-sm inline-flex">
                    Ir a la galería
                  </Link>
                </div>
              ) : (
                <>
                  {/* ── Color filter chips ─────────────────────────────────── */}
                  {uniqueColors.length > 1 && (
                    <div className="flex items-center gap-2 flex-wrap mb-4 p-3 rounded-xl bg-bg-card border border-border">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
                        <Filter size={12} />
                        <span>Color:</span>
                      </div>

                      <button
                        onClick={() => setActiveColor(null)}
                        disabled={isGenerating}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                          ${activeColor === null
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-text-muted hover:border-border-light hover:text-text-secondary'
                          } disabled:opacity-40`}
                      >
                        Todos ({allImageUrls.length})
                      </button>

                      {uniqueColors.map((color) => {
                        const count = allImageUrls.filter((url) => colorMap[url] === color).length
                        return (
                          <button
                            key={color}
                            onClick={() => setActiveColor(activeColor === color ? null : color)}
                            disabled={isGenerating}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize
                              ${activeColor === color
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border text-text-muted hover:border-border-light hover:text-text-secondary'
                              } disabled:opacity-40`}
                          >
                            {color} ({count})
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Image grid */}
                  {filteredImageUrls.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                      <p className="text-text-muted text-sm">
                        No hay imágenes con el color seleccionado.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredImageUrls.map((url) => (
                        <ImageCard
                          key={url}
                          url={url}
                          isSelected={selectedUrls.includes(url)}
                          selectionOrder={
                            selectedUrls.includes(url)
                              ? selectedUrls.indexOf(url) + 1
                              : null
                          }
                          disabled={selectedUrls.length >= 3}
                          onClick={() => toggleImage(url)}
                        />
                      ))}
                    </div>
                  )}

                  {selectedUrls.length === 3 && (
                    <p className="text-xs text-text-muted mt-2 pl-1">
                      Máximo alcanzado. Haz clic en una imagen para deseleccionarla.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Progress */}
            {isGenerating && <ProgressSection elapsed={status.elapsedSeconds} />}

            {/* Error */}
            {status.phase === 'error' && status.error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 flex gap-3">
                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-red-400 text-sm font-medium">Error</p>
                  <p className="text-red-400/70 text-sm mt-1">{status.error}</p>
                </div>
              </div>
            )}

            {/* Video result */}
            {status.phase === 'done' && status.videoUrl && (
              <VideoPlayer
                videoUrl={status.videoUrl}
                variantName={variant.name}
                onSave={handleSaveVideo}
                isSaving={isSavingVideo}
                saved={videoSaved}
              />
            )}
          </div>

          {/* ── RIGHT: Controls sidebar ─────────────────────────────────────── */}
          <div>
            <div className="sticky top-24 space-y-5">

              {/* Prompt */}
              <div className="rounded-xl border border-border bg-bg-card p-5">
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Prompt del video
                </label>
                <p className="text-xs text-text-muted mb-3">
                  Describe el movimiento de cámara y el estilo del video.
                </p>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  rows={6}
                  className="w-full rounded-lg border border-border bg-bg-secondary text-text-primary text-xs p-3
                             placeholder:text-text-muted resize-none leading-relaxed
                             focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              {/* Duration */}
              <div className="rounded-xl border border-border bg-bg-card p-5">
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Duración
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDuration(opt.value)}
                      disabled={isGenerating}
                      className={`py-2.5 rounded-lg border text-sm font-semibold transition-all
                        ${duration === opt.value
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-text-muted hover:border-border-light hover:text-text-secondary'
                        }
                        disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="rounded-xl border border-accent/10 bg-accent/5 p-4">
                <p className="text-xs font-semibold text-accent mb-2">Cómo funciona</p>
                <ul className="text-xs text-text-muted space-y-1.5">
                  <li>① Filtra por color y selecciona 1–3 imágenes</li>
                  <li>② Veo reproduce el vehículo tal como está en las fotos</li>
                  <li>③ Genera un video cinematográfico 16:9</li>
                  <li>④ La generación tarda 30–90 segundos</li>
                  <li>⑤ Descarga el MP4 o guárdalo en la galería</li>
                </ul>
              </div>

              {/* Elapsed counter while generating */}
              {isGenerating && (
                <div className="flex items-center gap-2 text-text-muted text-sm px-1">
                  <Clock size={13} className="shrink-0" />
                  <span>Tiempo transcurrido</span>
                  <span className="ml-auto font-mono text-text-secondary tabular-nums">
                    {status.elapsedSeconds}s
                  </span>
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || selectedUrls.length === 0 || !prompt.trim()}
                className="btn-primary w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Generando video...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Generar video{selectedUrls.length > 0 ? ` · ${duration}s` : ''}
                  </>
                )}
              </button>

              {/* Reset */}
              {(status.phase === 'done' || status.phase === 'error') && (
                <button onClick={handleReset} className="btn-ghost w-full text-sm">
                  <RotateCcw size={14} />
                  Generar otro video
                </button>
              )}

              {selectedUrls.length === 0 && status.phase === 'idle' && (
                <p className="text-xs text-text-muted text-center">
                  Selecciona al menos 1 imagen para continuar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Suspense wrapper (required for useSearchParams) ────────────────────────────

export default function VideoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <VideoPageContent />
    </Suspense>
  )
}
