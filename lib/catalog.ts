import type { Catalog, VehicleModel, VehicleVariant } from '@/types'
import catalogData from '@/data/catalog.json'

const catalog = catalogData as Catalog

// ─── Model Queries ────────────────────────────────────────────────────────────

export function getAllModels(): VehicleModel[] {
  return catalog.models
}

export function getModelById(id: string): VehicleModel | undefined {
  return catalog.models.find((m) => m.id === id)
}

export function getVariantById(
  modelId: string,
  variantId: string
): VehicleVariant | undefined {
  const model = getModelById(modelId)
  return model?.variants.find((v) => v.id === variantId)
}

// ─── Brand Helpers ────────────────────────────────────────────────────────────

export const BRANDS = [
  { id: 'jeep',          name: 'Jeep',          active: true  },
  { id: 'mercedes-benz', name: 'Mercedes-Benz', active: true  },
  { id: 'dodge',         name: 'Dodge',         active: false },
  { id: 'ram',           name: 'RAM',           active: false },
  { id: 'fiat',          name: 'FIAT',          active: false },
] as const

export function getBrandById(id: string) {
  return BRANDS.find((b) => b.id === id)
}

// Precomputed brand → models map (built once at module load, O(1) lookups)
const _modelsByBrand = new Map<string, VehicleModel[]>()
for (const m of catalog.models) {
  const key = m.brand.toLowerCase()
  const list = _modelsByBrand.get(key) ?? []
  list.push(m)
  _modelsByBrand.set(key, list)
}

export function getModelsByBrand(brandName: string): VehicleModel[] {
  return _modelsByBrand.get(brandName.toLowerCase()) ?? []
}

// ─── Color Helpers ────────────────────────────────────────────────────────────

/** All unique colors available across all models */
export function getAllColors(): string[] {
  const colors = new Set<string>()
  for (const model of catalog.models) {
    for (const variant of model.variants) {
      for (const color of variant.colors) {
        colors.add(color)
      }
    }
  }
  return Array.from(colors).sort()
}

/** Predefined color options for uploads and filters */
export const PREDEFINED_COLORS: { value: string; hex: string }[] = [
  { value: 'negro',    hex: '#1a1a1a' },
  { value: 'blanco',   hex: '#f5f5f5' },
  { value: 'gris',     hex: '#6b7280' },
  { value: 'plata',    hex: '#c0c0c0' },
  { value: 'rojo',     hex: '#dc2626' },
  { value: 'azul',     hex: '#2563eb' },
  { value: 'verde',    hex: '#16a34a' },
  { value: 'naranja',  hex: '#ea580c' },
  { value: 'amarillo', hex: '#ca8a04' },
  { value: 'marron',   hex: '#92400e' },
  { value: 'beige',    hex: '#d4b483' },
]

// Single lookup map for all known colors (Spanish + generated English names)
const _colorHexMap: Record<string, string> = {
  ...Object.fromEntries(PREDEFINED_COLORS.map(c => [c.value, c.hex])),
  'baltic gray metallic':     '#8c9aab',
  'diamond black crystal':    '#1a1a2e',
  'granite crystal metallic': '#6b6b6b',
}

/** Returns a hex color for display based on color name */
export function colorToHex(colorName: string): string {
  return _colorHexMap[colorName.toLowerCase()] ?? '#888888'
}

export { catalog }
