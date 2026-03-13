/**
 * lib/catalog-store.ts
 *
 * Catalog persistence abstraction with optimistic concurrency control:
 *   - Production (BLOB_READ_WRITE_TOKEN set): stored in Vercel Blob as JSON
 *   - Development: local data/catalog.json
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
import { randomUUID } from 'crypto'
import type { Catalog } from '@/types'
import { USE_BLOB } from './storage'
import bundledCatalog from '@/data/catalog.json'

const CATALOG_LOCAL = join(process.cwd(), 'data', 'catalog.json')
const CATALOG_BLOB_PATH = 'catalog/catalog.json'
const CATALOG_VERSION_BLOB = 'catalog/catalog.version'

// ─── Concurrency Error ────────────────────────────────────────────────────────

export class ConcurrencyError extends Error {
  constructor(message = 'Catalog was modified by another request') {
    super(message)
    this.name = 'ConcurrencyError'
  }
}

// ─── Version helpers (Blob only) ──────────────────────────────────────────────

async function readCatalogVersion(): Promise<string | null> {
  if (!USE_BLOB) return null
  try {
    const { blobs } = await list({ prefix: 'catalog/' })
    const vBlob = blobs.find((b) => b.pathname === CATALOG_VERSION_BLOB)
    if (!vBlob) return null
    const res = await fetch(vBlob.url, { cache: 'no-store' })
    return res.ok ? (await res.text()).trim() : null
  } catch {
    return null
  }
}

// ─── Merge helper ────────────────────────────────────────────────────────────

/**
 * Merges the bundled catalog (source of truth for structure) with a Blob
 * catalog (source of truth for user-managed images). Returns the merged
 * catalog and whether any changes were made.
 *
 * Strategy:
 * - New models/variants from bundled are added to Blob.
 * - Structural metadata (name, description, year, coverImage, comingSoon) synced from bundled.
 * - Images are NEVER restored from bundled — Blob is the sole authority for images.
 * - Colors are merged (union of bundled and Blob colors).
 */
