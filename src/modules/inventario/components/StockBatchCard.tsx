import { MapPin, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@core/components/ui/Card'
import { BatchStatusBadge } from './BatchStatusBadge.tsx'
import type { StockBatch } from '../types/StockBatch.ts'

interface StockBatchCardProps {
  readonly batch: StockBatch
  readonly onClick?: () => void
}

export function StockBatchCard({ batch, onClick }: StockBatchCardProps) {
  const quantityPercentage =
    batch.initialQuantity > 0 ? Math.round((batch.quantity / batch.initialQuantity) * 100) : 0

  return (
    <Card onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <BatchStatusBadge status={batch.status} />
        </div>

        {/* Product info */}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-primary">{batch.productName}</h3>
          <p className="mt-0.5 text-xs text-muted">SKU: {batch.productSku}</p>
        </div>

        {/* Quantity bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-primary">
              {batch.quantity} / {batch.initialQuantity}
            </span>
            <span className="text-muted">{quantityPercentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-background">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                quantityPercentage > 50
                  ? 'bg-success'
                  : quantityPercentage > 20
                    ? 'bg-warning'
                    : 'bg-destructive',
              )}
              style={{ width: `${Math.min(quantityPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">
            {batch.locationName}
            {batch.binName ? ` / ${batch.binName}` : ''}
          </span>
        </div>
      </div>
    </Card>
  )
}
