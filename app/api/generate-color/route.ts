import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { generateColorVariant, buildColorPrompt } from '@/lib/nanobanana'
import { saveFile, readFileBuffer } from '@/lib/storage'
import type { ColorOption, GenerationResult } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120 // 2 min timeout for AI generation

// ─── Demo mode ────────────────────────────────────────────────────────────────
// When NANOBANANA_API_KEY is not set, the API applies a CSS color tint
// over the original image using sharp (if available) or returns a demo SVG.
// Set NANOBANANA_API_KEY in .env.local to activate real AI generation.
const DEMO_MODE = !process.env.NANOBANANA_API_KEY || process.env.NANOBANANA_API_KEY === 'your_api_key_here'

/**
 * Generates a demo "color variant" by overlaying a semi-transparent color
 * on top of the source image and saving it as a new file.
 * This simulates what the real NanoBanana API would return.
 */
async function generateDemoVariant(
  sourceImageBuffer: Buffer,
  sourceImageUrl: string,
  color: ColorOption,
  modelId: string,
  variantId: string
): Promise<string> {
  const base64 = sourceImageBuffer.toString('base64')
  const ext = sourceImageUrl.split('.').pop()?.toLowerCase() ?? 'jpg'
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'

  // Build an SVG that wraps the original image + applies a color overlay
  // This is a pure JS/SVG approach — no extra dependencies needed
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800" height="500">
  <!-- Original vehicle image -->
  <image href="data:${mimeType};base64,${base64}" x="0" y="0" width="800" height="500" preserveAspectRatio="xMidYMid meet"/>
  <!-- Color overlay at 35% opacity to simulate paint color change -->
  <rect x="0" y="0" width="800" height="500" fill="${color.hex}" opacity="0.35"/>
  <!-- Demo watermark -->
  <rect x="0" y="460" width="800" height="40" fill="rgba(0,0,0,0.6)"/>
  <text x="400" y="484" text-anchor="middle" fill="#e8a020" font-family="system-ui" font-size="13" font-weight="600">
    DEMO — ${color.label.toUpperCase()} · Conecta NanoBanana para resultados reales
  </text>
</svg>`

  const filename = `demo_${modelId}_${variantId}_${color.id}_${randomUUID().slice(0, 8)}.svg`
  const url = await saveFile('generated/' + filename, Buffer.from(svgContent), 'image/svg+xml')
  return url
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, colors, modelId, variantId } = body as {
      imageUrl: string
      colors: ColorOption[]
      modelId: string
      variantId: string
    }

    // ── Validation ────────────────────────────────────────────────────────────
    if (!imageUrl || !colors?.length) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos: imageUrl y colors son requeridos' },
        { status: 400 }
      )
    }

    if (colors.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Máximo 5 colores por solicitud' },
        { status: 400 }
      )
    }

    // ── Verify source image is accessible ────────────────────────────────────
    let sourceImageBuffer: Buffer
    try {
      sourceImageBuffer = await readFileBuffer(imageUrl)
    } catch {
      return NextResponse.json(
        { success: false, error: `Imagen no encontrada: ${imageUrl}` },
        { status: 404 }
      )
    }

    // ── Generate each color variant ───────────────────────────────────────────
    const results: GenerationResult[] = []

    for (const color of colors) {
      try {
        let resultImageUrl: string

        if (DEMO_MODE) {
          // ── DEMO: overlay color tint on original image ──────────────────────
          console.log(`[generate-color] DEMO mode — generating tint for color: ${color.label}`)
          resultImageUrl = await generateDemoVariant(
            sourceImageBuffer,
            imageUrl,
            color,
            modelId,
            variantId
          )
        } else {
          // ── REAL: call Google Gemini API ────────────────────────────────────
          const imageBuffer = await readFileBuffer(imageUrl)
          const imageBase64 = imageBuffer.toString('base64')

          // Detect source image MIME type from extension
          const srcExt = imageUrl.split('.').pop()?.toLowerCase() ?? 'jpg'
          const mimeType = srcExt === 'png' ? 'image/png' : 'image/jpeg'

          const prompt = buildColorPrompt(color.label, color.hex, color.finishDescription)

          const geminiResponse = await generateColorVariant({
            imageBase64,
            prompt,
            targetColor: color.label,
            colorHex: color.hex,
            mimeType,
          })

          if (!geminiResponse.success) {
            throw new Error(geminiResponse.error ?? 'Gemini no devolvió resultado')
          }

          if (geminiResponse.imageBase64) {
            // Determine file extension from response MIME type
            const outMime = geminiResponse.mimeType ?? 'image/jpeg'
            const outExt = outMime.includes('png') ? 'png' : 'jpg'
            const filename = `gen_${modelId}_${variantId}_${color.id}_${randomUUID().slice(0, 8)}.${outExt}`
            resultImageUrl = await saveFile(
              'generated/' + filename,
              Buffer.from(geminiResponse.imageBase64, 'base64'),
              outMime
            )
          } else if (geminiResponse.imageUrl) {
            resultImageUrl = geminiResponse.imageUrl
          } else {
            throw new Error('Gemini no devolvió una imagen')
          }
        }

        results.push({
          colorId: color.id,
          colorLabel: color.label,
          hex: color.hex,
          imageUrl: resultImageUrl,
          status: 'done',
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        console.error(`[generate-color] Error for color ${color.id}:`, errorMessage)
        results.push({
          colorId: color.id,
          colorLabel: color.label,
          hex: color.hex,
          imageUrl: '',
          status: 'error',
          error: errorMessage,
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      demo: DEMO_MODE,
      total: results.length,
      successful: results.filter((r) => r.status === 'done').length,
    })
  } catch (err) {
    console.error('[generate-color] Unhandled error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Error interno del servidor',
        results: [],
      },
      { status: 500 }
    )
  }
}
