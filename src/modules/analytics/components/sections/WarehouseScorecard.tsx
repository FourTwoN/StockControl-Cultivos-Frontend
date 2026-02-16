import { format, parseISO } from 'date-fns'
import { AlertTriangle, Clock, Warehouse } from 'lucide-react'
import { Progress, Skeleton } from '@core/components/ui'
import { FadeIn } from '@core/components/motion'
import { cn } from '@/lib/utils'
import { WidgetContainer } from '../widgets/WidgetContainer.tsx'
import { useWarehouseScorecard } from '../../hooks/useWarehouseScorecard.ts'
import type { WarehouseScorecardEntry } from '../../types/Analytics.ts'

function getHealthColor(occupancy: number): string {
  if (occupancy >= 80) {
    return 'text-success'
  }
  if (occupancy >= 50) {
    return 'text-warning'
  }
  return 'text-destructive'
}

function getHealthLabel(occupancy: number): string {
  if (occupancy >= 80) {
    return 'Healthy'
  }
  if (occupancy >= 50) {
    return 'Moderate'
  }
  return 'Low'
}

function formatActivityDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy')
  } catch {
    return dateStr
  }
}

function ScorecardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`scorecard-skeleton-${i}`}
          className="flex flex-col gap-3 rounded-xl border border-border/50 bg-surface p-4"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-full" variant="rectangle" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

function ScorecardCard({
  entry,
}: {
  readonly entry: WarehouseScorecardEntry
}) {
  const healthColor = getHealthColor(entry.occupancyPercentage)
  const healthLabel = getHealthLabel(entry.occupancyPercentage)

  return (
    <WidgetContainer
      title={entry.warehouseName}
      subtitle={healthLabel}
      className={cn(
        'border-l-4',
        entry.occupancyPercentage >= 80
          ? 'border-l-success'
          : entry.occupancyPercentage >= 50
            ? 'border-l-warning'
            : 'border-l-destructive',
      )}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-muted">Occupancy</span>
            <span className={cn('text-sm font-semibold', healthColor)}>
              {Math.round(entry.occupancyPercentage)}%
            </span>
          </div>
          <Progress value={Math.min(entry.occupancyPercentage, 100)} />
        </div>

        <div className="flex items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>
              {entry.stockAlertCount}{' '}
              {entry.stockAlertCount === 1 ? 'alert' : 'alerts'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatActivityDate(entry.lastActivityDate)}</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  )
}

export function WarehouseScorecard() {
  const { data, isLoading } = useWarehouseScorecard()

  if (isLoading) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Warehouse className="h-5 w-5 text-muted" />
          <h2 className="text-lg font-semibold text-primary">
            Warehouse Health
          </h2>
        </div>
        <ScorecardSkeleton />
      </div>
    )
  }

  const entries = Array.isArray(data) ? data : []

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Warehouse className="h-5 w-5 text-muted" />
        <h2 className="text-lg font-semibold text-primary">
          Warehouse Health
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, index) => (
          <FadeIn key={entry.warehouseId} delay={index * 0.05}>
            <ScorecardCard entry={entry} />
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
