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

// Single lookup map for all known colors (Spanish + manufacturer color names)
const _colorHexMap: Record<string, string> = {
  ...Object.fromEntries(PREDEFINED_COLORS.map(c => [c.value, c.hex])),

  // Generic English names
  'black':                    '#0a0a0a',
  'white':                    '#f2f2f0',
  'baltic gray metallic':     '#8c9aab',
  'diamond black crystal':    '#1a1a2e',
  'granite crystal metallic': '#4a4d50',

  // Jeep Commander colors (Portuguese/Brazilian names)
  'preto carbon':             '#000000',
  'cinza granite':            '#5b5b58',
  'cinza granite bicolor':    '#5b5b58',
  'azul jazz':                '#11264b',
  'azul jazz bicolor':        '#11264b',
  'prata billet':             '#868b8d',
  'prata billet bicolor':     '#868b8d',
  'slash gold bicolor':       '#bcafa9',
  'branco polar':             '#f4f4f4',
  'branco polar bicolor':     '#f4f4f4',

  // Jeep Renegade / Wrangler / Grand Cherokee colors
  'sting gray':               '#7d818a',
  'cinza sting bicolor':      '#7d818a',
  'sting gray bicolor':       '#7d818a',
  'bright white':             '#f2f2f0',
  'firecracker red':          '#d6201e',
  'hydro blue pearl-coat':    '#1e5faf',
  'gobi':                     '#6f643f',
  'earl':                     '#6f7f84',
  'sarge green':              '#66b70e',
  'purple reign pearl-coat':  '#5c2e91',

  // Mercedes-Benz colors
  'spektralblau metallic':    '#4d85b2',
  'dolomitgrau metallic':     '#8c8f90',
  'patagoniared metallic':    '#cb6067',
  'nachtschwarz':             '#585b5a',
  'mountaingrau':             '#a6a8a8',
  'blau metallic (888)':      '#51a9bd',
  'hightechsilber metallic':  '#d3d8dd',
  'calcitgelb metallic':      '#535456',
  'mojavesilber metallic':    '#cacacb',
  'silber metallic (188)':    '#9baeaf',
  'brillantsilber metallic':  '#e3e4e6',
  'selenitgrau metallic':     '#737574',
  'obsidianschwarz metallic': '#555555',
  'graphitgrau metallic':     '#565656',
  'selenitgrau 2':            '#404241',
  'iridiumsilber metallic':   '#a1a5a6',
}

/** Returns a hex color for display based on color name */
export function colorToHex(colorName: string): string {
  return _colorHexMap[colorName.toLowerCase()] ?? '#888888'
}

export { catalog }
