import { useState, useCallback, useMemo, useEffect } from 'react'

import { DataTable } from '@core/components/ui/DataTable'
import type { Column } from '@core/components/ui/DataTable'
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
import { MovementType } from '@core/types/enums'
import { useMovements } from '../hooks/useMovements.ts'
import type { StockMovement } from '../types/StockMovement.ts'

type BadgeVariant = 'success' | 'warning' | 'default' | 'outline'

const TYPE_BADGE_MAP: Readonly<Record<MovementType, BadgeVariant>> = {
  ENTRADA: 'success',
  MUERTE: 'destructive' as BadgeVariant,
  TRASPLANTE: 'default',
  VENTA: 'warning',
  AJUSTE: 'outline',
}

const TYPE_LABEL_MAP: Readonly<Record<MovementType, string>> = {
  ENTRADA: 'Entry',
  MUERTE: 'Death',
  TRASPLANTE: 'Transplant',
  VENTA: 'Sale',
  AJUSTE: 'Adjustment',
}

const TYPE_OPTIONS = [
  { value: MovementType.ENTRADA, label: 'Entry' },
  { value: MovementType.MUERTE, label: 'Death' },
  { value: MovementType.TRASPLANTE, label: 'Transplant' },
  { value: MovementType.VENTA, label: 'Sale' },
  { value: MovementType.AJUSTE, label: 'Adjustment' },
] as const

export function MovementsPage() {
  const pagination = usePagination(20)
  const [typeFilter, setTypeFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data, isLoading } = useMovements({
    page: pagination.page,
    size: pagination.size,
    type: typeFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  useEffect(() => {
    if (data) {
      pagination.setTotal(data.totalPages, data.totalElements)
    }
  }, [data, pagination])

  const handleTypeChange = useCallback(
    (value: string) => {
      setTypeFilter(value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(e.target.value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(e.target.value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const columns: readonly Column<StockMovement>[] = useMemo(
    () => [
      {
        key: 'type' as const,
        header: 'Type',
        render: (_value, row) => (
          <Badge variant={TYPE_BADGE_MAP[row.type]}>{TYPE_LABEL_MAP[row.type]}</Badge>
        ),
      },
      {
        key: 'batchId' as const,
        header: 'Batch ID',
        render: (value) => (
          <span className="font-mono text-xs text-muted">{(value as string).slice(0, 8)}...</span>
        ),
      },
      {
        key: 'quantity' as const,
        header: 'Quantity',
        render: (value) => <span className="font-medium text-primary">{value as number}</span>,
      },
      {
        key: 'sourceBinName' as const,
        header: 'Source',
        render: (value) => (
          <span className="text-sm text-muted">{(value as string | undefined) ?? '-'}</span>
        ),
      },
      {
        key: 'destinationBinName' as const,
        header: 'Destination',
        render: (value) => (
          <span className="text-sm text-muted">{(value as string | undefined) ?? '-'}</span>
        ),
      },
      {
        key: 'performedBy' as const,
        header: 'Performed By',
      },
      {
        key: 'createdAt' as const,
        header: 'Date',
        render: (value) => (
          <span className="text-sm text-muted">{new Date(value as string).toLocaleString()}</span>
        ),
      },
    ],
    [],
  )

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Movements</h1>
        <p className="mt-1 text-sm text-muted">View all stock movement records</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="w-full sm:w-40">
          <label className="mb-1 block text-xs font-medium text-muted">Type</label>
          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-44">
          <label className="mb-1 block text-xs font-medium text-muted">Start Date</label>
          <Input type="date" value={startDate} onChange={handleStartDateChange} />
        </div>

        <div className="w-full sm:w-44">
          <label className="mb-1 block text-xs font-medium text-muted">End Date</label>
          <Input type="date" value={endDate} onChange={handleEndDateChange} />
        </div>
      </div>

      <DataTable<StockMovement>
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        emptyMessage="No movements found"
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
