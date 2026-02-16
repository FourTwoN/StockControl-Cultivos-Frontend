import { useCallback } from 'react'
import { Package, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatedList, AnimatedListItem } from '@core/components/motion/AnimatedList'
import { Card } from '@core/components/ui/Card.tsx'
import { Badge } from '@core/components/ui/Badge.tsx'
import { Button } from '@core/components/ui/Button.tsx'
import { Skeleton } from '@core/components/ui/Skeleton.tsx'
import { EmptyState } from '@core/components/ui/EmptyState.tsx'
import type { PackagingCatalog } from '../types/Packaging.ts'

interface PackagingCatalogListProps {
  readonly items: readonly PackagingCatalog[]
  readonly isLoading: boolean
  readonly page: number
  readonly totalPages: number
  readonly totalElements: number
  readonly onPageChange: (page: number) => void
  readonly onEdit: (item: PackagingCatalog) => void
  readonly onDelete: (item: PackagingCatalog) => void
}

function CatalogCardSkeleton() {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10" variant="circle" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </Card>
  )
}

function ColorSwatch({ hex, name }: { readonly hex: string; readonly name: string }) {
  return (
    <span
      className="inline-block h-4 w-4 rounded-full border border-border"
      style={{ backgroundColor: hex }}
      title={name}
      aria-label={`Color: ${name}`}
    />
  )
}

function CatalogCard({
  item,
  onEdit,
  onDelete,
}: {
  readonly item: PackagingCatalog
  readonly onEdit: () => void
  readonly onDelete: () => void
}) {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        {/* Header: icon + status */}
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <Badge variant={item.isActive ? 'success' : 'outline'}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Name + SKU */}
        <div>
          <h3 className="text-sm font-semibold text-primary line-clamp-1">{item.name}</h3>
          <p className="mt-0.5 text-xs text-muted">SKU: {item.sku}</p>
        </div>

        {/* Attributes: type, material, color */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{item.typeName}</Badge>
          <Badge variant="outline">{item.materialName}</Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
            <ColorSwatch hex={item.colorHex} name={item.colorName} />
            {item.colorName}
          </span>
        </div>

        {/* Dimensions + weight */}
        {(item.dimensions || item.weight !== undefined) && (
          <div className="flex gap-3 text-xs text-muted">
            {item.dimensions && <span>{item.dimensions}</span>}
            {item.weight !== undefined && <span>{item.weight}g</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}

function Pagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
}: {
  readonly page: number
  readonly totalPages: number
  readonly totalElements: number
  readonly onPageChange: (page: number) => void
}) {
  const handlePrev = useCallback(() => {
    onPageChange(Math.max(0, page - 1))
  }, [page, onPageChange])

  const handleNext = useCallback(() => {
    onPageChange(Math.min(totalPages - 1, page + 1))
  }, [page, totalPages, onPageChange])

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <p className="text-sm text-muted">
        {totalElements} item{totalElements === 1 ? '' : 's'} total
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 0}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted">
          {page + 1} / {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={page >= totalPages - 1}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function PackagingCatalogList({
  items,
  isLoading,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onEdit,
  onDelete,
}: PackagingCatalogListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <CatalogCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-8 w-8" />}
        title="No packaging items found"
        description="Try adjusting your filters or create a new packaging item to get started."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <AnimatedList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <AnimatedListItem key={item.id}>
            <CatalogCard
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item)}
            />
          </AnimatedListItem>
        ))}
      </AnimatedList>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={onPageChange}
      />
    </div>
  )
}
