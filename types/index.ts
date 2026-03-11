// ─── Vehicle Catalog Types ────────────────────────────────────────────────────

export type ImageView = 'front' | 'side' | 'rear' | 'interior' | 'detail' | '360'

export interface VehicleImage {
  id: string
  type?: 'image' | 'video'    // default: 'image'
  view: ImageView
  color: string
  year?: number
  date: string
  url: string
  isGenerated?: boolean
  generatedFrom?: string // source image id
}

export interface VehicleVariant {
  id: string
  name: string
  year: number
  colors: string[]
  images: VehicleImage[]
  description?: string
  price?: string
}

export interface VehicleModel {
  id: string
  name: string
  brand: string
  coverImage: string
  description?: string
  variants: VehicleVariant[]
}

export interface Catalog {
  models: VehicleModel[]
}

// ─── AI Generation Types ──────────────────────────────────────────────────────

export interface ColorOption {
  id: string
  label: string
  hex: string
  prompt: string             // Color name for the prompt
  finishDescription?: string // Full paint finish spec → sent verbatim to the AI
}

export interface GenerationRequest {
  imageUrl: string
  colors: ColorOption[]
  variantId: string
  modelId: string
}

export interface GenerationResult {
  colorId: string
  colorLabel: string
  hex: string
  imageUrl: string
  status: 'pending' | 'generating' | 'done' | 'error'
  error?: string
}

// ─── Upload Types ─────────────────────────────────────────────────────────────

export interface UploadResponse {
  success: boolean
  imageUrl: string
  imageId: string
  error?: string
}

export interface GenerateColorResponse {
  success: boolean
  results: GenerationResult[]
  error?: string
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface GalleryFilters {
  color: string | null
  view: ImageView | null
  dateFrom: string | null
  dateTo: string | null
}

// ─── Video Generation Types (Veo 3.1) ─────────────────────────────────────────

export type VideoGenerationPhase =
  | 'idle'
  | 'starting'
  | 'polling'
  | 'saving'
  | 'done'
  | 'error'

export interface VideoGenerationStatus {
  phase:          VideoGenerationPhase
  operationName:  string | null   // e.g. "operations/abc123"
  videoUrl:       string | null   // /generated/veo_*.mp4 when done
  elapsedSeconds: number
  error:          string | null
}

export interface VeoStartResponse {
  success:       boolean
  operationName?: string
  error?:         string
}

export interface VeoPollResponse {
  success:  boolean
  done:     boolean
  videoUrl?: string   // set only when done === true
  error?:   string
}
