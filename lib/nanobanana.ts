/**
 * Google Gemini API Integration — NanoBanana Pro
 *
 * Usa el modelo gemini-3-pro-image-preview (NanoBanana Pro) para generar
 * variantes de color de vehículos en 4K con máxima calidad fotorrealista.
 * La API key se configura en .env.local → NANOBANANA_API_KEY
 * La URL base se configura en .env.local → NANOBANANA_API_URL
 */

// ─── Configuration ────────────────────────────────────────────────────────────

const GEMINI_API_URL =
  process.env.NANOBANANA_API_URL ??
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent'

const GEMINI_API_KEY = process.env.NANOBANANA_API_KEY ?? ''

// ─── Prompt Builder ───────────────────────────────────────────────────────────

/**
 * Converts a hex color string to HSL components.
 * HSL gives the model an unambiguous hue angle (0–360°) that avoids
 * ambiguity between shades like "orange-red" vs "crimson" vs "dark red".
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

/**
 * Builds the Gemini prompt for vehicle color repainting.
 * Provides HEX + RGB + HSL + manufacturer finish description so the model
 * has zero ambiguity about the exact shade AND finish every single time.
 *
 * @param targetColor        Official color name (e.g. "Granite Crystal Metallic")
 * @param colorHex           Exact hex code (e.g. "#2F3134")
 * @param finishDescription  Full paint spec from the manufacturer — sent verbatim to AI
 */
