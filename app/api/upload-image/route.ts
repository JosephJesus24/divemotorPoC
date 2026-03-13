import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { saveFile } from '@/lib/storage'
import { withCatalogUpdate } from '@/lib/catalog-store'
import type { ImageView, VehicleImage } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_UPLOAD_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])

export async function POST(request: NextRequest) {
  try {
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (parseErr) {
      console.error('[upload-image] Failed to parse FormData:', parseErr)
      return NextResponse.json(
        { success: false, error: `Error al procesar el formulario: ${parseErr instanceof Error ? parseErr.message : String(parseErr)}` },
        { status: 400 },
      )
    }

    const image     = formData.get('image')     as File | null
    const modelId   = formData.get('modelId')   as string | null
    const variantId = formData.get('variantId') as string | null
    const view      = (formData.get('view')     as string) || 'front'
    const color     = (formData.get('color')    as string) || 'sin color'
    const yearStr   = formData.get('year')       as string | null

    if (!image || !modelId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: image, modelId, variantId' },
        { status: 400 },
      )
    }
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'El archivo debe ser una imagen' }, { status: 400 })
    }
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'La imagen no puede superar 10 MB' }, { status: 400 })
    }

    const ext = image.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_UPLOAD_EXTS.has(ext)) {
      return NextResponse.json(
        { success: false, error: 'Extensión no permitida. Use JPG, PNG, WEBP o GIF.' },
        { status: 400 },
      )
    }

    const imageId  = `${modelId}_${variantId}_${view}_${randomUUID().slice(0, 8)}`
    const filename = `${imageId}.${ext}`
    const bytes    = await image.arrayBuffer()
    const imageUrl = await saveFile(`uploads/${filename}`, Buffer.from(bytes), image.type || 'image/jpeg')

    // ── Persist to catalog so the image survives page reloads ──────────────
    const year = yearStr ? Number(yearStr) : undefined
    const today = new Date().toISOString().split('T')[0]

    const newImage: VehicleImage = {
      id: imageId,
      view: view as ImageView,
      color,
      year,
      date: today,
      url: imageUrl,
    }

    await withCatalogUpdate((catalog) => {
      const model   = catalog.models.find((m) => m.id === modelId)
      const variant = model?.variants.find((v) => v.id === variantId)
      if (variant) {
        variant.images = [newImage, ...variant.images]
        const colorNormalized = color.toLowerCase()
        if (colorNormalized !== 'sin color' && !variant.colors.includes(colorNormalized)) {
          variant.colors = [colorNormalized, ...variant.colors]
        }
      }
      return catalog
    })

    return NextResponse.json({ success: true, imageUrl, imageId, view, color, filename })
  } catch (err) {
    console.error('[upload-image] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
