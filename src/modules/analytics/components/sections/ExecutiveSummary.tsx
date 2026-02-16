import {
  Package,
  Boxes,
  ShoppingCart,
  DollarSign,
  type LucideIcon,
} from 'lucide-react'
import { Skeleton } from '@core/components/ui'
import { FadeIn } from '@core/components/motion'
import { KPIWidget } from '../widgets/KPIWidget.tsx'
import { useKPIs } from '../../hooks/useKPIs.ts'
import type { KPI } from '../../types/Analytics.ts'

type ValueFormat = 'number' | 'currency' | 'percent'

const kpiIconMap: Record<string, LucideIcon> = {
  total_products: Package,
  active_batches: Boxes,
  pending_sales: ShoppingCart,
  completed_sales_today: ShoppingCart,
  total_inventory_value: DollarSign,
}

const defaultIcon = Package

function getFormatForUnit(unit: string): ValueFormat {
  if (unit === '$' || unit === 'currency') {
    return 'currency'
  }
  if (unit === '%') {
    return 'percent'
  }
  return 'number'
}

function buildTrend(kpi: KPI): { readonly value: number; readonly direction: 'up' | 'down' } | undefined {
  if (kpi.trend === null || kpi.trend === 'stable' || kpi.previousValue === null) {
    return undefined
  }

  const previous = kpi.previousValue
  const changePercent =
    previous === 0
      ? (kpi.value > 0 ? 100 : 0)
      : ((kpi.value - previous) / Math.abs(previous)) * 100

  return {
    value: Math.abs(changePercent),
    direction: kpi.trend === 'up' ? 'up' : 'down',
  }
}

function SummarySkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`exec-skeleton-${i}`}
          className="flex flex-col gap-2 rounded-xl border border-border/50 bg-surface p-4"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  )
}

export function ExecutiveSummary() {
  const { data, isLoading } = useKPIs()

  if (isLoading) {
    return <SummarySkeletonGrid />
  }

  const kpis = Array.isArray(data) ? data : []

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const IconComponent = kpiIconMap[kpi.id] ?? defaultIcon
        return (
          <FadeIn key={kpi.id} delay={index * 0.05}>
            <KPIWidget
              label={kpi.label}
              value={kpi.value}
              format={getFormatForUnit(kpi.unit)}
              trend={buildTrend(kpi)}
              icon={<IconComponent className="h-4 w-4" />}
            />
          </FadeIn>
        )
      })}
    </div>
  )
}
