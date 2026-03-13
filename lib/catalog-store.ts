/**
 * lib/catalog-store.ts
 *
 * Catalog persistence with optimistic concurrency control.
 *
 * Production (BLOB_READ_WRITE_TOKEN set): Vercel Blob JSON
 * Development: local data/catalog.json
 *
 * IMPORTANT — Data ownership:
 *   - Bundled catalog (data/catalog.json): source of truth for STRUCTURE
 *     (model names, variant names, descriptions, colors, metadata).
 *     It contains NO images — images arrays are always empty.
 *   - Blob catalog: source of truth for USER DATA (images).
 *     All uploads, deletions, and AI-generated images live here.
 *
 * Auto-merge adds new models/variants from bundled and syncs metadata,
 * but NEVER touches images in the Blob.
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

// ─── Cache-busting helper ──────────────────────────────────────────────────────
// Vercel Blob serves files through a CDN that may cache content briefly.
// Adding a unique query parameter forces the CDN to treat each request
// as a cache miss, ensuring we always get the freshest data.
let _fetchCounter = 0
function bustCache(url: string): string {
  return `${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}_${++_fetchCounter}`
}

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
    const res = await fetch(bustCache(vBlob.url), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' },
    })
    return res.ok ? (await res.text()).trim() : null
  } catch {
    return null
  }
}

// ─── Merge helper ────────────────────────────────────────────────────────────

/**
 * Merges bundled catalog (structure) with Blob catalog (user data).
 *
 * - Adds NEW models/variants from bundled to Blob.
 * - Syncs metadata fields (name, description, year, coverImage, comingSoon).
 * - Merges colors (union).
 * - NEVER touches images — Blob is the sole authority for images.
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
    let blobReadFailed = false

    try {
      const { blobs } = await list({ prefix: 'catalog/' })
      const found = blobs.find((b) => b.pathname === CATALOG_BLOB_PATH)

      if (found) {
        // Blob catalog exists — read it with cache-busting
        const [res, version] = await Promise.all([
          fetch(bustCache(found.url), {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' },
          }),
          readCatalogVersion(),
        ])
        if (res.ok) {
          const blobCatalog = (await res.json()) as Catalog
          const bundled = bundledCatalog as Catalog

          const { merged, changed } = mergeCatalogs(bundled, blobCatalog)
          if (changed) {
            console.log('[catalog-store] Auto-merging bundled structure into Blob')
            const newVersion = await writeCatalog(merged)
            return { catalog: merged, version: newVersion }
          }
          return { catalog: blobCatalog, version }
        }
      } else {
        console.log('[catalog-store] No Blob catalog found, seeding from bundled')
        const bundled = bundledCatalog as Catalog
        const seedCatalog = JSON.parse(JSON.stringify(bundled)) as Catalog
        const newVersion = await writeCatalog(seedCatalog)
        return { catalog: seedCatalog, version: newVersion }
      }
    } catch (e) {
      console.warn('[catalog-store] Blob read failed, returning bundled as read-only fallback:', e)
      blobReadFailed = true
    }

    if (blobReadFailed) {
      return {
        catalog: JSON.parse(JSON.stringify(bundledCatalog)) as Catalog,
        version: null,
      }
    }
  }

  // ── Local dev: filesystem ─────────────────────────────────────────────────
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
  // Compact JSON (no pretty-print) — smaller payload = faster write + read
  const content = JSON.stringify(catalog)
  const newVersion = randomUUID()

  if (USE_BLOB) {
    // Optimistic concurrency check
    if (expectedVersion !== null) {
      const currentVersion = await readCatalogVersion()
      if (currentVersion !== null && currentVersion !== expectedVersion) {
        throw new ConcurrencyError()
      }
    }

    await Promise.all([
      put(CATALOG_BLOB_PATH, content, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0, // Tell CDN: never cache this blob
      }),
      put(CATALOG_VERSION_BLOB, newVersion, {
        access: 'public',
        contentType: 'text/plain',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
      }),
    ])
    return newVersion
  }

  // Local dev
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
