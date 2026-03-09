'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Images, Calendar } from 'lucide-react'
import { colorToHex } from '@/lib/catalog'
import type { VehicleVariant } from '@/types'

interface Props {
  variant: VehicleVariant
  modelId: string
  index?: number
}

export function VariantCard({ variant, modelId, index = 0 }: Props) {
  const frontImage = variant.images.find((i) => i.view === 'front') ?? variant.images[0]

  return (
    <Link
      href={`/vehicle/${modelId}/${variant.id}`}
      className="group block rounded-2xl overflow-hidden border border-border bg-bg-card
                 card-hover hover:border-border-light animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-bg-secondary">
        {frontImage ? (
          <Image
            src={frontImage.url}
            alt={variant.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-bg-hover border border-border flex items-center justify-center">
              <Images size={20} className="text-text-muted" />
            </div>
            <p className="text-xs text-text-muted">Próximamente</p>
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/70 to-transparent" />

        {/* Year badge */}
        <div className="absolute top-3 left-3">
          <span className="badge bg-bg-primary/80 border border-border text-text-secondary text-xs backdrop-blur-sm">
            <Calendar size={9} />
            {variant.year}
          </span>
        </div>

        {/* Image count */}
        <div className="absolute top-3 right-3">
          <span className="badge bg-bg-primary/80 border border-border text-text-secondary text-xs backdrop-blur-sm">
            <Images size={9} />
            {variant.images.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-4">
          <h3 className="font-bold text-text-primary text-xl leading-tight group-hover:text-accent transition-colors">
            {variant.name}
          </h3>
          <div className="w-9 h-9 rounded-xl bg-bg-hover border border-border flex items-center justify-center shrink-0 transition-all group-hover:bg-accent group-hover:border-accent">
            <ArrowRight
              size={16}
              className="text-text-muted group-hover:text-zinc-950 transition-colors"
            />
          </div>
        </div>

        {variant.description && (
          <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">
            {variant.description}
          </p>
        )}

        {/* Color swatches */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Colores:</span>
          <div className="flex gap-1.5">
            {variant.colors.slice(0, 6).map((color) => (
              <span
                key={color}
                title={color}
                className="w-4 h-4 rounded-full border border-white/10 shrink-0"
                style={{ backgroundColor: colorToHex(color) }}
              />
            ))}
            {variant.colors.length > 6 && (
              <span className="text-xs text-text-muted self-center">
                +{variant.colors.length - 6}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
