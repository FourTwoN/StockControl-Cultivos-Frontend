import { useMemo, useEffect } from 'react'
import { DataTable } from '@core/components/ui/DataTable'
import type { Column } from '@core/components/ui/DataTable'
import { usePagination } from '@core/hooks/usePagination'
import { useProductCosts } from '../hooks/useProductCosts.ts'
import type { ProductCost } from '../types/Cost.ts'

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function CostTable() {
  const pagination = usePagination(20)

  const { data, isLoading } = useProductCosts(pagination.page, pagination.size)

  useEffect(() => {
    if (data) {
      pagination.setTotal(data.totalPages, data.totalElements)
    }
  }, [data, pagination])

  const columns: readonly Column<ProductCost>[] = useMemo(
    () => [
      {
        key: 'productName' as const,
        header: 'Product',
        sortable: true,
      },
      {
        key: 'productSku' as const,
        header: 'SKU',
      },
      {
        key: 'averageCost' as const,
        header: 'Avg. Cost',
        render: (_value, row) => (
          <span className="font-medium text-primary">
            {formatCurrency(row.averageCost, row.currency)}
          </span>
        ),
      },
      {
        key: 'lastCost' as const,
        header: 'Last Cost',
        render: (_value, row) => (
          <span className="text-sm text-muted">{formatCurrency(row.lastCost, row.currency)}</span>
        ),
      },
      {
        key: 'totalUnits' as const,
        header: 'Units',
        render: (value) => (
          <span className="text-sm text-primary">
            {new Intl.NumberFormat('es-AR').format(value as number)}
          </span>
        ),
      },
      {
        key: 'totalValue' as const,
        header: 'Total Value',
        render: (_value, row) => (
          <span className="font-semibold text-primary">
            {formatCurrency(row.totalValue, row.currency)}
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <DataTable<ProductCost>
      columns={columns}
      data={data?.content ?? []}
      isLoading={isLoading}
      emptyMessage="No cost data available"
      keyExtractor={(row) => row.productId}
      pagination={{
        page: pagination.page + 1,
        totalPages: pagination.totalPages,
        onPageChange: (p) => pagination.setPage(p - 1),
      }}
    />
  )
}
