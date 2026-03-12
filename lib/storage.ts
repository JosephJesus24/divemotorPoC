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
 */
export async function readFileBuffer(url: string): Promise<Buffer> {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`)
    return Buffer.from(await res.arrayBuffer())
  }
  // Relative path — read from /public/
  const localPath = join(process.cwd(), 'public', url.replace(/^\//, ''))
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
