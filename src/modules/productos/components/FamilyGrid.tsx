import { useCallback } from 'react'
import { ImageOff } from 'lucide-react'
import { Card } from '@core/components/ui/Card'
import { Badge } from '@core/components/ui/Badge'
import type { ProductFamily } from '../types/Product.ts'

interface FamilyCardProps {
  readonly family: ProductFamily
  readonly isSelected: boolean
  readonly onClick: (family: ProductFamily) => void
}

function FamilyCard({ family, isSelected, onClick }: FamilyCardProps) {
  const handleClick = useCallback(() => {
    onClick(family)
  }, [onClick, family])

  return (
    <Card onClick={handleClick} className={isSelected ? 'ring-2 ring-primary' : ''}>
      <div className="flex flex-col gap-3">
        {family.imageUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-md bg-background">
            <img src={family.imageUrl} alt={family.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-md bg-background">
            <ImageOff className="h-8 w-8 text-muted" />
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-primary">{family.name}</h3>
            {family.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted">{family.description}</p>
            )}
          </div>
          <Badge variant="outline">{family.productCount}</Badge>
        </div>
      </div>
    </Card>
  )
}

interface FamilyGridProps {
  readonly families: readonly ProductFamily[]
  readonly selectedId?: string
  readonly onSelect: (family: ProductFamily) => void
  readonly isLoading?: boolean
}

export function FamilyGrid({ families, selectedId, onSelect, isLoading = false }: FamilyGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-lg border border-border bg-background"
          />
        ))}
      </div>
    )
  }

  if (families.length === 0) {
    return <p className="py-8 text-center text-sm text-muted">No families found</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {families.map((family) => (
        <FamilyCard
          key={family.id}
          family={family}
          isSelected={selectedId === family.id}
          onClick={onSelect}
        />
      ))}
    </div>
  )
}
