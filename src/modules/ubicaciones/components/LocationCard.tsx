import { cn } from '@/lib/utils'
import { Card } from '@core/components/ui/Card.tsx'
import type { StorageLocation } from '../types/Location.ts'

interface LocationCardProps {
  readonly location: StorageLocation
  readonly onClick?: (location: StorageLocation) => void
}

function getOccupancyColor(occupancy: number, maxCapacity: number): string {
  if (maxCapacity === 0) return 'bg-gray-400'
  const percent = (occupancy / maxCapacity) * 100
  if (percent >= 85) return 'bg-destructive'
  if (percent >= 60) return 'bg-warning'
  return 'bg-success'
}

function getOccupancyPercent(occupancy: number, maxCapacity: number): number {
  if (maxCapacity === 0) return 0
  return Math.min(Math.round((occupancy / maxCapacity) * 100), 100)
}

export function LocationCard({ location, onClick }: LocationCardProps) {
  const percent = getOccupancyPercent(location.occupancy, location.maxCapacity)
  const barColor = getOccupancyColor(location.occupancy, location.maxCapacity)

  return (
    <Card onClick={onClick ? () => onClick(location) : undefined} className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-primary">{location.name}</h3>
          <p className="text-xs text-muted">{location.code}</p>
        </div>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted">
          {location.binCount} bins
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Occupancy</span>
          <span className="font-medium text-primary">{percent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-border">
          <div
            className={cn('h-full rounded-full transition-all', barColor)}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
