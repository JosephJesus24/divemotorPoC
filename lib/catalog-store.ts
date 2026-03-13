/**
 * lib/catalog-store.ts
 *
 * Catalog persistence abstraction:
 * - Production (BLOB_READ_WRITE_TOKEN set): stored in Vercel Blob as JSON
 * - Development: local data/catalog.json
 *
 * On first production request, if no catalog blob exists yet,
 * falls back to the bundled data/catalog.json (committed to git).
 *
 * Auto-merge: when a Blob catalog exists but is missing models/variants
 * from the latest build, it merges them in automatically while preserving
 * user-generated images.
 */

import { put, list } from '@vercel/blob'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { Catalog, VehicleModel } from '@/types'
import { USE_BLOB } from './storage'
import bundledCatalog from '@/data/catalog.json'

const CATALOG_LOCAL = join(process.cwd(), 'data', 'catalog.json')
const CATALOG_BLOB_PATH = 'catalog/catalog.json'

// ─── Merge helper ────────────────────────────────────────────────────────────

/**
   * Merges the bundled catalog (source of truth for structure) with a Blob
   * catalog (which may contain user-generated images). Returns the merged
   * catalog and whether any changes were made.
   *
   * Strategy:
   * - New models/variants from bundled are seeded into Blob.
   * - If a variant exists in Blob with NO images, restore bundled images
   *   (this handles the case where images were accidentally wiped by a bug).
   * - If a variant exists in Blob WITH images, keep them (user-managed).
   * - Colors are merged (union of bundled and Blob colors).
   */
function mergeCatalogs(bundled: Catalog, blob: Catalog): { merged: Catalog; changed: boolean } {
    const merged = JSON.parse(JSON.stringify(blob)) as Catalog
    let changed = false

  for (const bundledModel of bundled.models) {
        let mergedModel = merged.models.find(m => m.id === bundledModel.id)

      if (!mergedModel) {
              // Entire model is new in code — seed it from bundled
          merged.models.push(JSON.parse(JSON.stringify(bundledModel)))
              changed = true
              continue
      }

      for (const bundledVariant of bundledModel.variants) {
              let mergedVariant = mergedModel.variants.find(v => v.id === bundledVariant.id)

          if (!mergedVariant) {
                    // New variant added in code — seed it from bundled (with its images)
                mergedModel.variants.push(JSON.parse(JSON.stringify(bundledVariant)))
                    changed = true
                    continue
          }

          // Variant already exists in Blob.
          // If it has NO images, restore from bundled (recovery from accidental wipe).
          // If it has images already, keep them as-is (user-managed).
          if (mergedVariant.images.length === 0 && bundledVariant.images.length > 0) {
                    mergedVariant.images = JSON.parse(JSON.stringify(bundledVariant.images))
                    changed = true
          }

          // Merge colors: add new color values from bundled not yet in Blob
          const originalSize = mergedVariant.colors.length
              const colorSet = new Set(mergedVariant.colors)
              for (const c of bundledVariant.colors) colorSet.add(c)
              mergedVariant.colors = Array.from(colorSet)
              if (mergedVariant.colors.length !== originalSize) changed = true
      }
  }

  return { merged, changed }
}

// ─── Read ────────────────────────────────────────────────────────────────────

export async function readCatalog(): Promise<Catalog> {
    if (USE_BLOB) {
          try {
                  const { blobs } = await list({ prefix: 'catalog/' })
                  const found = blobs.find((b) => b.pathname === CATALOG_BLOB_PATH)
                  if (found) {
                            const res = await fetch(`${found.url}?t=${Date.now()}`)
                            if (res.ok) {
                                        const blobCatalog = (await res.json()) as Catalog
                                        const bundled = bundledCatalog as Catalog
                                        // Auto-merge if bundled has newer structure or needs recovery
                              const { merged, changed } = mergeCatalogs(bundled, blobCatalog)
                                        if (changed) {
                                                      console.log('[catalog-store] Auto-merging bundled catalog updates into Blob')
                                                      await writeCatalog(merged)
                                        }
                                        return changed ? merged : blobCatalog
                            }
                  }
          } catch (e) {
                  console.warn('[catalog-store] Blob read failed, falling back to bundled:', e)
          }

      // No blob catalog yet — seed it from bundled
      try {
              const bundled = bundledCatalog as Catalog
              await writeCatalog(bundled)
              console.log('[catalog-store] Seeded Blob catalog from bundled')
              return JSON.parse(JSON.stringify(bundled)) as Catalog
      } catch (e) {
              console.warn('[catalog-store] Failed to seed Blob catalog:', e)
      }
    }

  // Local dev: try filesystem first
  try {
        const raw = await readFile(CATALOG_LOCAL, 'utf8')
        return JSON.parse(raw) as Catalog
  } catch {
        return JSON.parse(JSON.stringify(bundledCatalog)) as Catalog
  }
}

// ─── Write ───────────────────────────────────────────────────────────────────

export async function writeCatalog(catalog: Catalog): Promise<void> {
    const content = JSON.stringify(catalog, null, 2)
    if (USE_BLOB) {
          await put(CATALOG_BLOB_PATH, content, {
                  access: 'public',
                  contentType: 'application/json',
                  addRandomSuffix: false,
                  allowOverwrite: true,
          })
          return
    }
    // Local dev
  await writeFile(CATALOG_LOCAL, content, 'utf8')
}
