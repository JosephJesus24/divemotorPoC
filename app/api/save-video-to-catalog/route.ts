import { NextRequest, NextResponse } from 'next/server'
import { saveFile, readFileBuffer, deleteFile } from '@/lib/storage'
import { withCatalogUpdate } from '@/lib/catalog-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoUrl, modelId, variantId } = body as {
      videoUrl:  string
      modelId:   string
      variantId: string
    }

    if (!videoUrl || !modelId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros: videoUrl, modelId, variantId' },
        { status: 400 },
      )
    }

    // Solo manejar videos de /generated/
    if (!videoUrl.startsWith('/generated/')) {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden guardar videos desde /generated/' },
        { status: 400 },
      )
    }

    // ── Copy video to images/ folder ──────────────────────────────────────────
    const buffer   = await readFileBuffer(videoUrl)
    const filename = videoUrl.split('/').pop() ?? 'video.mp4'
    const savedUrl = await saveFile(
      'images/' + modelId + '/' + variantId + '/' + filename,
      buffer,
      'video/mp4',
    )

    // ── Update catalog (with concurrency protection) ────────────────────────
    const newId = `video_${modelId}_${variantId}_${Date.now().toString(36)}`
    const today = new Date().toISOString().split('T')[0]

    const newEntry = {
      id:          newId,
      type:        'video' as const,
      view:        '360' as const,
      color:       'sin color',
      date:        today,
      url:         savedUrl,
      isGenerated: true,
    }

    await withCatalogUpdate((catalog) => {
      const model   = catalog.models.find((m) => m.id === modelId)
      const variant = model?.variants?.find((v) => v.id === variantId)

      if (!variant) return catalog

      variant.images = [newEntry, ...(variant.images ?? [])]
      return catalog
    })

    // ── Clean up the generated source file (best-effort) ────────────────────
    try {
      await deleteFile(videoUrl)
    } catch (e) {
      console.warn('[save-video-to-catalog] Generated cleanup failed (non-critical):', e)
    }

    console.log(`[save-video-to-catalog] Guardado: ${savedUrl}`)
    return NextResponse.json({ success: true, savedUrl, savedId: newId })

  } catch (err) {
    console.error('[save-video-to-catalog] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
