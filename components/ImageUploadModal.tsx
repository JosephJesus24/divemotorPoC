'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Upload, ImageIcon, Sparkles, AlertCircle } from 'lucide-react'
import type { VehicleImage } from '@/types'
import { getUploadColors } from '@/data/variant-colors'

const VIEW_OPTIONS = [
  { value: 'front',    label: 'Frontal' },
  { value: 'side',     label: 'Lateral' },
  { value: 'rear',     label: 'Posterior' },
  { value: 'interior', label: 'Interior' },
  { value: 'detail',   label: 'Detalle' },
]

// Persists view selection across modal re-opens within the same page session
let lastSelectedView: string | null = null

interface Props {
  modelId: string
  variantId: string
  variantYear: number
  onClose: () => void
  onUploaded: (image: VehicleImage) => void
}

export function ImageUploadModal({ modelId, variantId, variantYear, onClose, onUploaded }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  // Get official colors for this variant
  const UPLOAD_COLORS = getUploadColors(modelId, variantId)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // Revoke object URL when preview changes or modal unmounts (prevents memory leak)
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])
  const [view, setView] = useState<string>(lastSelectedView ?? 'front')
  const [colorValue, setColorValue] = useState<string>(UPLOAD_COLORS[0]?.value ?? '')
  const [customColor, setCustomColor] = useState<string>('')
  const [year, setYear] = useState<number>(variantYear)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generateAfter, setGenerateAfter] = useState(true)

  const isCustom = colorValue === '__custom__'
  const finalColor = isCustom ? customColor.trim() : (UPLOAD_COLORS.find(c => c.value === colorValue)?.label ?? colorValue)

  const selectFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Solo se admiten archivos de imagen (JPG, PNG, WEBP).')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('El archivo no puede superar 10 MB.')
      return
    }
    setError(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) selectFile(f)
  }, [])

  const canUpload = !!file && !uploading && !!finalColor && !!year

  const handleUpload = async () => {
    if (!file || !finalColor || !year) return
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('modelId', modelId)
      formData.append('variantId', variantId)
      formData.append('view', view)
      formData.append('color', finalColor)
      formData.append('year', String(year))

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      let data: { success: boolean; imageUrl: string; imageId: string; error?: string }
      try {
        data = await res.json()
      } catch {
        const text = await res.text().catch(() => `HTTP ${res.status}`)
        throw new Error(`Error del servidor: ${text}`)
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Error al subir la imagen')
      }

      const newImage: VehicleImage = {
        id: data.imageId,
        view: view as VehicleImage['view'],
        color: finalColor,
        year,
        date: new Date().toISOString().split('T')[0],
        url: data.imageUrl,
      }

      // Always add to gallery immediately and persist via localStorage
      try {
        const storageKey = `generated_gallery_${modelId}_${variantId}`
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as VehicleImage[]
        localStorage.setItem(storageKey, JSON.stringify([newImage, ...saved]))
      } catch { /* localStorage not available */ }

      onUploaded(newImage)
      lastSelectedView = view

      if (generateAfter) {
        const params = new URLSearchParams({
          imageUrl: data.imageUrl,
          name: file.name,
          color: colorValue,
        })
        router.push(`/vehicle/${modelId}/${variantId}/generate?${params.toString()}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-bg-secondary border border-border rounded-2xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-bold text-text-primary text-lg">Agregar imagen</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Sube una foto del vehículo
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-bg-hover border border-border flex items-center justify-center hover:bg-bg-card transition-colors"
          >
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDragging
                ? 'border-accent bg-accent/5'
                : preview
                ? 'border-border'
                : 'border-border hover:border-border-light'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !preview && fileRef.current?.click()}
          >
            {preview ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={preview} alt="Preview" fill className="object-contain" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setPreview(null)
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X size={13} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-bg-hover border border-border flex items-center justify-center mb-3">
                  <Upload size={20} className="text-text-muted" />
                </div>
                <p className="text-sm font-medium text-text-secondary mb-1">
                  Arrastra una imagen o haz clic
                </p>
                <p className="text-xs text-text-muted">
                  JPG, PNG, WEBP · Máx. 10 MB
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) selectFile(f)
            }}
          />

          {/* Metadata — 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            {/* Vista */}
            <div>
              <label className="block text-xs text-text-muted mb-1.5">
                Vista <span className="text-accent">*</span>
              </label>
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              >
                {VIEW_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label className="block text-xs text-text-muted mb-1.5">
                Año <span className="text-accent">*</span>
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2000}
                max={2030}
                className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5">
              Color del vehículo <span className="text-accent">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                className="flex-1 bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              >
                {UPLOAD_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {/* Color swatch preview */}
              {!isCustom && (
                <div
                  className="w-10 rounded-lg border border-border flex-shrink-0"
                  style={{ backgroundColor: UPLOAD_COLORS.find(c => c.value === colorValue)?.hex ?? '#888' }}
                />
              )}
            </div>

          </div>

          {/* Generate toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                generateAfter ? 'bg-accent' : 'bg-bg-hover border border-border'
              }`}
              onClick={() => setGenerateAfter((v) => !v)}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${
                  generateAfter ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent" />
                Generar variantes de color después
              </p>
              <p className="text-xs text-text-muted">
                Ir al generador de IA con esta imagen
              </p>
            </div>
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-ghost flex-1">
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className="btn-primary flex-1"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <ImageIcon size={16} />
                  {generateAfter ? 'Subir y generar' : 'Subir imagen'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