function mergeCatalogs(bundled: Catalog, blob: Catalog): { merged: Catalog; changed: boolean } {
  const merged = JSON.parse(JSON.stringify(blob)) as Catalog
  let changed = false

  for (const bundledModel of bundled.models) {
    const mergedModel = merged.models.find(m => m.id === bundledModel.id)

    if (!mergedModel) {
      merged.models.push(JSON.parse(JSON.stringify(bundledModel)))
      changed = true
      continue
    }

    // Sync structural model-level fields from bundled (source of truth for metadata)
    if (mergedModel.coverImage !== bundledModel.coverImage) {
      mergedModel.coverImage = bundledModel.coverImage
      changed = true
    }
    if (mergedModel.comingSoon !== bundledModel.comingSoon) {
      mergedModel.comingSoon = bundledModel.comingSoon
      changed = true
    }
    if (mergedModel.name !== bundledModel.name) {
      mergedModel.name = bundledModel.name
      changed = true
    }
    if (mergedModel.description !== bundledModel.description) {
      mergedModel.description = bundledModel.description
      changed = true
    }

    for (const bundledVariant of bundledModel.variants) {
      const mergedVariant = mergedModel.variants.find(v => v.id === bundledVariant.id)

      if (!mergedVariant) {
        mergedModel.variants.push(JSON.parse(JSON.stringify(bundledVariant)))
        changed = true
        continue
      }

      // Sync structural variant-level fields from bundled
      if (mergedVariant.name !== bundledVariant.name) {
        mergedVariant.name = bundledVariant.name
        changed = true
      }
      if (mergedVariant.description !== bundledVariant.description) {
        mergedVariant.description = bundledVariant.description
        changed = true
      }
      if (mergedVariant.year !== bundledVariant.year) {
        mergedVariant.year = bundledVariant.year
        changed = true
      }

      // If bundled model is comingSoon, clear any stale images in Blob
      if (bundledModel.comingSoon && mergedVariant.images.length > 0 && bundledVariant.images.length === 0) {
        mergedVariant.images = []
        changed = true
      }
      // NOTE: We intentionally do NOT restore bundled images when Blob has 0.
      // The Blob catalog is the source of truth for user-managed images.
      // If a user deleted all images, that decision must be respected.
      // Bundled images are only used during initial seeding (readCatalog fallback).

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

export interface VersionedCatalog {
  catalog: Catalog
  version: string | null
}

export async function readCatalog(): Promise<VersionedCatalog> {
  if (USE_BLOB) {
    try {
      const { blobs } = await list({ prefix: 'catalog/' })
      const found = blobs.find((b) => b.pathname === CATALOG_BLOB_PATH)
      if (found) {
        const [res, version] = await Promise.all([
          fetch(found.url, { cache: 'no-store' }),
          readCatalogVersion(),
        ])
        if (res.ok) {
          const blobCatalog = (await res.json()) as Catalog
          const bundled = bundledCatalog as Catalog
          // Auto-merge if bundled has newer structure or needs recovery
          const { merged, changed } = mergeCatalogs(bundled, blobCatalog)
          if (changed) {
            console.log('[catalog-store] Auto-merging bundled catalog updates into Blob')
            const newVersion = await writeCatalog(merged)
            // Return the NEW version so withCatalogUpdate doesn't get a stale version
            return { catalog: merged, version: newVersion }
          }
          return { catalog: blobCatalog, version }
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
      return { catalog: JSON.parse(JSON.stringify(bundled)) as Catalog, version: null }
    } catch (e) {
      console.warn('[catalog-store] Failed to seed Blob catalog:', e)
    }
  }

  // Local dev: try filesystem first
  try {
    const raw = await readFile(CATALOG_LOCAL, 'utf8')
    return { catalog: JSON.parse(raw) as Catalog, version: null }
  } catch {
    return { catalog: JSON.parse(JSON.stringify(bundledCatalog)) as Catalog, version: null }
  }
}

// ─── Write ───────────────────────────────────────────────────────────────────

export async function writeCatalog(
  catalog: Catalog,
  expectedVersion: string | null = null,
): Promise<string> {
  const content = JSON.stringify(catalog, null, 2)
  const newVersion = randomUUID()

  if (USE_BLOB) {
    // Optimistic concurrency check
    if (expectedVersion !== null) {
      const currentVersion = await readCatalogVersion()
      if (currentVersion !== null && currentVersion !== expectedVersion) {
        throw new ConcurrencyError()
      }
    }

    // Write catalog + version in parallel
    await Promise.all([
      put(CATALOG_BLOB_PATH, content, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
      }),
      put(CATALOG_VERSION_BLOB, newVersion, {
        access: 'public',
        contentType: 'text/plain',
        addRandomSuffix: false,
        allowOverwrite: true,
      }),
    ])
    return newVersion
  }

  // Local dev — no version check needed
  await writeFile(CATALOG_LOCAL, content, 'utf8')
  return newVersion
}

// ─── Safe catalog mutation with retry ─────────────────────────────────────────

/**
 * Reads the catalog, applies a mutation, and writes it back with concurrency
 * protection. Retries automatically on conflict (up to maxRetries times).
 */
export async function withCatalogUpdate(
  mutate: (catalog: Catalog) => Catalog | Promise<Catalog>,
  maxRetries = 5,
): Promise<Catalog> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const { catalog, version } = await readCatalog()
    const updated = await mutate(catalog)
    try {
      await writeCatalog(updated, version)
      return updated
    } catch (err) {
      if (err instanceof ConcurrencyError && attempt < maxRetries - 1) {
        console.warn(`[catalog-store] Concurrency conflict, retrying (${attempt + 1}/${maxRetries})`)
        continue
      }
      throw err
    }
  }
  throw new Error('Failed to update catalog after retries')
}
