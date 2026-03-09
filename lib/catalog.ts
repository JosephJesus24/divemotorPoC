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

/** Returns a hex color for display based on color name */
export function colorToHex(colorName: string): string {
  const map: Record<string, string> = {
    negro: '#1a1a1a',
    blanco: '#f5f5f5',
    gris: '#6b7280',
    plata: '#c0c0c0',
    rojo: '#dc2626',
    azul: '#2563eb',
    verde: '#16a34a',
    naranja: '#ea580c',
    amarillo: '#ca8a04',
    marron: '#92400e',
    beige: '#d4b483',
  }
  return map[colorName.toLowerCase()] ?? '#888888'
}

export { catalog }
