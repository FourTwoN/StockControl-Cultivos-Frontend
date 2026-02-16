import { useState, useCallback, useMemo } from 'react'
import { DataTable } from '@core/components/ui/DataTable.tsx'
import type { Column } from '@core/components/ui/DataTable.tsx'
import type { PriceItem } from '../types/Price.ts'
import type { PriceItemFormData } from '../types/schemas.ts'

interface PriceTableProps {
  readonly items: readonly PriceItem[]
  readonly isLoading?: boolean
  readonly onUpdateItem?: (itemId: string, data: PriceItemFormData) => void
}

interface EditingCell {
  readonly itemId: string
  readonly field: 'unitPrice' | 'minQuantity' | 'discount'
}

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('es-AR', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function EditableCell({
  value,
  onSave,
  formatDisplay,
}: {
  readonly value: number
  readonly onSave: (newValue: number) => void
  readonly formatDisplay: (v: number) => string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    const parsed = parseFloat(editValue)
    if (!isNaN(parsed) && parsed !== value) {
      onSave(parsed)
    }
  }, [editValue, value, onSave])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur()
      }
      if (e.key === 'Escape') {
        setIsEditing(false)
        setEditValue(String(value))
      }
    },
    [handleBlur, value],
  )

  if (isEditing) {
    return (
      <input
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-7 w-24 rounded border border-border bg-background px-2 text-sm text-primary focus:outline-2 focus:outline-primary"
        autoFocus
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setIsEditing(true)
        setEditValue(String(value))
      }}
      className="cursor-pointer rounded px-1 py-0.5 text-left hover:bg-background"
    >
      {formatDisplay(value)}
    </button>
  )
}

export function PriceTable({ items, isLoading = false, onUpdateItem }: PriceTableProps) {
  const [, setEditingCell] = useState<EditingCell | null>(null)

  const handleSave = useCallback(
    (item: PriceItem, field: EditingCell['field'], newValue: number) => {
      if (!onUpdateItem) return

      const data: PriceItemFormData = {
        unitPrice: field === 'unitPrice' ? newValue : item.unitPrice,
        minQuantity: field === 'minQuantity' ? newValue : item.minQuantity,
        ...(item.maxQuantity !== undefined ? { maxQuantity: item.maxQuantity } : {}),
        ...(field === 'discount'
          ? { discount: newValue }
          : item.discount !== undefined
            ? { discount: item.discount }
            : {}),
      }

      onUpdateItem(item.id, data)
      setEditingCell(null)
    },
    [onUpdateItem],
  )

  const columns: readonly Column<PriceItem>[] = useMemo(
    () => [
      {
        key: 'productSku',
        header: 'SKU',
        sortable: true,
      },
      {
        key: 'productName',
        header: 'Product',
        sortable: true,
      },
      {
        key: 'unitPrice',
        header: 'Unit Price',
        sortable: true,
        render: (_value: PriceItem[keyof PriceItem], row: PriceItem) =>
          onUpdateItem ? (
            <EditableCell
              value={row.unitPrice}
              onSave={(v) => handleSave(row, 'unitPrice', v)}
              formatDisplay={currencyFormatter.format}
            />
          ) : (
            currencyFormatter.format(row.unitPrice)
          ),
      },
      {
        key: 'minQuantity',
        header: 'Min Qty',
        sortable: true,
        render: (_value: PriceItem[keyof PriceItem], row: PriceItem) =>
          onUpdateItem ? (
            <EditableCell
              value={row.minQuantity}
              onSave={(v) => handleSave(row, 'minQuantity', v)}
              formatDisplay={(v) => String(v)}
            />
          ) : (
            String(row.minQuantity)
          ),
      },
      {
        key: 'discount',
        header: 'Discount %',
        render: (_value: PriceItem[keyof PriceItem], row: PriceItem) => {
          const discountValue = row.discount ?? 0
          return onUpdateItem ? (
            <EditableCell
              value={discountValue}
              onSave={(v) => handleSave(row, 'discount', v)}
              formatDisplay={(v) => percentFormatter.format(v / 100)}
            />
          ) : (
            percentFormatter.format(discountValue / 100)
          )
        },
      },
      {
        key: 'finalPrice',
        header: 'Final Price',
        sortable: true,
        render: (_value: PriceItem[keyof PriceItem], row: PriceItem) =>
          currencyFormatter.format(row.finalPrice),
      },
    ],
    [onUpdateItem, handleSave],
  )

  return (
    <DataTable<PriceItem>
      columns={columns}
      data={[...items]}
      isLoading={isLoading}
      emptyMessage="No price items found"
      keyExtractor={(row) => row.id}
    />
  )
}
