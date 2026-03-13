import { NextRequest, NextResponse } from 'next/server'
import { readCatalog, writeCatalog } from '@/lib/catalog-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelId = searchParams.get('modelId')
    const variantId = searchParams.get('variantId')

    if (!modelId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros: modelId, variantId' },
        { status: 400 },
      )
    }

    const catalog = await readCatalog()
    const model = catalog.models.find((m) => m.id === modelId)
    const variant = model?.variants.find((v) => v.id === variantId)

    if (!variant) {
      return NextResponse.json(
        { success: false, error: `Variante no encontrada: ${modelId}/${variantId}` },
        { status: 404 },
      )
    }

    // Auto-clean: remove images with relative/broken URLs from the catalog
    const validImages = variant.images.filter((img) => img.url && img.url.startsWith('http'))
    if (validImages.length !== variant.images.length) {
      variant.images = validImages
      await writeCatalog(catalog)
    }

    return NextResponse.json({ success: true, images: validImages })
  } catch (err) {
    console.error('[variant-images] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
