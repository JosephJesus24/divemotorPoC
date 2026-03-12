'use client'

import { Check } from 'lucide-react'
import type { ColorOption } from '@/types'

interface ColorOptionWithVariant extends ColorOption {
  isVariantColor?: boolean
  isOriginalColor?: boolean
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
          const isOriginal = color.isOriginalColor === true
          const isSelected = selectedIds.has(color.id)
          const isDisabled = isOriginal || (!isSelected && selected.length >= max)

          return (
            <button
              key={color.id}
              onClick={() => !isOriginal && toggle(color)}
              disabled={isDisabled}
              title={isOriginal ? `${color.label} (color original)` : color.label}
              className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                isOriginal
                  ? 'border-amber-500/20 bg-amber-500/5 opacity-60 cursor-not-allowed'
                  : isSelected
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
                    borderColor: isOriginal ? 'rgba(245,158,11,0.4)' : isSelected ? '#e8a020' : 'rgba(255,255,255,0.1)',
                  }}
                />
                {isSelected && !isOriginal && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check
                      size={14}
                      className={
                        color.hex === '#f5f5f5' ? 'text-zinc-800' : 'text-white'
                      }
                    />
                  </div>
                )}
                {isOriginal && (
                  <div className="absolute -top-1 -right-1 text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 rounded-full font-bold leading-tight">
                    OG
                  </div>
                )}
                {color.isVariantColor && !isSelected && !isOriginal && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border border-bg-primary" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium leading-none text-center transition-colors ${
                  isOriginal
                    ? 'text-amber-400/70'
                    : isSelected ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'
                }`}
              >
                {color.label}
                {isOriginal && <span className="block text-[10px] mt-0.5">(Original)</span>}
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
