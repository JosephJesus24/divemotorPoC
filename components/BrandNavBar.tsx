import Link from 'next/link'

const BRANDS = [
  { id: 'jeep',          label: 'Jeep®'         },
  { id: 'dodge',         label: 'Dodge'          },
  { id: 'ram',           label: 'RAM'            },
  { id: 'fiat',          label: 'FIAT'           },
  { id: 'mercedes-benz', label: 'Mercedes-Benz'  },
]

interface Props {
  activeBrandId?: string
}

export function BrandNavBar({ activeBrandId }: Props) {
  return (
    <div className="border-b border-border bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6 h-10 flex items-center gap-6">
        <Link
          href="/"
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-text-primary transition-colors"
        >
          Grupo Kaufmann
        </Link>

        {BRANDS.map((brand) => (
          <span key={brand.id} className="flex items-center gap-6">
            <div className="h-3 w-px bg-border" />
            <Link
              href={`/brand/${brand.id}`}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                activeBrandId === brand.id
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {brand.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  )
}
