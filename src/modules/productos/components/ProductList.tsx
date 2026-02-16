import { useState, useCallback, useMemo, useEffect } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { DataTable } from '@core/components/ui/DataTable'
import type { Column } from '@core/components/ui/DataTable'
import { Button } from '@core/components/ui/Button'
import { Badge } from '@core/components/ui/Badge'
import { SearchInput } from '@core/components/forms/SearchInput'
import { usePagination } from '@core/hooks/usePagination'
import { useProducts } from '../hooks/useProducts.ts'
import type { Product } from '../types/Product.ts'

type BadgeVariant = 'success' | 'warning' | 'default'

const STATE_BADGE_MAP: Readonly<Record<Product['state'], BadgeVariant>> = {
  healthy: 'success',
  diseased: 'destructive' as BadgeVariant,
  dormant: 'warning',
}

const STATE_LABELS: Readonly<Record<Product['state'], string>> = {
  healthy: 'Healthy',
  diseased: 'Diseased',
  dormant: 'Dormant',
}

interface ProductListProps {
  readonly onEdit: (product: Product) => void
  readonly onDelete: (product: Product) => void
  readonly onCreate: () => void
}

export function ProductList({ onEdit, onDelete, onCreate }: ProductListProps) {
  const [search, setSearch] = useState('')
  const pagination = usePagination(20)

  const { data, isLoading } = useProducts(pagination.page, pagination.size, search)

  useEffect(() => {
    if (data) {
      pagination.setTotal(data.totalPages, data.totalElements)
    }
  }, [data, pagination])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const columns: readonly Column<Product>[] = useMemo(
    () => [
      {
        key: 'sku' as const,
        header: 'SKU',
        sortable: true,
      },
      {
        key: 'name' as const,
        header: 'Name',
        sortable: true,
      },
      {
        key: 'categoryName' as const,
        header: 'Category',
      },
      {
        key: 'familyName' as const,
        header: 'Family',
      },
      {
        key: 'state' as const,
        header: 'State',
        render: (_value, row) => (
          <Badge variant={STATE_BADGE_MAP[row.state]}>{STATE_LABELS[row.state]}</Badge>
        ),
      },
      {
        key: 'id' as const,
        header: 'Actions',
        render: (_value, row) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(row)
              }}
              aria-label={`Edit ${row.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(row)
              }}
              aria-label={`Delete ${row.name}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
        </div>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      <DataTable<Product>
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        emptyMessage="No products found"
        keyExtractor={(row) => row.id}
        pagination={{
          page: pagination.page + 1,
          totalPages: pagination.totalPages,
          onPageChange: (p) => pagination.setPage(p - 1),
        }}
      />
    </div>
  )
}
