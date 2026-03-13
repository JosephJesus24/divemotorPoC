'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  X, ZoomIn, ZoomOut, Camera, Calendar, Palette,
  Trash2, AlertTriangle, Play, Download, Info, CheckCircle2, Circle,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import type { VehicleImage } from '@/types'

// ─── Helpers ───────────────────────────────────────────────────────────────────

const VIEW_LABELS: Record<string, string> = {
  front:    'Frontal',
  side:     'Lateral',
  rear:     'Posterior',
  interior: 'Interior',
  detail:   'Detalle',
  '360':    '360°',
}

function getFormat(url: string): string {
  const ext = url.split('.').pop()?.split('?')[0].toLowerCase() ?? ''
  const map: Record<string, string> = {
    jpg: 'JPG', jpeg: 'JPG', png: 'PNG', webp: 'WEBP', gif: 'GIF', mp4: 'MP4',
  }
  return map[ext] ?? ext.toUpperCase()
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  images:          VehicleImage[]
  onDelete?:       (imageId: string) => void | Promise<void>
  selectMode?:     boolean
  selectedIds?:    Set<string>
  onToggleSelect?: (id: string) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ImageGrid({ images, onDelete, selectMode = false, selectedIds = new Set(), onToggleSelect }: Props) {

  // ── Grid state ──────────────────────────────────────────────────────────────
  const [lightbox,     setLightbox]     = useState<VehicleImage | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  // ── Lightbox zoom / pan state ───────────────────────────────────────────────
  const [zoom,       setZoom]       = useState(1)
  const [pan,        setPan]        = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart,  setDragStart]  = useState({ x: 0, y: 0, px: 0, py: 0 })
  const [imgInfo,    setImgInfo]    = useState<{ width: number; height: number } | null>(null)
  const wasDragging = useRef(false)

  // ── Lightbox navigation ─────────────────────────────────────────────────────
  const currentIndex = lightbox ? images.findIndex(img => img.id === lightbox.id) : -1

  const goToPrev = () => {
    if (currentIndex > 0) setLightbox(images[currentIndex - 1])
  }
  const goToNext = () => {
    if (currentIndex < images.length - 1) setLightbox(images[currentIndex + 1])
  }

  // Reset zoom & pan when image changes
  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setImgInfo(null)
    setIsDragging(false)
    wasDragging.current = false
  }, [lightbox])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      else if (e.key === 'ArrowRight') goToNext()
      else if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  // ── Grid handlers ───────────────────────────────────────────────────────────
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setConfirmingId(id)
  }
  const handleConfirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    onDelete?.(id)
    setConfirmingId(null)
    if (lightbox?.id === id) setLightbox(null)
  }
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmingId(null)
  }

  // ── Zoom helpers ─────────────────────────────────────────────────────────────
  const isVideo  = lightbox?.type === 'video'
  const isZoomed = zoom > 1

  const clampZoom = (v: number) => Math.min(Math.max(v, 1), 4)

  const zoomIn  = () => setZoom(prev => clampZoom(prev + 0.5))
  const zoomOut = () => {
    setZoom(prev => {
      const next = clampZoom(prev - 0.5)
      if (next === 1) setPan({ x: 0, y: 0 })
      return next
    })
  }
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  // ── Lightbox image interactions ──────────────────────────────────────────────
  const handleWheel = (e: React.WheelEvent) => {
    if (isVideo) return
    e.preventDefault()
    setZoom(prev => {
      const next = clampZoom(prev - e.deltaY * 0.002)
      if (next === 1) setPan({ x: 0, y: 0 })
      return next
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVideo || zoom <= 1) return
    e.preventDefault()
    wasDragging.current = false
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY, px: pan.x, py: pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) wasDragging.current = true
    setPan({ x: dragStart.px + dx, y: dragStart.py + dy })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleImageClick = () => {
    if (isVideo || wasDragging.current) { wasDragging.current = false; return }
    if (isZoomed) { resetZoom() } else { setZoom(2.5) }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {images.map((image, i) => {
          const isConfirming = confirmingId === image.id
          const isVid        = image.type === 'video'
          const isSelected   = selectedIds.has(image.id)

          return (
            <div
              key={image.id}
              className={`group relative rounded-xl overflow-hidden border bg-bg-secondary aspect-square animate-scale-in transition-all duration-200 ${
                selectMode && isSelected
                  ? 'border-accent ring-2 ring-accent/50'
                  : 'border-border hover:border-accent/40'
              }`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Media */}
              <button
                onClick={() => {
                  if (selectMode) { onToggleSelect?.(image.id); return }
                  if (!isConfirming) setLightbox(image)
                }}
                className="absolute inset-0 w-full h-full"
              >
                {isVid ? (
                  <video
                    src={image.url}
                    muted loop preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                    onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                    onMouseLeave={(e) => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
                  />
                ) : (
                  <Image
                    src={image.url}
                    alt={`${image.color} — ${VIEW_LABELS[image.view] ?? image.view}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    unoptimized={image.url.startsWith('/uploads/') || image.url.startsWith('/generated/')}
                  />
                )}
              </button>

              {/* Hover overlay */}
              {!isConfirming && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                  {isVid
                    ? <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center"><Play size={16} className="text-white ml-0.5" fill="white" /></div>
                    : <ZoomIn size={20} className="text-white" />
                  }
                </div>
              )}

              {/* Metadata bottom */}
              {!isConfirming && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 pointer-events-none">
                  <p className="text-white text-xs font-medium truncate">{VIEW_LABELS[image.view] ?? image.view}</p>
                  <p className="text-white/60 text-xs capitalize truncate">{image.color}</p>
                </div>
              )}

              {/* Badge VIDEO */}
              {isVid && !isConfirming && (
                <div className="absolute top-1.5 left-1.5 pointer-events-none">
                  <span className="badge bg-blue-600/90 text-white text-[10px] font-bold px-1.5 py-0.5">VIDEO</span>
                </div>
              )}

              {/* Badge IA */}
              {image.isGenerated && !isVid && !isConfirming && (
                <div className="absolute top-1.5 left-1.5 pointer-events-none">
                  <span className="badge bg-accent text-zinc-950 text-[10px] font-bold px-1.5 py-0.5">IA</span>
                </div>
              )}

              {/* Badge ORIGINAL */}
              {!image.isGenerated && !isVid && !isConfirming && (
                <div className="absolute top-1.5 left-1.5 pointer-events-none">
                  <span className="badge bg-emerald-600/90 text-white text-[10px] font-bold px-1.5 py-0.5">ORIGINAL</span>
                </div>
              )}

              {/* Delete button */}
              {onDelete && !isConfirming && (
                <button
                  onClick={(e) => handleDeleteClick(e, image.id)}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg
                             bg-black/60 border border-white/10
                             flex items-center justify-center
                             opacity-0 group-hover:opacity-100
                             hover:bg-red-600 hover:border-red-500
                             transition-all duration-150"
                  title={isVid ? 'Eliminar video' : 'Eliminar imagen'}
                >
                  <Trash2 size={13} className="text-white" />
                </button>
              )}

              {/* Select mode checkbox */}
              {selectMode && !isConfirming && (
                <div className="absolute top-1.5 right-1.5 pointer-events-none">
                  {isSelected
                    ? <CheckCircle2 size={20} className="text-accent drop-shadow-md" fill="currentColor" />
                    : <Circle      size={20} className="text-white/60 drop-shadow-md" />
                  }
                </div>
              )}

              {/* Confirm delete */}
              {isConfirming && (
                <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-3 animate-fade-in">
                  <AlertTriangle size={22} className="text-red-400 shrink-0" />
                  <p className="text-white text-xs font-semibold text-center leading-snug">
                    ¿Eliminar {isVid ? 'este video' : 'esta imagen'}?
                  </p>
                  <div className="flex gap-2 w-full">
                    <button onClick={(e) => handleCancelDelete(e)}
                      className="flex-1 py-1.5 text-xs text-white/70 border border-white/20 rounded-lg hover:border-white/40 transition-colors">
                      Cancelar
                    </button>
                    <button onClick={(e) => handleConfirmDelete(e, image.id)}
                      className="flex-1 py-1.5 text-xs text-white font-semibold bg-red-600 rounded-lg hover:bg-red-500 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X size={18} className="text-white" />
          </button>

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev() }}
              className="absolute left-[calc(50%-28rem)] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/20 transition-all z-10 max-[960px]:left-2"
              title="Anterior (←)"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext() }}
              className="absolute right-[calc(50%-28rem)] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/20 transition-all z-10 max-[960px]:right-14"
              title="Siguiente (→)"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          )}

          <div
            className="relative max-w-4xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── Media area ──────────────────────────────────────────────── */}
            <div
              className={[
                'relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 aspect-video select-none',
                !isVideo && !isZoomed  ? 'cursor-zoom-in'  : '',
                !isVideo &&  isZoomed && !isDragging ? 'cursor-grab'    : '',
                !isVideo &&  isDragging              ? 'cursor-grabbing' : '',
              ].join(' ')}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {isVideo ? (
                <video
                  src={lightbox.url}
                  controls autoPlay loop playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.15s ease',
                  }}
                  onClick={handleImageClick}
                >
                  <Image
                    src={lightbox.url}
                    alt={lightbox.color}
                    fill
                    className="object-contain pointer-events-none"
                    unoptimized={lightbox.url.startsWith('/uploads/') || lightbox.url.startsWith('/generated/')}
                    onLoad={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      if (img.naturalWidth) setImgInfo({ width: img.naturalWidth, height: img.naturalHeight })
                    }}
                  />
                </div>
              )}

              {/* Zoom level badge */}
              {!isVideo && isZoomed && (
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2.5 py-1 rounded-lg pointer-events-none">
                  {Math.round(zoom * 100)}%
                </div>
              )}

              {/* Zoom hint */}
              {!isVideo && !isZoomed && (
                <div className="absolute bottom-3 right-3 bg-black/50 text-white/50 text-[10px] px-2 py-1 rounded pointer-events-none">
                  Click o scroll → zoom
                </div>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white/80 text-xs font-medium px-3 py-1 rounded-full pointer-events-none">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* ── Metadata + controls ──────────────────────────────────────── */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">

              {/* Info */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-white/70">
                  <Camera size={13} className="text-accent shrink-0" />
                  <span>{VIEW_LABELS[lightbox.view] ?? lightbox.view}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-white/70">
                  <Palette size={13} className="text-accent shrink-0" />
                  <span className="capitalize">{lightbox.color}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-white/70">
                  <Calendar size={13} className="text-accent shrink-0" />
                  <span>{lightbox.date}</span>
                </div>
                {/* Formato + dimensiones */}
                <div className="flex items-center gap-1.5 text-sm text-white/70">
                  <Info size={13} className="text-accent shrink-0" />
                  <span className="font-mono text-xs">
                    {getFormat(lightbox.url)}
                    {imgInfo ? ` · ${imgInfo.width} × ${imgInfo.height} px` : ''}
                  </span>
                </div>
                {/* Image counter */}
                {images.length > 1 && (
                  <span className="text-xs text-white/40 font-mono tabular-nums">
                    {currentIndex + 1} / {images.length}
                  </span>
                )}
                {lightbox.isGenerated ? (
                  <span className="badge bg-accent/20 text-accent border border-accent/30 text-xs">
                    {isVideo ? 'Video IA' : 'Generada con IA'}
                  </span>
                ) : !isVideo && (
                  <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                    Foto original
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">

                {/* Zoom controls — solo imágenes */}
                {!isVideo && (
                  <div className="flex items-center gap-0.5 border border-white/15 rounded-lg px-1 py-0.5">
                    <button
                      onClick={zoomOut}
                      disabled={zoom <= 1}
                      title="Alejar (−)"
                      className="w-7 h-7 flex items-center justify-center rounded text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <button
                      onClick={resetZoom}
                      title="Restablecer zoom"
                      className="text-xs text-white/50 hover:text-white w-11 text-center tabular-nums transition-colors"
                    >
                      {Math.round(zoom * 100)}%
                    </button>
                    <button
                      onClick={zoomIn}
                      disabled={zoom >= 4}
                      title="Acercar (+)"
                      className="w-7 h-7 flex items-center justify-center rounded text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ZoomIn size={14} />
                    </button>
                  </div>
                )}

                {/* Download */}
                <a
                  href={lightbox.url}
                  download
                  onClick={(e) => e.stopPropagation()}
                  title="Descargar"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/70 border border-white/15 rounded-lg hover:border-accent/50 hover:text-accent transition-colors"
                >
                  <Download size={13} />
                  Descargar
                </a>

                {/* Delete */}
                {onDelete && (
                  <button
                    onClick={() => { onDelete(lightbox.id); setLightbox(null) }}
                    title="Eliminar"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={13} />
                    Eliminar {isVideo ? 'video' : 'imagen'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
