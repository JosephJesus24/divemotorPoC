import { NextRequest, NextResponse } from 'next/server'
import { readFileBuffer } from '@/lib/storage'
import { startVeoGeneration } from '@/lib/veo'
import type { VeoReferenceImage } from '@/lib/veo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// This route returns quickly (<5s) — it only starts the Veo operation.
// The 30–90s generation happens server-side at Google; client polls /status.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      imageUrls,       // string[] — up to 3 public-relative URLs (/images/..., /uploads/...)
      prompt,          // string
      durationSeconds, // 4 | 6 | 8
    } = body as {
      imageUrls:       string[]
      prompt:          string
      durationSeconds: 4 | 6 | 8
    }

    // ── Validation ────────────────────────────────────────────────────────────
    if (!imageUrls?.length || imageUrls.length > 3) {
      return NextResponse.json(
        { success: false, error: 'Debes seleccionar entre 1 y 3 imágenes de referencia' },
        { status: 400 },
      )
    }
    if (!prompt?.trim()) {
      return NextResponse.json(
        { success: false, error: 'El prompt no puede estar vacío' },
        { status: 400 },
      )
    }

    // ── Encode each reference image as base64 ─────────────────────────────────
    const referenceImages: VeoReferenceImage[] = []

    for (const imageUrl of imageUrls) {
      // imageUrl is public-relative: /images/renegade/sport/file.jpg
      const buffer = await readFileBuffer(imageUrl)
      const base64 = buffer.toString('base64')

      const ext = imageUrl.split('.').pop()?.toLowerCase() ?? 'jpg'
      const mimeType: VeoReferenceImage['image']['mimeType'] =
        ext === 'png'  ? 'image/png'  :
        ext === 'webp' ? 'image/webp' :
        'image/jpeg'

      referenceImages.push({
        image: { bytesBase64Encoded: base64, mimeType },
        referenceType: 'asset',
      })
    }

    // ── Start the Veo operation ───────────────────────────────────────────────
    const { operationName } = await startVeoGeneration({
      prompt,
      referenceImages,
      aspectRatio:     '16:9',
      durationSeconds: durationSeconds ?? 8,
    })

    return NextResponse.json({ success: true, operationName })

  } catch (err) {
    console.error('[generate-video] Error:', err)
    return NextResponse.json(
      {
        success: false,
        error:   err instanceof Error ? err.message : 'Error interno del servidor',
      },
      { status: 500 },
    )
  }
}
