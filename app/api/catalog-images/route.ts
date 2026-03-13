import { NextRequest, NextResponse } from 'next/server'
import { readCatalog } from '@/lib/catalog-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/catalog-images?modelId=X&variantId=Y
 *
 * Returns current images for a variant from the runtime catalog
 * (Vercel Blob in prod, local JSON in dev). This ensures the gallery
 * always reflects the latest data, not the build-time snapshot.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelId   = searchParams.get('modelId')
    const variantId = searchParams.get('variantId')

    if (!modelId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros: modelId, variantId' },
        { status: 400 },
      )
    }

    const { catalog } = await readCatalog()
    const model   = catalog.models.find((m) => m.id === modelId)
    const variant = model?.variants.find((v) => v.id === variantId)

    return NextResponse.json(
      {
        success: true,
        images: variant?.images ?? [],
        colors: variant?.colors ?? [],
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    )
  } catch (err) {
    console.error('[catalog-images] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
