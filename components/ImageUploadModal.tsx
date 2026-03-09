'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Upload, ImageIcon, Sparkles, AlertCircle } from 'lucide-react'
import type { VehicleImage } from '@/types'

const VIEW_OPTIONS = [
  { value: 'front', label: 'Frontal' },
  { value: 'side', label: 'Lateral' },
  { value: 'rear', label: 'Posterior' },
  { value: 'interior', label: 'Interior' },
  { value: 'detail', label: 'Detalle' },
]

interface Props {
  modelId: string
  variantId: string
  onClose: () => void
  onUploaded: (image: VehicleImage) => void
}

export function ImageUploadModal({ modelId, variantId, onClose, onUploaded }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [view, setView] = useState<string>('front')
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generateAfter, setGenerateAfter] = useState(true)

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

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('modelId', modelId)
      formData.append('variantId', variantId)
      formData.append('view', view)
      formData.append('color', 'sin color')

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      // Safely parse JSON — server may return plain text on unexpected errors
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
        color: 'sin color',
        date: new Date().toISOString().split('T')[0],
        url: data.imageUrl,
      }

      if (generateAfter) {
        // Redirect to generate page with the uploaded image
        const params = new URLSearchParams({
          imageUrl: data.imageUrl,
          name: file.name,
        })
        router.push(
          `/vehicle/${modelId}/${variantId}/generate?${params.toString()}`
        )
      } else {
        onUploaded(newImage)
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

        <div className="p-6 space-y-5">
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

          {/* Metadata */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Vista</label>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="w-full bg-bg-hover border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
            >
              {VIEW_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
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
              disabled={!file || uploading}
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
