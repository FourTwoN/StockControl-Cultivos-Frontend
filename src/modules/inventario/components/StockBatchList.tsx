import { useState, useCallback, useMemo, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { DataTable } from '@core/components/ui/DataTable'
import type { Column } from '@core/components/ui/DataTable'
import { Button } from '@core/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@core/components/ui/Select'
import { usePagination } from '@core/hooks/usePagination'
import { BatchStatus } from '@core/types/enums'
import { useProducts } from '@modules/productos/hooks/useProducts.ts'
import { useStockBatches } from '../hooks/useStockBatches.ts'
import { BatchStatusBadge } from './BatchStatusBadge.tsx'
import type { StockBatch } from '../types/StockBatch.ts'

interface StockBatchListProps {
  readonly onView: (batch: StockBatch) => void
}

const STATUS_OPTIONS = [
  { value: BatchStatus.ACTIVE, label: 'Active' },
  { value: BatchStatus.DEPLETED, label: 'Depleted' },
  { value: BatchStatus.QUARANTINE, label: 'Quarantine' },
  { value: BatchStatus.ARCHIVED, label: 'Archived' },
] as const

export function StockBatchList({ onView }: StockBatchListProps) {
  const [productFilter, setProductFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const pagination = usePagination(20)

  // Fetch products for the dropdown (first 100)
  const { data: productsData } = useProducts(0, 100)
  const productsArray = Array.isArray(productsData?.content) ? productsData.content : []

  const productOptions = useMemo(
    () => productsArray.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` })),
    [productsArray],
  )

  const { data, isLoading } = useStockBatches({
    page: pagination.page,
    size: pagination.size,
    productId: productFilter || undefined,
    status: statusFilter || undefined,
  })

  useEffect(() => {
    if (data) {
      pagination.setTotal(data.totalPages, data.totalElements)
    }
  }, [data, pagination])

  const handleProductChange = useCallback(
    (value: string) => {
      setProductFilter(value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const columns: readonly Column<StockBatch>[] = useMemo(
    () => [
      {
        key: 'productName' as const,
        header: 'Product',
        render: (_value, row) => (
          <div>
            <p className="font-medium text-primary">{row.productName}</p>
            <p className="text-xs text-muted">{row.productSku}</p>
          </div>
        ),
      },
      {
        key: 'locationName' as const,
        header: 'Location',
        render: (_value, row) => (
          <span className="text-sm text-primary">
            {row.locationName}
            {row.binName ? ` / ${row.binName}` : ''}
          </span>
        ),
      },
      {
        key: 'quantity' as const,
        header: 'Quantity',
        render: (_value, row) => (
          <span className="font-medium text-primary">
            {row.quantity} / {row.initialQuantity}
          </span>
        ),
      },
      {
        key: 'status' as const,
        header: 'Status',
        render: (_value, row) => <BatchStatusBadge status={row.status} />,
      },
      {
        key: 'entryDate' as const,
        header: 'Entry Date',
        render: (value) => (
          <span className="text-sm text-muted">
            {new Date(value as string).toLocaleDateString()}
          </span>
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
                onView(row)
              }}
              aria-label={`View ${row.productName}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onView],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Select value={productFilter} onValueChange={handleProductChange}>
              <SelectTrigger>
                <SelectValue placeholder="All products" />
              </SelectTrigger>
              <SelectContent>
                {productOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-40">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DataTable<StockBatch>
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        emptyMessage="No stock batches found"
        keyExtractor={(row) => row.id}
        onRowClick={onView}
        pagination={{
          page: pagination.page + 1,
          totalPages: pagination.totalPages,
          onPageChange: (p) => pagination.setPage(p - 1),
        }}
      />
    </div>
  )
}