export function buildColorPrompt(
  targetColor: string,
  colorHex: string,
  finishDescription?: string
): string {
  const r = parseInt(colorHex.slice(1, 3), 16)
  const g = parseInt(colorHex.slice(3, 5), 16)
  const b = parseInt(colorHex.slice(5, 7), 16)
  const { h, s, l } = hexToHsl(colorHex)

  // Split finish description into individual bullet rules
  const finishRules = finishDescription
    ? finishDescription
        .split(/[.\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => `  - ${s}`)
        .join('\n')
    : '  - Standard automotive high-gloss paint finish'

  return [
    `You are a photorealistic automotive paint editor.`,
    `Your ONLY task: repaint the exterior body panels of the vehicle.`,
    ``,
    `━━━ TARGET PAINT COLOR — HARD CONSTRAINT, NOT A SUGGESTION ━━━`,
    `  Manufacturer color name : ${targetColor}`,
    `  Hex (exact, immutable)  : ${colorHex}`,
    `  RGB (exact, immutable)  : rgb(${r}, ${g}, ${b})`,
    `  HSL (exact, immutable)  : hsl(${h}deg, ${s}%, ${l}%)`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `COLOR CONSISTENCY RULES (critical):`,
    `  - The output color MUST match hex ${colorHex} exactly — same hue H=${h}°, same saturation S=${s}%, same lightness L=${l}%`,
    `  - This color must look IDENTICAL regardless of the source vehicle color`,
    `  - IGNORE the original paint color completely — replace it 100%`,
    `  - Do NOT drift toward adjacent hues, do NOT lighten or darken`,
    `  - Every body panel must show the exact same color tone — no variation between panels`,
    `  - If you generate this color 100 times, all 100 results must be the same shade`,
    ``,
    `PAINT FINISH SPECIFICATION (follow exactly):`,
    finishRules,
    ``,
    `WHAT TO CHANGE:`,
    `  - All exterior body panels: replace paint with exactly ${colorHex}`,
    ``,
    `WHAT MUST NEVER CHANGE:`,
    `  - Vehicle geometry, shape, proportions — 100% identical`,
    `  - Camera angle, perspective, focal length — 100% identical`,
    `  - Wheels, tires, window glass, chrome trim, interior — 100% identical`,
    `  - Badges, logos, emblems, accessories — 100% identical`,
    `  - Lighting direction, shadow positions — 100% identical`,
    `  - Background, floor, reflections on the floor — 100% identical`,
    ``,
    `OUTPUT: A single photorealistic image of the same vehicle with body color ${colorHex}.`,
    `The color must be indistinguishable from a real factory paint job.`,
  ].join('\n')
}

/**
 * Returns a deterministic integer seed for a given color hex.
 * The same color always produces the same seed → more consistent outputs.
 */
export function colorHexToSeed(colorHex: string): number {
  // Use the numeric value of the hex triplet as a stable seed (fits in 24 bits)
  return parseInt(colorHex.replace('#', ''), 16)
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NanoBananaGenerateRequest {
  imageBase64: string     // Base64-encoded source image (JPEG or PNG)
  prompt: string          // Generation instructions
  targetColor: string     // Color name (e.g. "rojo")
  colorHex: string        // Hex code (e.g. "#dc2626")
  mimeType?: string       // Image MIME type (default: "image/jpeg")
}

export interface NanoBananaGenerateResponse {
  success: boolean
  imageBase64?: string    // Base64-encoded result image
  imageUrl?: string       // URL to result (if API returns URL instead of base64)
  mimeType?: string       // MIME type of result image
  error?: string
}

// ─── Gemini API Request/Response types ───────────────────────────────────────

interface GeminiPart {
  text?: string
  inlineData?: {
    mimeType: string
    data: string
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[]
    }
  }>
  error?: {
    message: string
    code: number
  }
}

// ─── Core API Call ────────────────────────────────────────────────────────────

/**
 * Sends an image to Google Gemini and requests a color variant.
 * Uses the generateContent endpoint with multimodal input (image + text prompt).
 */
export async function generateColorVariant(
  request: NanoBananaGenerateRequest
): Promise<NanoBananaGenerateResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'NANOBANANA_API_KEY no está configurada. Agrégala en .env.local'
    )
  }

  // Gemini API key goes as a query parameter
  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`
  const imageMimeType = request.mimeType ?? 'image/jpeg'

  // Deterministic seed per color: same color hex → same seed → more consistent output
  const seed = colorHexToSeed(request.colorHex)

  // Gemini multimodal request: text prompt + image
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: request.prompt,
          },
          {
            inlineData: {
              mimeType: imageMimeType,
              data: request.imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      // IMAGE (uppercase) required for Gemini image-generation models
      responseModalities: ['IMAGE', 'TEXT'],
      // Fixed seed per color → reduces variation between consecutive generations
      seed,
    },
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const data: GeminiResponse = await response.json()

  // Check for API-level errors
  if (!response.ok || data.error) {
    const msg = data.error?.message ?? `HTTP ${response.status}`
    throw new Error(`Gemini API error: ${msg}`)
  }

  // Extract the generated image from the response
  const parts = data.candidates?.[0]?.content?.parts ?? []

  // Find the image part in the response
  const imagePart = parts.find((p) => p.inlineData?.data)

  if (!imagePart?.inlineData?.data) {
    // If no image in response, Gemini might have returned only text
    const textPart = parts.find((p) => p.text)
    throw new Error(
      `Gemini no devolvió una imagen. Respuesta: ${textPart?.text ?? 'vacía'}`
    )
  }

  return {
    success: true,
    imageBase64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType ?? 'image/jpeg',
  }
}

// ─── Batch Generation ─────────────────────────────────────────────────────────

export interface ColorGenerationTask {
  colorId: string
  colorLabel: string
  colorHex: string
}

/**
 * Generates multiple color variants for a single image (sequentially to avoid rate limits).
 */
export async function generateMultipleColors(
  imageBase64: string,
  colors: ColorGenerationTask[]
): Promise<Array<{ colorId: string; result: NanoBananaGenerateResponse }>> {
  const results = []

  for (const color of colors) {
    const prompt = buildColorPrompt(color.colorLabel, color.colorHex)
    try {
      const result = await generateColorVariant({
        imageBase64,
        prompt,
        targetColor: color.colorLabel,
        colorHex: color.colorHex,
      })
      results.push({ colorId: color.colorId, result })
    } catch (err) {
      results.push({
        colorId: color.colorId,
        result: {
          success: false,
          error: err instanceof Error ? err.message : 'Error desconocido',
        },
      })
    }
  }

  return results
}
