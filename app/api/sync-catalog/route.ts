import { NextResponse } from 'next/server'
import { writeCatalog, readCatalog } from '@/lib/catalog-store'
import { USE_BLOB } from '@/lib/storage'
import bundledCatalog from '@/data/catalog.json'
import type { Catalog } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/sync-catalog
 *
 * Merges the bundled catalog (from the latest deploy) with the Blob catalog
 * (which may contain user-generated images). This ensures new models/variants
 * from code updates are available while preserving generated images.
 *
 * If no Blob catalog exists, it simply uploads the bundled one.
 */
export async function POST() {
  try {
    if (!USE_BLOB) {
      return NextResponse.json({
        success: true,
        message: 'No Blob storage — using local filesystem, no sync needed.',
      })
    }

    const bundled = bundledCatalog as Catalog

    // Try to read existing Blob catalog
    let blobCatalog: Catalog | null = null
    try {
      const result = await readCatalog()
      blobCatalog = result.catalog
    } catch {
      // No blob catalog yet
    }

    if (!blobCatalog) {
      // No blob catalog — upload bundled directly
      await writeCatalog(bundled)
      return NextResponse.json({
        success: true,
        message: 'Blob catalog created from bundled catalog.',
        models: bundled.models.length,
      })
    }

    // Merge: use bundled as base, but preserve generated images from Blob
    const merged = JSON.parse(JSON.stringify(bundled)) as Catalog

    for (const blobModel of blobCatalog.models) {
      const mergedModel = merged.models.find(m => m.id === blobModel.id)
      if (!mergedModel) continue

      for (const blobVariant of blobModel.variants) {
        const mergedVariant = mergedModel.variants.find(v => v.id === blobVariant.id)
        if (!mergedVariant) continue

        // Keep generated images from Blob that aren't in the bundled catalog
        const bundledUrls = new Set(mergedVariant.images.map(img => img.url))
        const generatedImages = blobVariant.images.filter(
          img => img.isGenerated && !bundledUrls.has(img.url)
        )

        if (generatedImages.length > 0) {
          mergedVariant.images = [...generatedImages, ...mergedVariant.images]
        }

        // Merge colors
        const colorSet = new Set(mergedVariant.colors)
        for (const c of blobVariant.colors) {
          colorSet.add(c)
        }
        mergedVariant.colors = Array.from(colorSet)
      }
    }

    await writeCatalog(merged)

    const totalGenerated = merged.models.reduce((acc, m) =>
      acc + m.variants.reduce((vacc, v) =>
        vacc + v.images.filter(i => i.isGenerated).length, 0), 0)

    return NextResponse.json({
      success: true,
      message: 'Blob catalog synced with latest bundled catalog. Generated images preserved.',
      models: merged.models.length,
      generatedImagesPreserved: totalGenerated,
    })
  } catch (err) {
    console.error('[sync-catalog] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
