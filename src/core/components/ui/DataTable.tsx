import { useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { Skeleton } from '@core/components/ui/Skeleton'
import { EmptyState } from '@core/components/ui/EmptyState'

export interface Column<T> {
  readonly key: keyof T & string
  readonly header: string
  readonly render?: (value: T[keyof T], row: T) => ReactNode
  readonly sortable?: boolean
}

interface PaginationProps {
  readonly page: number
  readonly totalPages: number
  readonly onPageChange: (page: number) => void
}

interface DataTableProps<T> {
  readonly columns: readonly Column<T>[]
  readonly data: readonly T[]
  readonly isLoading?: boolean
  readonly emptyMessage?: string
  readonly onRowClick?: (row: T) => void
  readonly pagination?: PaginationProps
  readonly keyExtractor: (row: T) => string
}

interface SortState {
  readonly column: string
  readonly direction: 'asc' | 'desc'
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  pagination,
  keyExtractor,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null)

  const handleSort = useCallback((columnKey: string) => {
    setSort((prev) => {
      if (prev?.column !== columnKey) {
        return { column: columnKey, direction: 'asc' }
      }
      if (prev.direction === 'asc') {
        return { column: columnKey, direction: 'desc' }
      }
      return null
    })
  }, [])

  const sortedData = useMemo(() => {
    if (!sort) return data

    return [...data].sort((a, b) => {
      const aVal = a[sort.column as keyof T]
      const bVal = b[sort.column as keyof T]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      const comparison = String(aVal).localeCompare(String(bVal))
      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [data, sort])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-border/50 shadow-[var(--shadow-sm)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-surface-hover">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={i} className="border-b border-border/30 last:border-b-0">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <Skeleton className="h-4 w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 shadow-[var(--shadow-sm)]">
        <EmptyState
          icon={<Inbox className="h-8 w-8" />}
          title="No results"
          description={emptyMessage}
        />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/50 shadow-[var(--shadow-sm)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50 bg-surface-hover">
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted',
                  col.sortable
                    ? 'cursor-pointer select-none transition-colors duration-200 hover:text-text-primary'
                    : '',
                  sort?.column === col.key ? 'text-primary' : '',
                ].join(' ')}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable &&
                    sort?.column === col.key &&
                    (sort.direction === 'asc' ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr
              key={keyExtractor(row)}
              className={[
                'border-b border-border/30 last:border-b-0 transition-colors duration-150',
                onRowClick ? 'cursor-pointer hover:bg-primary/[0.03]' : '',
              ].join(' ')}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-text-primary">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
          <p className="text-xs text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="rounded-lg p-1.5 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-primary disabled:pointer-events-none disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="rounded-lg p-1.5 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-primary disabled:pointer-events-none disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
