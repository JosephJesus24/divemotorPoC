import { NextResponse } from 'next/server'
import { readCatalog } from '@/lib/catalog-store'
import { USE_BLOB } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/sync-catalog
 *
 * Forces a re-read of the catalog, which triggers auto-merge if needed.
 * The auto-merge in readCatalog() handles syncing bundled structure
 * while preserving user-managed images in Blob.
 *
 * GET /api/sync-catalog
 *
 * Returns current catalog stats (read-only).
 */
export async function POST() {
  try {
    if (!USE_BLOB) {
      return NextResponse.json({
        success: true,
        message: 'No Blob storage — using local filesystem, no sync needed.',
      })
    }

    // readCatalog() already handles auto-merge internally:
    // - Syncs structural metadata from bundled
    // - Adds new models/variants from bundled
    // - NEVER restores bundled images (Blob is source of truth for images)
    const { catalog } = await readCatalog()

    const totalImages = catalog.models.reduce((acc, m) =>
      acc + m.variants.reduce((vacc, v) => vacc + v.images.length, 0), 0)

    return NextResponse.json({
      success: true,
      message: 'Catalog synced via auto-merge.',
      models: catalog.models.length,
      totalImages,
    })
  } catch (err) {
    console.error('[sync-catalog] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const { catalog } = await readCatalog()

    const stats = catalog.models.map(m => ({
      id: m.id,
      name: m.name,
      comingSoon: m.comingSoon,
      variants: m.variants.map(v => ({
        id: v.id,
        name: v.name,
        images: v.images.length,
        colors: v.colors.length,
      })),
    }))

    return NextResponse.json(
      { success: true, stats },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('[sync-catalog] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
