import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

type TrendDirection = 'up' | 'down' | 'neutral'

interface MetricCardProps {
  readonly label: string
  readonly value: string
  readonly trend?: {
    readonly direction: TrendDirection
    readonly percentage: number
  }
  readonly className?: string
}

const TREND_CONFIG: Record<
  TrendDirection,
  { readonly icon: typeof TrendingUp; readonly color: string }
> = {
  up: { icon: TrendingUp, color: 'text-success' },
  down: { icon: TrendingDown, color: 'text-destructive' },
  neutral: { icon: Minus, color: 'text-muted' },
}

export function MetricCard({ label, value, trend, className }: MetricCardProps) {
  const trendConfig = trend ? TREND_CONFIG[trend.direction] : null
  const TrendIcon = trendConfig?.icon

  return (
    <div
      className={cn(
        'inline-flex flex-col gap-1 rounded-lg border border-border/50 bg-surface px-4 py-3 shadow-sm',
        className,
      )}
    >
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-primary">{value}</span>
        {trend && TrendIcon && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium', trendConfig?.color)}>
            <TrendIcon className="h-3 w-3" />
            {trend.percentage}%
          </span>
        )}
      </div>
    </div>
  )
}
