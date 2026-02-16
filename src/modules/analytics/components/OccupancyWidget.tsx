import { Card, Skeleton } from '@core/components/ui'
import type { WarehouseOccupancy } from '../types/Analytics.ts'

interface OccupancyWidgetProps {
  readonly data: readonly WarehouseOccupancy[]
  readonly isLoading: boolean
}

const numberFormatter = new Intl.NumberFormat('en-US')

function getOccupancyColor(percentage: number): string {
  if (percentage >= 85) {
    return 'bg-destructive'
  }
  if (percentage >= 60) {
    return 'bg-warning'
  }
  return 'bg-success'
}

function getOccupancyTextColor(percentage: number): string {
  if (percentage >= 85) {
    return 'text-destructive'
  }
  if (percentage >= 60) {
    return 'text-warning'
  }
  return 'text-success'
}

export function OccupancyWidget({ data, isLoading }: OccupancyWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-primary">Warehouse Occupancy</h3>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-full" variant="rectangle" />
          <Skeleton className="h-12 w-full" variant="rectangle" />
          <Skeleton className="h-12 w-full" variant="rectangle" />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-primary">Warehouse Occupancy</h3>
      <div className="flex flex-col gap-4">
        {data.map((warehouse) => (
          <div key={warehouse.warehouseId} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">{warehouse.warehouseName}</span>
              <span
                className={[
                  'text-xs font-semibold',
                  getOccupancyTextColor(warehouse.occupancyPercentage),
                ].join(' ')}
              >
                {numberFormatter.format(warehouse.occupancyPercentage)}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/40">
              <div
                className={[
                  'h-full rounded-full transition-all',
                  getOccupancyColor(warehouse.occupancyPercentage),
                ].join(' ')}
                style={{
                  width: `${Math.min(warehouse.occupancyPercentage, 100)}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted">
              {numberFormatter.format(warehouse.usedCapacity)} /{' '}
              {numberFormatter.format(warehouse.totalCapacity)} capacity
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
