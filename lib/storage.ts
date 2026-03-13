/**
 * lib/storage.ts
 *
 * File storage abstraction:
 *   - Production (BLOB_READ_WRITE_TOKEN set): Vercel Blob
 *   - Development (no token): local /public filesystem
 *
 * This lets every API route stay identical in dev and prod.
 */

import { put, del } from '@vercel/blob'
import { writeFile, readFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

export const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

// ─── Validation ───────────────────────────────────────────────────────────────

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4'])
const VALID_PREFIXES = ['uploads/', 'generated/', 'images/', 'catalog/']

/** Validates a blob path against traversal attacks and extension allowlist. */
export function validateBlobPath(blobPath: string): void {
  if (blobPath.includes('..') || blobPath.startsWith('/') || blobPath.includes('\\')) {
    throw new Error('Invalid path: traversal not allowed')
  }
  const ext = blobPath.split('.').pop()?.toLowerCase()
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`Invalid file type: .${ext}`)
  }
  if (!VALID_PREFIXES.some((p) => blobPath.startsWith(p))) {
    throw new Error(`Invalid path prefix: ${blobPath}`)
  }
}

/** Normalizes a URL for consistent frontend consumption. */
export function normalizeImageUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return url.startsWith('/') ? url : `/${url}`
}

// ─── Save a file ──────────────────────────────────────────────────────────────

/**
 * Saves data to storage.
 * @param blobPath  Relative path used as the Blob key, e.g. 'uploads/photo.jpg'
 *                  In dev, the file is written to /public/{blobPath}
 * @param data      File content as Buffer
 * @param contentType  MIME type
 * @returns Public URL:
 *   - Prod: full https://... Blob URL
 *   - Dev:  relative /uploads/photo.jpg
 */
export async function saveFile(
  blobPath:    string,
  data:        Buffer,
  contentType: string,
): Promise<string> {
  validateBlobPath(blobPath)

  if (USE_BLOB) {
    const blob = await put(blobPath, data, {
      access:           'public',
      contentType,
      addRandomSuffix:  true,   // always unique — prevents blob already exists error
    })
    return blob.url
  }

  // Local dev — write to /public/
  const localPath = join(process.cwd(), 'public', blobPath)
  const dir       = localPath.substring(0, Math.max(localPath.lastIndexOf('/'), localPath.lastIndexOf('\\')))
  if (!existsSync(dir)) await mkdir(dir, { recursive: true })
  await writeFile(localPath, data)
  return `/${blobPath}`
}

// ─── Read a file ──────────────────────────────────────────────────────────────

/**
 * Reads a file as Buffer. Handles both relative paths (/images/...) and
 * full https:// URLs (Vercel Blob URLs).
 * Retries HTTPS fetches up to 3 times with backoff for Blob replication delays.
 */
export async function readFileBuffer(url: string): Promise<Buffer> {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const maxRetries = 3
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const cacheBustedUrl = `${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`
        const res = await fetch(cacheBustedUrl, { cache: 'no-store' })
        if (res.ok) return Buffer.from(await res.arrayBuffer())
        if (attempt < maxRetries - 1) {
          console.warn(`[storage] Blob fetch ${res.status}, retry ${attempt + 1}/${maxRetries}: ${url}`)
          await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
          continue
        }
        throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`)
      } catch (err) {
        if (attempt < maxRetries - 1) {
          console.warn(`[storage] Blob fetch error, retry ${attempt + 1}/${maxRetries}:`, err)
          await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
          continue
        }
        throw err
      }
    }
    throw new Error(`Failed to fetch ${url} after ${maxRetries} retries`)
  }
  // Relative path — read from /public/
  const cleaned = url.replace(/^\//, '')
  if (cleaned.includes('..') || cleaned.includes('\\')) {
    throw new Error('Invalid path: traversal not allowed')
  }
  const localPath = join(process.cwd(), 'public', cleaned)
  if (existsSync(localPath)) return readFile(localPath)
  throw new Error(`File not found: ${url}`)
}

// ─── Delete a file ────────────────────────────────────────────────────────────

/**
 * Deletes a file from storage (best-effort, never throws).
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    if (USE_BLOB && (url.startsWith('http://') || url.startsWith('https://'))) {
      await del(url)
      return
    }
    // Local: only delete uploads / generated (not original catalog images)
    if (url.startsWith('/uploads/') || url.startsWith('/generated/')) {
      const localPath = join(process.cwd(), 'public', url)
      if (existsSync(localPath)) await unlink(localPath)
    }
  } catch (e) {
    console.warn('[storage] deleteFile failed (non-critical):', e)
  }
}
