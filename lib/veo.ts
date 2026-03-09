/**
 * Google Veo 3.1 API Integration
 *
 * Uses predictLongRunning to start an async video generation job,
 * then polls the operations endpoint until complete.
 * The same NANOBANANA_API_KEY used for Gemini also authenticates Veo.
 */

const VEO_API_KEY = process.env.NANOBANANA_API_KEY ?? ''
const VEO_BASE    = 'https://generativelanguage.googleapis.com/v1beta'
const VEO_MODEL   = 'veo-3.1-generate-preview'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface VeoReferenceImage {
  image: {
    bytesBase64Encoded: string                    // raw base64, no data-URI prefix
    mimeType: 'image/jpeg' | 'image/png' | 'image/webp'
  }
  referenceType: 'asset'
}

export interface VeoStartRequest {
  prompt:          string
  referenceImages: VeoReferenceImage[]            // 1–3 images
  aspectRatio?:    '16:9' | '9:16' | '1:1'
  durationSeconds?: 4 | 6 | 8
}

interface VeoVideo {
  uri?:        string   // temporary download URL (Gemini API)
  videoBytes?: string   // base64-encoded video (Gemini API)
  mimeType?:   string
}

interface VeoOperationResponse {
  name?:    string
  done?:    boolean
  // ── Gemini API format ──────────────────────────────────────────────────────
  response?: {
    // Gemini API: generatedSamples
    generatedSamples?: Array<{
      video?: VeoVideo
    }>
    // Sometimes nested one level deeper
    generateVideoResponse?: {
      generatedSamples?: Array<{
        video?: VeoVideo
      }>
    }
    // Vertex AI format (fallback)
    predictions?: Array<{
      bytesBase64Encoded?: string
      mimeType?:           string
    }>
  }
  error?: { message: string; code: number }
}

// ─── Start operation ────────────────────────────────────────────────────────────

/**
 * POSTs to predictLongRunning and returns the operation name immediately.
 * The operation typically takes 30–90 seconds to complete.
 */
export async function startVeoGeneration(
  req: VeoStartRequest,
): Promise<{ operationName: string }> {
  if (!VEO_API_KEY) {
    throw new Error(
      'NANOBANANA_API_KEY no está configurada. Agrégala en .env.local',
    )
  }

  const url = `${VEO_BASE}/models/${VEO_MODEL}:predictLongRunning?key=${VEO_API_KEY}`

  const body = {
    instances: [
      {
        prompt:          req.prompt,
        referenceImages: req.referenceImages,
      },
    ],
    parameters: {
      aspectRatio:     req.aspectRatio     ?? '16:9',
      durationSeconds: req.durationSeconds ?? 8,
      sampleCount:     1,
    },
  }

  const res  = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })

  const data: VeoOperationResponse = await res.json()

  if (!res.ok || data.error) {
    throw new Error(
      `Veo API error al iniciar: ${data.error?.message ?? `HTTP ${res.status}`}`,
    )
  }

  if (!data.name) {
    throw new Error('Veo no devolvió un nombre de operación')
  }

  return { operationName: data.name }
}

// ─── Poll operation ─────────────────────────────────────────────────────────────

/**
 * GETs the current status of a long-running operation.
 * Returns done:true + base64 video when the job is finished.
 */
export async function pollVeoOperation(
  operationName: string,
): Promise<{
  done:         boolean
  videoBase64?: string
  mimeType?:    string
}> {
  if (!VEO_API_KEY) {
    throw new Error('NANOBANANA_API_KEY no está configurada')
  }

  // operationName is like "operations/abc123" — append directly after base URL
  const url = `${VEO_BASE}/${operationName}?key=${VEO_API_KEY}`

  const res  = await fetch(url, { method: 'GET' })
  const data: VeoOperationResponse = await res.json()

  if (!res.ok || data.error) {
    throw new Error(
      `Veo API error al consultar: ${data.error?.message ?? `HTTP ${res.status}`}`,
    )
  }

  if (!data.done) {
    return { done: false }
  }

  // ── Log full response for debugging ────────────────────────────────────────
  console.log('[veo] done:true — raw response:', JSON.stringify(data.response, null, 2))

  // ── Extract video from all possible response shapes ────────────────────────
  // Priority: Gemini API generatedSamples → nested generateVideoResponse → Vertex AI predictions
  const video: VeoVideo | undefined =
    data.response?.generatedSamples?.[0]?.video ??
    data.response?.generateVideoResponse?.generatedSamples?.[0]?.video ??
    undefined

  const vertexPrediction = data.response?.predictions?.[0]

  // Case 1: videoBytes (base64 already)
  if (video?.videoBytes) {
    return {
      done:        true,
      videoBase64: video.videoBytes,
      mimeType:    video.mimeType ?? 'video/mp4',
    }
  }

  // Case 2: uri — download the video and convert to base64
  // The URI is a Gemini Files API endpoint that requires the API key to authenticate
  if (video?.uri) {
    console.log('[veo] Downloading video from URI:', video.uri)
    const downloadUrl = video.uri.includes('?')
      ? `${video.uri}&key=${VEO_API_KEY}`
      : `${video.uri}?key=${VEO_API_KEY}`
    const videoRes = await fetch(downloadUrl)
    if (!videoRes.ok) {
      throw new Error(`No se pudo descargar el video desde la URI: HTTP ${videoRes.status}`)
    }
    const arrayBuffer = await videoRes.arrayBuffer()
    const videoBase64 = Buffer.from(arrayBuffer).toString('base64')
    return {
      done:        true,
      videoBase64,
      mimeType:    video.mimeType ?? 'video/mp4',
    }
  }

  // Case 3: Vertex AI format fallback
  if (vertexPrediction?.bytesBase64Encoded) {
    return {
      done:        true,
      videoBase64: vertexPrediction.bytesBase64Encoded,
      mimeType:    vertexPrediction.mimeType ?? 'video/mp4',
    }
  }

  // None found — throw with the actual response so we can debug
  throw new Error(
    `Veo indicó done:true pero no se encontró el video. Estructura recibida: ${JSON.stringify(Object.keys(data.response ?? {}))}`
  )
}
