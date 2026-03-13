import { NextRequest, NextResponse } from 'next/server'
import { deleteFile } from '@/lib/storage'
import { withCatalogUpdate } from '@/lib/catalog-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageId, modelId, variantId } = body as {
      imageId:   string
      modelId:   string
      variantId: string
    }

    if (!imageId || !modelId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos: imageId, modelId, variantId' },
        { status: 400 },
      )
    }

    // ── Find and remove from catalog (with concurrency protection) ─────────
    let imageUrl: string | null = null

    await withCatalogUpdate((catalog) => {
      const model   = catalog.models.find((m) => m.id === modelId)
      const variant = model?.variants.find((v) => v.id === variantId)

      if (!variant) return catalog // variant not found — no-op

      const imageToDelete = variant.images.find((img) => img.id === imageId)
      if (imageToDelete) {
        imageUrl = imageToDelete.url
        variant.images = variant.images.filter((img) => img.id !== imageId)
      }

      return catalog
    })

    // ── Delete physical file (best-effort) ──────────────────────────────────
    if (imageUrl) {
      await deleteFile(imageUrl)
    }

    return NextResponse.json({ success: true, deleted: !!imageUrl, imageId })
  } catch (err) {
    console.error('[delete-image] Error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Error interno del servidor',
      },
      { status: 500 },
    )
  }
}
