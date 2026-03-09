'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import { colorToHex } from '@/lib/catalog'
import type { GalleryFilters, ImageView } from '@/types'

const VIEW_LABELS: Record<ImageView, string> = {
  front:    'Frontal',
  side:     'Lateral',
  rear:     'Posterior',
  interior: 'Interior',
  detail:   'Detalle',
  '360':    '360°',
}

interface Props {
  filters: GalleryFilters
  onFiltersChange: (filters: GalleryFilters) => void
  availableColors: string[]
  availableViews: string[]
}

export function FilterBar({ filters, onFiltersChange, availableColors, availableViews }: Props) {
  const hasActiveFilters = filters.color || filters.view || filters.dateFrom || filters.dateTo

  const update = (partial: Partial<GalleryFilters>) =>
    onFiltersChange({ ...filters, ...partial })

  const clearAll = () =>
    onFiltersChange({ color: null, view: null, dateFrom: null, dateTo: null })

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
        <SlidersHorizontal size={13} />
        <span className="font-medium">Filtros</span>
      </div>

      {/* Color filter */}
      {availableColors.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-muted hidden sm:block">Color:</span>
          <div className="flex items-center gap-1">
            {availableColors.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => update({ color: filters.color === color ? null : color })}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  filters.color === color
                    ? 'border-accent scale-110 ring-1 ring-accent'
                    : 'border-white/10 hover:border-white/30'
                }`}
                style={{ backgroundColor: colorToHex(color) }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {availableColors.length > 0 && availableViews.length > 0 && (
        <div className="w-px h-4 bg-border hidden sm:block" />
      )}

      {/* View filter */}
      {availableViews.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-muted hidden sm:block">Vista:</span>
          <div className="flex gap-1">
            {availableViews.map((view) => (
              <button
                key={view}
                onClick={() =>
                  update({ view: filters.view === view ? null : (view as ImageView) })
                }
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filters.view === view
                    ? 'bg-accent text-zinc-950'
                    : 'bg-bg-secondary border border-border text-text-secondary hover:border-border-light hover:text-text-primary'
                }`}
              >
                {VIEW_LABELS[view as ImageView] ?? view}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear all */}
      {hasActiveFilters && (
        <>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={12} />
            <span>Limpiar</span>
          </button>
        </>
      )}
    </div>
  )
}
