'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Images } from 'lucide-react'
import type { VehicleModel } from '@/types'

interface Props {
  model: VehicleModel
  index?: number
}

export function VehicleCard({ model, index = 0 }: Props) {
  const totalImages = model.variants.reduce(
    (acc, v) => acc + v.images.length,
    0
  )
  const hasImages = model.coverImage && !model.coverImage.includes('placeholder')

  // ── Coming Soon card — still clickable so users can enter and upload photos ─
  if (model.comingSoon) {
    return (
      <Link
        href={`/vehicle/${model.id}`}
        className="group block rounded-2xl overflow-hidden border border-border border-dashed bg-bg-card
                   opacity-60 hover:opacity-80 animate-fade-in transition-opacity duration-200"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-secondary">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-bg-hover border border-border flex items-center justify-center">
              <Clock size={22} className="text-text-muted" />
            </div>
            <span className="text-xs font-semibold text-text-muted tracking-widest uppercase">
              Próximamente
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="text-xs text-text-muted font-medium mb-0.5">{model.brand}</p>
              <h3 className="font-bold text-text-secondary text-lg leading-tight group-hover:text-text-primary transition-colors">
                {model.name}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-bg-hover border border-dashed border-border flex items-center justify-center shrink-0 mt-0.5">
              <Clock size={14} className="text-text-muted" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge bg-bg-hover text-text-muted border border-border text-xs">
              Próximamente
            </span>
            <span className="badge bg-bg-hover text-text-muted border border-border text-xs">
              2026
            </span>
          </div>
        </div>
      </Link>
    )
  }

  // ── Normal clickable card ─────────────────────────────────────────────────
  return (
    <Link
      href={`/vehicle/${model.id}`}
      className="group block rounded-2xl overflow-hidden border border-border bg-bg-card
                 card-hover hover:border-border-light animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-secondary">
        {hasImages ? (
          <Image
            src={model.coverImage!}
            alt={model.name}
            fill
            priority={index < 4}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-hover border border-border flex items-center justify-center mb-3">
              <Images size={24} className="text-text-muted" />
            </div>
            <p className="text-xs text-text-muted">Sin imágenes aún</p>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Image count badge */}
        {totalImages > 0 && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-bg-primary/80 border border-border text-text-secondary text-xs backdrop-blur-sm">
              <Images size={10} />
              {totalImages}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-xs text-text-muted font-medium mb-0.5">
              {model.brand}
            </p>
            <h3 className="font-bold text-text-primary text-lg leading-tight group-hover:text-accent transition-colors">
              {model.name}
            </h3>
          </div>
          <div className="w-8 h-8 rounded-lg bg-bg-hover border border-border flex items-center justify-center shrink-0 mt-0.5 transition-all group-hover:bg-accent group-hover:border-accent">
            <ArrowRight
              size={14}
              className="text-text-muted group-hover:text-zinc-950 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge bg-bg-hover text-text-muted border border-border text-xs">
            {model.variants.length} versiones
          </span>
          <span className="badge bg-bg-hover text-text-muted border border-border text-xs">
            2026
          </span>
        </div>
      </div>
    </Link>
  )
}
