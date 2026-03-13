import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { saveFile, readFileBuffer, deleteFile } from '@/lib/storage'
import { withCatalogUpdate } from '@/lib/catalog-store'
import type { ImageView, VehicleImage } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ─── Nombre de archivo legible y ordenado ─────────────────────────────────────
// Ejemplo: renegade_sport_granite-crystal_front_a1b2c3.jpg
function buildFilename(
  modelId: string,
  variantId: string,
  colorId: string,
  view: ImageView,
  ext: string,
): string {
  const shortId = randomUUID().slice(0, 6)
  return `${modelId}_${variantId}_${colorId}_${view}_${shortId}.${ext}`
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      imageUrl,   // e.g. /generated/gen_jeep_renegade_sport_granite_crystal_abc123.svg
      view,       // 'front' | 'side' | 'rear'
      color,      // e.g. 'Granite Crystal Metallic'
      colorId,    // e.g. 'granite_crystal'
      modelId,    // e.g. 'jeep_renegade'
      variantId,  // e.g. 'sport'
    } = body as {
      imageUrl:  string
      view:      ImageView
      color:     string
      colorId:   string
      modelId:   string
      variantId: string
    }

    // ── Validation ────────────────────────────────────────────────────────────
    if (!imageUrl || !view || !color || !colorId || !modelId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 },
      )
    }

    // ── Read source file ──────────────────────────────────────────────────────
    const buffer = await readFileBuffer(imageUrl)

    // ── Determine extension ─────────────────────────────────────────────────
    const ext = imageUrl.split('.').pop()?.toLowerCase() ?? 'jpg'

    // ── Copy file with clean name to images/ ────────────────────────────────
    const filename = buildFilename(modelId, variantId, colorId, view, ext)
    const newImageUrl = await saveFile(
      'images/' + modelId + '/' + variantId + '/' + filename,
      buffer,
      ext === 'png' ? 'image/png' : 'image/jpeg',
    )

    // ── Build VehicleImage entry ────────────────────────────────────────────
    const imageId = `gen_${colorId}_${view}_${randomUUID().slice(0, 8)}`
    const today   = new Date().toISOString().split('T')[0]

    const newImage: VehicleImage = {
      id:            imageId,
      view,
      color,
      date:          today,
      url:           newImageUrl,
      isGenerated:   true,
      generatedFrom: imageUrl,
    }

    // ── Update catalog (with concurrency protection) ─────────────────────────
    await withCatalogUpdate((catalog) => {
      const model   = catalog.models.find((m) => m.id === modelId)
      const variant = model?.variants.find((v) => v.id === variantId)

      if (!variant) return catalog

      // Prepend so the new image appears first in the gallery
      variant.images = [newImage, ...variant.images]

      // If color not yet in variant colors list, add it
      const colorNormalized = color.toLowerCase()
      if (!variant.colors.includes(colorNormalized)) {
        variant.colors = [colorNormalized, ...variant.colors]
      }

      return catalog
    })

    // ── Clean up the generated source file (best-effort) ────────────────────
    try {
      await deleteFile(imageUrl)
    } catch (e) {
      console.warn('[save-to-catalog] Generated file cleanup failed (non-critical):', e)
    }

    return NextResponse.json({
      success:  true,
      imageId,
      imageUrl: newImageUrl,
      image:    newImage,
    })
  } catch (err) {
    console.error('[save-to-catalog] Error:', err)
    return NextResponse.json(
      {
        success: false,
        error:   err instanceof Error ? err.message : 'Error interno del servidor',
      },
      { status: 500 },
    )
  }
}
