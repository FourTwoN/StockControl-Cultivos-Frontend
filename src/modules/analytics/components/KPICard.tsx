import {
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  Boxes,
  ShoppingCart,
  CheckCircle,
  DollarSign,
  type LucideIcon,
} from 'lucide-react'
import { Card } from '@core/components/ui'
import type { KPI } from '../types/Analytics.ts'

interface KPICardProps {
  readonly kpi: KPI
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

function formatValue(value: number, unit: string): string {
  if (unit === '$' || unit === 'currency') {
    return currencyFormatter.format(value)
  }
  if (unit === '%') {
    return `${numberFormatter.format(value)}%`
  }
  if (unit === 'count') {
    return numberFormatter.format(value)
  }
  return `${numberFormatter.format(value)} ${unit}`
}

function computeChangePercentage(current: number, previous: number | null): number | null {
  if (previous === null) {
    return null
  }
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return ((current - previous) / Math.abs(previous)) * 100
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
  },
  down: {
    icon: TrendingDown,
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
  },
  stable: {
    icon: Minus,
    colorClass: 'text-muted',
    bgClass: 'bg-muted/10',
  },
} as const

type TrendKey = keyof typeof trendConfig

function normalizeTrend(trend: string | null | undefined): TrendKey | null {
  if (!trend) return null
  const lower = trend.toLowerCase()
  if (lower === 'up' || lower === 'down' || lower === 'stable') {
    return lower
  }
  return null
}

// Map KPI ids to icons
const kpiIconMap: Record<string, LucideIcon> = {
  total_products: Package,
  active_batches: Boxes,
  pending_sales: ShoppingCart,
  completed_sales_today: CheckCircle,
  total_inventory_value: DollarSign,
}

const defaultIcon = Package

export function KPICard({ kpi }: KPICardProps) {
  const changePercent = computeChangePercentage(kpi.value, kpi.previousValue)
  const normalizedTrend = normalizeTrend(kpi.trend)
  const hasTrendData = normalizedTrend !== null && changePercent !== null

  const KpiIcon = kpiIconMap[kpi.id] ?? defaultIcon

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <KpiIcon className="h-4 w-4 text-muted" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted">{kpi.label}</span>
      </div>
      <span className="text-2xl font-bold text-primary">{formatValue(kpi.value, kpi.unit)}</span>
      {hasTrendData ? (
        <div className="flex items-center gap-1.5">
          <span
            className={[
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              trendConfig[normalizedTrend].bgClass,
              trendConfig[normalizedTrend].colorClass,
            ].join(' ')}
          >
            {(() => {
              const TrendIcon = trendConfig[normalizedTrend].icon
              return <TrendIcon className="h-3 w-3" />
            })()}
            {numberFormatter.format(Math.abs(changePercent))}%
          </span>
          <span className="text-xs text-muted">vs previous</span>
        </div>
      ) : (
        <div className="h-5" /> // Spacer to maintain consistent card height
      )}
    </Card>
  )
}
