import { NextRequest, NextResponse } from 'next/server'
import { deleteFile } from '@/lib/storage'
import { readCatalog, writeCatalog } from '@/lib/catalog-store'
import type { Catalog } from '@/types'

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

    // ── Read catalog ──────────────────────────────────────────────────────────
    const catalog: Catalog = await readCatalog()

    const model   = catalog.models.find((m) => m.id === modelId)
    const variant = model?.variants.find((v) => v.id === variantId)

    if (!variant) {
      return NextResponse.json(
        { success: false, error: `Variante no encontrada: ${modelId}/${variantId}` },
        { status: 404 },
      )
    }

    // ── Find the image to delete ──────────────────────────────────────────────
    const imageToDelete = variant.images.find((img) => img.id === imageId)

    if (!imageToDelete) {
      // Already gone — still return success so the UI stays clean
      return NextResponse.json({ success: true, deleted: false })
    }

    // ── Remove from catalog ───────────────────────────────────────────────────
    variant.images = variant.images.filter((img) => img.id !== imageId)

    await writeCatalog(catalog)

    // ── Delete physical file ──────────────────────────────────────────────────
    await deleteFile(imageToDelete.url)

    return NextResponse.json({ success: true, deleted: true, imageId })
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
