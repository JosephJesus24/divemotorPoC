/**
 * lib/catalog-store.ts
 *
 * Catalog persistence abstraction:
 *   - Production (BLOB_READ_WRITE_TOKEN set): stored in Vercel Blob as JSON
 *   - Development: local data/catalog.json
 *
 * On first production request, if no catalog blob exists yet,
 * falls back to the bundled data/catalog.json (committed to git).
 */

import { put, list } from '@vercel/blob'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { Catalog } from '@/types'
import { USE_BLOB } from './storage'

const CATALOG_LOCAL = join(process.cwd(), 'data', 'catalog.json')
const CATALOG_BLOB_PATH = 'catalog/catalog.json'

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function readCatalog(): Promise<Catalog> {
  if (USE_BLOB) {
    try {
      const { blobs } = await list({ prefix: 'catalog/' })
      const found = blobs.find((b) => b.pathname === CATALOG_BLOB_PATH)
      if (found) {
        // Add cache-busting to avoid Vercel CDN serving stale JSON
        const res = await fetch(`${found.url}?t=${Date.now()}`)
        if (res.ok) return (await res.json()) as Catalog
      }
    } catch (e) {
      console.warn('[catalog-store] Blob read failed, falling back to bundled:', e)
    }
  }

  // Local dev or fallback: read from bundled data/catalog.json
  const raw = await readFile(CATALOG_LOCAL, 'utf8')
  return JSON.parse(raw) as Catalog
}

// ─── Write ────────────────────────────────────────────────────────────────────

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
