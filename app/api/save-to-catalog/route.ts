import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { saveFile, readFileBuffer, deleteFile } from '@/lib/storage'
import { withCatalogUpdate } from '@/lib/catalog-store'
import type { ImageView, VehicleImage } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120 // 2 min — enough for multiple Blob reads + writes + catalog update

// ─── MIME type map ────────────────────────────────────────────────────────────
const MIME_MAP: Record<string, string> = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  gif:  'image/gif',
  svg:  'image/svg+xml',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function getExtAndMime(imageUrl: string): { ext: string; contentType: string } {
  const cleanUrl = imageUrl.split('?')[0].split('#')[0]
  const rawExt = cleanUrl.split('.').pop()?.toLowerCase() ?? 'jpg'
  const ext = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(rawExt) ? rawExt : 'jpg'
  const contentType = MIME_MAP[ext] ?? 'image/jpeg'
  return { ext, contentType }
}

// ─── Types for the request ──────────────────────────────────────────────────

interface SaveItem {
  imageUrl:  string
  view:      ImageView
  color:     string
  colorId:   string
}

interface SaveRequest {
  /** Single item (legacy) or array of items (batch) */
  imageUrl?:  string
  view?:      ImageView
  color?:     string
  colorId?:   string
  modelId:    string
  variantId:  string
  /** Batch items — if present, single-item fields are ignored */
  items?:     SaveItem[]
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveRequest
    const { modelId, variantId } = body

    if (!modelId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos: modelId y variantId son requeridos' },
        { status: 400 },
      )
    }

    // ── Normalize input: single item or batch ──────────────────────────────
    const items: SaveItem[] = body.items && body.items.length > 0
      ? body.items
      : (body.imageUrl && body.view && body.color && body.colorId)
        ? [{ imageUrl: body.imageUrl, view: body.view, color: body.color, colorId: body.colorId }]
        : []

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos (imageUrl, view, color, colorId)' },
        { status: 400 },
      )
    }

    console.log(`[save-to-catalog] START — model=${modelId} variant=${variantId} — ${items.length} item(s)`)

    // ── Step 1: Read all source files + copy to images/ (in parallel) ──────
    const today = new Date().toISOString().split('T')[0]
    const savedImages: VehicleImage[] = []
    const sourceUrls: string[] = [] // for cleanup
    const errors: { colorId: string; error: string }[] = []

    const fileOps = items.map(async (item) => {
      try {
        // Read the generated source file
        const buffer = await readFileBuffer(item.imageUrl)
        console.log(`[save-to-catalog] Read ${item.colorId}: ${buffer.length} bytes`)

        // Determine extension + MIME
        const { ext, contentType } = getExtAndMime(item.imageUrl)

        // Save to images/ with a clean filename
        const filename = buildFilename(modelId, variantId, item.colorId, item.view, ext)
        const blobPath = `images/${modelId}/${variantId}/${filename}`
        const newImageUrl = await saveFile(blobPath, buffer, contentType)
        console.log(`[save-to-catalog] Saved ${item.colorId} → ${newImageUrl}`)

        // Build catalog entry
        const imageId = `gen_${item.colorId}_${item.view}_${randomUUID().slice(0, 8)}`
        const newImage: VehicleImage = {
          id:            imageId,
          view:          item.view,
          color:         item.color,
          date:          today,
          url:           newImageUrl,
          isGenerated:   true,
          generatedFrom: item.imageUrl,
        }

        savedImages.push(newImage)
        sourceUrls.push(item.imageUrl)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        console.error(`[save-to-catalog] FAILED for ${item.colorId}:`, msg)
        errors.push({ colorId: item.colorId, error: msg })
      }
    })

    await Promise.all(fileOps)

    if (savedImages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se pudo guardar ninguna imagen', errors },
        { status: 500 },
      )
    }

    // ── Step 2: Update catalog ONCE for all images (atomic) ────────────────
    try {
      await withCatalogUpdate((catalog) => {
        const model   = catalog.models.find((m) => m.id === modelId)
        const variant = model?.variants.find((v) => v.id === variantId)

        if (!variant) {
          console.error(`[save-to-catalog] Variant not found: ${modelId}/${variantId}`)
          return catalog
        }

        // Prepend all new images at once
        variant.images = [...savedImages, ...variant.images]

        // Add any new colors
        for (const img of savedImages) {
          const colorNormalized = img.color.toLowerCase()
          if (!variant.colors.includes(colorNormalized)) {
            variant.colors = [colorNormalized, ...variant.colors]
          }
        }

        console.log(`[save-to-catalog] Catalog updated — ${savedImages.length} image(s) added, total: ${variant.images.length}`)
        return catalog
      })
    } catch (catalogErr) {
      console.error(`[save-to-catalog] FAILED to update catalog:`, catalogErr)
      return NextResponse.json(
        { success: false, error: `No se pudo actualizar el catálogo: ${catalogErr instanceof Error ? catalogErr.message : 'Error'}` },
        { status: 500 },
      )
    }

    // ── Step 3: Clean up generated source files (best-effort) ──────────────
    for (const url of sourceUrls) {
      try { await deleteFile(url) } catch { /* non-critical */ }
    }

    console.log(`[save-to-catalog] SUCCESS — ${savedImages.length} saved, ${errors.length} failed`)

    return NextResponse.json({
      success:    true,
      saved:      savedImages.length,
      failed:     errors.length,
      images:     savedImages,
      errors:     errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('[save-to-catalog] Unhandled error:', err)
    return NextResponse.json(
      {
        success: false,
        error:   err instanceof Error ? err.message : 'Error interno del servidor',
      },
      { status: 500 },
    )
  }
}
