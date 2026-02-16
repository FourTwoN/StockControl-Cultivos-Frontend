import { useState, useCallback } from 'react'
import { ChevronRight, ChevronDown, Folder } from 'lucide-react'
import { Badge } from '@core/components/ui/Badge'
import type { Category } from '../types/Product.ts'

interface CategoryNodeProps {
  readonly category: Category
  readonly selectedId?: string
  readonly onSelect: (category: Category) => void
  readonly depth?: number
}

function CategoryNode({ category, selectedId, onSelect, depth = 0 }: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = category.children !== undefined && category.children.length > 0
  const isSelected = selectedId === category.id

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded((prev) => !prev)
  }, [])

  const handleSelect = useCallback(() => {
    onSelect(category)
  }, [onSelect, category])

  return (
    <div>
      <button
        type="button"
        onClick={handleSelect}
        className={[
          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
          isSelected
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-primary hover:bg-background',
        ].join(' ')}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren ? (
          <span
            onClick={handleToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                setIsExpanded((prev) => !prev)
              }
            }}
            className="flex-shrink-0 rounded p-0.5 hover:bg-background"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted" />
            )}
          </span>
        ) : (
          <span className="w-5" />
        )}

        <Folder className="h-4 w-4 flex-shrink-0 text-muted" />
        <span className="flex-1 truncate">{category.name}</span>
        <Badge variant="outline">{category.productCount}</Badge>
      </button>

      {isExpanded && hasChildren && (
        <div>
          {category.children?.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CategoryTreeProps {
  readonly categories: readonly Category[]
  readonly selectedId?: string
  readonly onSelect: (category: Category) => void
  readonly isLoading?: boolean
}

export function CategoryTree({
  categories,
  selectedId,
  onSelect,
  isLoading = false,
}: CategoryTreeProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-background" />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return <p className="p-4 text-center text-sm text-muted">No categories found</p>
  }

  return (
    <div className="flex flex-col gap-0.5 p-1">
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
