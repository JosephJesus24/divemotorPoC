'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Plus, Video, CheckSquare, Download, X as XIcon } from 'lucide-react'
import { getModelById, getVariantById } from '@/lib/catalog'
import { ImageGrid } from '@/components/ImageGrid'
import { FilterBar } from '@/components/FilterBar'
import { ImageUploadModal } from '@/components/ImageUploadModal'
import { useState, useEffect, useMemo } from 'react'
import type { VehicleImage, GalleryFilters } from '@/types'

export default function GalleryPage() {
  const params = useParams<{ modelId: string; variantId: string }>()
  const { modelId, variantId } = params

  const model = getModelById(modelId)
  const variant = getVariantById(modelId, variantId)

  const [filters, setFilters] = useState<GalleryFilters>({
    color: null,
    view: null,
    dateFrom: null,
    dateTo: null,
  })
  const [images, setImages] = useState<VehicleImage[]>(
    variant?.images ?? []
  )
  const [showUpload, setShowUpload] = useState(false)

  // ── Multi-select state ────────────────────────────────────────────────────
  const [selectMode,  setSelectMode]  = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState(false)

  // ── Load generated images saved from the AI generation page ──────────────
  useEffect(() => {
    let isMounted = true
    try {
      const storageKey = `generated_gallery_${modelId}_${variantId}`
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as VehicleImage[]
      if (saved.length > 0 && isMounted) {
        setImages((prev) => {
          const existingIds = new Set(prev.map((img) => img.id))
          const newImages = saved.filter((img) => !existingIds.has(img.id))
          return newImages.length > 0 ? [...newImages, ...prev] : prev
        })
      }
    } catch {
      // localStorage not available
    }
    return () => { isMounted = false }
  }, [modelId, variantId])

  if (!model || !variant) return notFound()

  // Apply filters (memoized — avoids recalculating on unrelated state changes)
  const filteredImages = useMemo(() => images.filter((img) => {
    if (filters.color && img.color !== filters.color) return false
    if (filters.view && img.view !== filters.view) return false
    if (filters.dateFrom && img.date < filters.dateFrom) return false
    if (filters.dateTo && img.date > filters.dateTo) return false
    return true
  }), [images, filters])

  const availableColors = useMemo(() => Array.from(new Set(images.map((i) => i.color))), [images])
  const availableViews  = useMemo(() => Array.from(new Set(images.map((i) => i.view))),  [images])

  const handleImageUploaded = (newImage: VehicleImage) => {
    setImages((prev) => [newImage, ...prev])
    setShowUpload(false)
  }

  const handleDeleteImage = async (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
    setSelectedIds((prev) => { const s = new Set(prev); s.delete(imageId); return s })

    try {
      const storageKey = `generated_gallery_${modelId}_${variantId}`
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as VehicleImage[]
      localStorage.setItem(storageKey, JSON.stringify(saved.filter((img) => img.id !== imageId)))
    } catch { /* localStorage no disponible */ }

    try {
      await fetch('/api/delete-image', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageId, modelId, variantId }),
      })
    } catch (err) {
      console.error('[handleDeleteImage] Error al borrar del catálogo:', err)
    }
  }

  // ── Multi-select handlers ─────────────────────────────────────────────────
  const toggleSelectMode = () => {
    setSelectMode((v) => !v)
    setSelectedIds(new Set())
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkDownload = async () => {
    if (selectedIds.size === 0 || downloading) return
    setDownloading(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const selectedImages = filteredImages.filter((img) => selectedIds.has(img.id))

      await Promise.all(
        selectedImages.map(async (img) => {
          const res = await fetch(img.url)
          const blob = await res.blob()
          const ext = img.url.split('.').pop()?.split('?')[0] ?? 'jpg'
          const filename = `${img.color}_${img.view}_${img.id.slice(-6)}.${ext}`
          zip.file(filename, blob)
        })
      )

      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `galeria-${variantId}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[handleBulkDownload] Error:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
            <Link href="/" className="hover:text-text-primary transition-colors">
              Showroom
            </Link>
            <ChevronRight size={14} />
            <Link
              href={`/brand/${model.brand.toLowerCase()}`}
              className="hover:text-text-primary transition-colors"
            >
              {model.brand}
            </Link>
            <ChevronRight size={14} />
            <Link
              href={`/vehicle/${modelId}`}
              className="hover:text-text-primary transition-colors"
            >
              {model.name}
            </Link>
            <ChevronRight size={14} />
            <span className="text-text-primary font-medium">{variant.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Gallery Header ───────────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="section-label mb-2">{model.name} · {variant.year}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">
                {variant.name}
              </h1>
              {variant.description && (
                <p className="text-text-secondary mt-2 max-w-lg">
                  {variant.description}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap shrink-0">
              {/* Video 360° — temporalmente oculto durante mejoras */}
              {false && <Link
                href={`/vehicle/${modelId}/${variantId}/video?${images
                  .filter((img) => img.type !== 'video')
                  .slice(0, 12)
                  .flatMap((img) => [
                    `images=${encodeURIComponent(img.url)}`,
                    `imgcolors=${encodeURIComponent(img.color)}`,
                  ])
                  .join('&')}`}
                className="btn-ghost"
              >
                <Video size={16} />
                Video 360°
              </Link>}

              {/* Multi-select toggle */}
              <button
                onClick={toggleSelectMode}
                className={`btn-ghost shrink-0 ${selectMode ? 'border-accent text-accent' : ''}`}
              >
                <CheckSquare size={16} />
                {selectMode ? 'Cancelar selección' : 'Seleccionar'}
              </button>

              {/* Upload new image */}
              <button
                onClick={() => setShowUpload(true)}
                className="btn-primary shrink-0"
              >
                <Plus size={18} />
                Agregar nueva imagen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            availableColors={availableColors}
            availableViews={availableViews}
          />
        </div>
      </div>

      {/* ── Image Grid ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-muted">
            {filteredImages.length} de {images.length} elemento{images.length !== 1 ? 's' : ''}
          </p>
          {filteredImages.length !== images.length && (
            <button
              onClick={() => setFilters({ color: null, view: null, dateFrom: null, dateTo: null })}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filteredImages.length > 0 ? (
          <ImageGrid
            images={filteredImages}
            onDelete={handleDeleteImage}
            selectMode={selectMode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        ) : (
          <div className="text-center py-24">
            <p className="text-text-muted text-lg mb-2">Sin imágenes</p>
            <p className="text-text-muted text-sm mb-6">
              No hay imágenes con los filtros seleccionados.
            </p>
            <button
              onClick={() => setFilters({ color: null, view: null, dateFrom: null, dateTo: null })}
              className="btn-ghost text-sm px-4 py-2"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>

      {/* ── Floating multi-select bar ─────────────────────────────────────────── */}
      {selectMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-scale-in">
          <div className="flex items-center gap-3 bg-zinc-900 border border-border rounded-2xl shadow-2xl px-5 py-3">
            <span className="text-sm text-text-secondary whitespace-nowrap">
              <span className="font-semibold text-text-primary">{selectedIds.size}</span> seleccionada{selectedIds.size !== 1 ? 's' : ''}
            </span>
            <div className="w-px h-5 bg-border" />
            <button
              onClick={handleBulkDownload}
              disabled={selectedIds.size === 0 || downloading}
              className="flex items-center gap-2 btn-primary text-sm py-2 px-4 disabled:opacity-40"
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download size={14} />
                  Descargar ZIP
                </>
              )}
            </button>
            <button
              onClick={toggleSelectMode}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
              title="Cancelar selección"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Upload Modal ─────────────────────────────────────────────────────── */}
      {showUpload && (
        <ImageUploadModal
          modelId={modelId}
          variantId={variantId}
          variantYear={variant.year}
          onClose={() => setShowUpload(false)}
          onUploaded={handleImageUploaded}
        />
      )}
    </div>
  )
}
