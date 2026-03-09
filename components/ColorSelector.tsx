'use client'

import { Check } from 'lucide-react'
import type { ColorOption } from '@/types'

interface ColorOptionWithVariant extends ColorOption {
  isVariantColor?: boolean
}

interface Props {
  colors: ColorOptionWithVariant[]
  selected: ColorOption[]
  onSelectionChange: (colors: ColorOption[]) => void
  max?: number
}

export function ColorSelector({ colors, selected, onSelectionChange, max = 5 }: Props) {
  const selectedIds = new Set(selected.map((c) => c.id))

  const toggle = (color: ColorOption) => {
    if (selectedIds.has(color.id)) {
      onSelectionChange(selected.filter((c) => c.id !== color.id))
    } else if (selected.length < max) {
      onSelectionChange([...selected, color])
    }
  }

  return (
    <div className="space-y-4">
      {/* Selected summary */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((color) => (
            <button
              key={color.id}
              onClick={() => toggle(color)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-accent/30 bg-accent/5 text-xs text-accent hover:bg-accent/10 transition-colors"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/20"
                style={{ backgroundColor: color.hex }}
              />
              {color.label}
              <span className="text-accent/50">×</span>
            </button>
          ))}
        </div>
      )}

      {/* Color grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {colors.map((color) => {
          const isSelected = selectedIds.has(color.id)
          const isDisabled = !isSelected && selected.length >= max

          return (
            <button
              key={color.id}
              onClick={() => toggle(color)}
              disabled={isDisabled}
              title={color.label}
              className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'border-accent bg-accent/10'
                  : isDisabled
                  ? 'border-border bg-bg-secondary opacity-40 cursor-not-allowed'
                  : 'border-border bg-bg-secondary hover:border-border-light hover:bg-bg-hover cursor-pointer'
              }`}
            >
              {/* Swatch */}
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-full border-2 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: isSelected ? '#e8a020' : 'rgba(255,255,255,0.1)',
                  }}
                />
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check
                      size={14}
                      className={
                        color.hex === '#f5f5f5' ? 'text-zinc-800' : 'text-white'
                      }
                    />
                  </div>
                )}
                {color.isVariantColor && !isSelected && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border border-bg-primary" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium leading-none text-center transition-colors ${
                  isSelected ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'
                }`}
              >
                {color.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Limit warning */}
      <p className="text-xs text-text-muted text-center">
        {selected.length}/{max} colores seleccionados
        {selected.length >= max && (
          <span className="text-amber-500"> · Límite alcanzado</span>
        )}
      </p>
    </div>
  )
}
