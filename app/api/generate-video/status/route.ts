import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { pollVeoOperation } from '@/lib/veo'
import { saveFile } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const operationName = searchParams.get('operationName')
    const modelId       = searchParams.get('modelId')   ?? 'vehicle'
    const variantId     = searchParams.get('variantId') ?? 'variant'

    if (!operationName) {
      return NextResponse.json(
        { success: false, error: 'Falta el parámetro operationName' },
        { status: 400 },
      )
    }

    const result = await pollVeoOperation(operationName)

    if (!result.done) {
      return NextResponse.json({ success: true, done: false })
    }

    const filename = `veo_${modelId}_${variantId}_${randomUUID().slice(0, 8)}.mp4`
    const videoUrl = await saveFile(
      `generated/${filename}`,
      Buffer.from(result.videoBase64!, 'base64'),
      'video/mp4',
    )

    return NextResponse.json({ success: true, done: true, videoUrl })

  } catch (err) {
    console.error('[generate-video/status] Error:', err)
    return NextResponse.json(
      { success: false, done: false, error: err instanceof Error ? err.message : 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
