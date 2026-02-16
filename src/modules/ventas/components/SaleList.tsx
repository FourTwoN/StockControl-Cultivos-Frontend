import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Eye, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { DataTable } from '@core/components/ui/DataTable'
import type { Column } from '@core/components/ui/DataTable'
import { Button } from '@core/components/ui/Button'
import { Badge } from '@core/components/ui/Badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@core/components/ui/Select'
import { Input } from '@core/components/ui/Input'
import { usePagination } from '@core/hooks/usePagination'
import { useSales } from '../hooks/useSales.ts'
import type { Sale } from '../types/Sale.ts'

type BadgeVariant = 'success' | 'warning' | 'default'

const STATUS_BADGE_MAP: Readonly<Record<Sale['status'], BadgeVariant>> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive' as BadgeVariant,
}

const STATUS_LABELS: Readonly<Record<Sale['status'], string>> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
}

const ALL_STATUSES = 'ALL'

const STATUS_OPTIONS = [
  { value: ALL_STATUSES, label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const

const DEFAULT_CURRENCY = 'ARS'

function formatCurrency(amount: number, currency: string | null | undefined): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || DEFAULT_CURRENCY,
  }).format(amount)
}

interface SaleListProps {
  readonly onCreate: () => void
}

export function SaleList({ onCreate }: SaleListProps) {
  const navigate = useNavigate()
  const pagination = usePagination(20)

  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filters = useMemo(
    () => ({
      ...(statusFilter && statusFilter !== ALL_STATUSES
        ? { status: statusFilter as Sale['status'] }
        : {}),
      ...(dateFrom ? { from: dateFrom } : {}),
      ...(dateTo ? { to: dateTo } : {}),
    }),
    [statusFilter, dateFrom, dateTo],
  )

  const { data, isLoading } = useSales(pagination.page, pagination.size, filters)

  useEffect(() => {
    if (data) {
      pagination.setTotal(data.totalPages, data.totalElements)
    }
  }, [data, pagination])

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const handleDateFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateFrom(e.target.value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const handleDateToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateTo(e.target.value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const handleViewSale = useCallback(
    (sale: Sale) => {
      void navigate(`/ventas/${sale.id}`)
    },
    [navigate],
  )

  const columns: readonly Column<Sale>[] = useMemo(
    () => [
      {
        key: 'saleNumber' as const,
        header: 'Sale #',
        sortable: true,
      },
      {
        key: 'customerName' as const,
        header: 'Customer',
        render: (value) => (
          <span className="text-sm text-primary">{(value as string) || 'Walk-in'}</span>
        ),
      },
      {
        key: 'items' as const,
        header: 'Items',
        render: (_value, row) => <span className="text-sm text-muted">{row.items.length}</span>,
      },
      {
        key: 'totalAmount' as const,
        header: 'Total',
        render: (_value, row) => (
          <span className="font-medium text-primary">
            {formatCurrency(row.totalAmount, row.currency)}
          </span>
        ),
      },
      {
        key: 'status' as const,
        header: 'Status',
        render: (_value, row) => (
          <Badge variant={STATUS_BADGE_MAP[row.status]}>{STATUS_LABELS[row.status]}</Badge>
        ),
      },
      {
        key: 'createdAt' as const,
        header: 'Date',
        sortable: true,
        render: (value) => (
          <span className="text-sm text-muted">
            {format(new Date(value as string), 'dd/MM/yyyy HH:mm')}
          </span>
        ),
      },
      {
        key: 'id' as const,
        header: 'Actions',
        render: (_value, row) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewSale(row)
            }}
            aria-label={`View sale ${row.saleNumber}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [handleViewSale],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:w-40">
            <label className="mb-1 block text-xs font-medium text-muted">Status</label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
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
          <div className="w-full sm:w-40">
            <label className="mb-1 block text-xs font-medium text-muted">From</label>
            <Input type="date" value={dateFrom} onChange={handleDateFromChange} />
          </div>
          <div className="w-full sm:w-40">
            <label className="mb-1 block text-xs font-medium text-muted">To</label>
            <Input type="date" value={dateTo} onChange={handleDateToChange} />
          </div>
        </div>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4" />
          New Sale
        </Button>
      </div>

      <DataTable<Sale>
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        emptyMessage="No sales found"
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
