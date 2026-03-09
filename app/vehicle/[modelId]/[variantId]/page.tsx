'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Plus, Video } from 'lucide-react'
import { getModelById, getVariantById, colorToHex } from '@/lib/catalog'
import { ImageGrid } from '@/components/ImageGrid'
import { FilterBar } from '@/components/FilterBar'
import { ImageUploadModal } from '@/components/ImageUploadModal'
import { useState, useEffect } from 'react'
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

  // ── Load generated images saved from the AI generation page ──────────────
  useEffect(() => {
    try {
      const storageKey = `generated_gallery_${modelId}_${variantId}`
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as VehicleImage[]
      if (saved.length > 0) {
        setImages((prev) => {
          const existingIds = new Set(prev.map((img) => img.id))
          const newImages = saved.filter((img) => !existingIds.has(img.id))
          return newImages.length > 0 ? [...newImages, ...prev] : prev
        })
      }
    } catch {
      // localStorage not available
    }
  }, [modelId, variantId])

  if (!model || !variant) return notFound()

  // Apply filters
  const filteredImages = images.filter((img) => {
    if (filters.color && img.color !== filters.color) return false
    if (filters.view && img.view !== filters.view) return false
    if (filters.dateFrom && img.date < filters.dateFrom) return false
    if (filters.dateTo && img.date > filters.dateTo) return false
    return true
  })

  const availableColors = Array.from(new Set(images.map((i) => i.color)))
  const availableViews = Array.from(new Set(images.map((i) => i.view)))

  const handleImageUploaded = (newImage: VehicleImage) => {
    setImages((prev) => [newImage, ...prev])
    setShowUpload(false)
  }

  const handleDeleteImage = async (imageId: string) => {
    // 1. Quitar del state visual inmediatamente (UX rápido)
    setImages((prev) => prev.filter((img) => img.id !== imageId))

    // 2. Limpiar localStorage por si acaso
    try {
      const storageKey = `generated_gallery_${modelId}_${variantId}`
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as VehicleImage[]
      const filtered = saved.filter((img) => img.id !== imageId)
      localStorage.setItem(storageKey, JSON.stringify(filtered))
    } catch {
      // localStorage no disponible
    }

    // 3. Borrar permanentemente de catalog.json (y archivo físico si aplica)
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

              {/* Color dots */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-text-muted">Colores:</span>
                {variant.colors.map((color) => (
                  <span
                    key={color}
                    title={color}
                    className="w-4 h-4 rounded-full border border-border ring-1 ring-transparent hover:ring-accent transition-all cursor-default"
                    style={{ backgroundColor: colorToHex(color) }}
                  />
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap shrink-0">
              {/* Generate video 360° — only pass images (not videos) */}
              <Link
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
              </Link>

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
          <ImageGrid images={filteredImages} onDelete={handleDeleteImage} />
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

      {/* ── Upload Modal ─────────────────────────────────────────────────────── */}
      {showUpload && (
        <ImageUploadModal
          modelId={modelId}
          variantId={variantId}
          onClose={() => setShowUpload(false)}
          onUploaded={handleImageUploaded}
        />
      )}
    </div>
  )
}
