import { useState, useCallback } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@core/components/ui'
import { FadeIn } from '@core/components/motion'
import { WidgetContainer } from '../widgets/WidgetContainer.tsx'
import { useGlobalProductAnalytics } from '../../hooks/useGlobalProductAnalytics.ts'
import { getChartColors } from '../../utils/colorCalculator.ts'
import type { ProductValuation } from '../../types/Analytics.ts'

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

interface TooltipPayloadEntry {
  readonly name: string
  readonly value: number
  readonly payload: ProductValuation
}

interface CustomTooltipProps {
  readonly active?: boolean
  readonly payload?: readonly TooltipPayloadEntry[]
}

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const entry = payload[0]

  return (
    <div className="rounded-lg border border-border bg-surface p-3 shadow-md">
      <p className="mb-1 text-sm font-medium text-primary">{entry.name}</p>
      <p className="text-xs text-muted">
        Value: {currencyFormatter.format(entry.value)}
      </p>
      <p className="text-xs text-muted">
        Share: {numberFormatter.format(entry.payload.percentage)}%
      </p>
    </div>
  )
}

interface PieEnterEvent {
  readonly tooltipPayload?: readonly unknown[]
}

export function ValuationDonutChart() {
  const { data, isLoading } = useGlobalProductAnalytics()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleMouseEnter = useCallback((_: PieEnterEvent, index: number) => {
    setActiveIndex(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null)
  }, [])

  if (isLoading) {
    return (
      <WidgetContainer title="Inventory Valuation">
        <Skeleton className="h-64 w-full" variant="rectangle" />
      </WidgetContainer>
    )
  }

  const valuations = data?.valuations ?? []
  const totalValuation = data?.totalValuation ?? 0
  const colors = getChartColors(valuations.length)

  // Recharts needs a mutable array for data prop
  const chartData = [...valuations]

  return (
    <FadeIn>
      <WidgetContainer title="Inventory Valuation">
        <div className="relative">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="totalValue"
                nameKey="productName"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={activeIndex !== null ? 105 : 100}
                paddingAngle={2}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {valuations.map((entry, index) => (
                  <Cell
                    key={entry.productId}
                    fill={colors[index % colors.length]}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.5
                    }
                    style={{ transition: 'opacity 200ms ease' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-muted">Total</p>
              <p className="text-lg font-bold text-primary">
                {currencyFormatter.format(totalValuation)}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-2">
          {valuations.slice(0, 6).map((valuation, index) => (
            <div
              key={valuation.productId}
              className="flex items-center gap-1.5 text-xs text-muted"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: colors[index % colors.length],
                }}
              />
              <span className="max-w-24 truncate">
                {valuation.productName}
              </span>
            </div>
          ))}
        </div>
      </WidgetContainer>
    </FadeIn>
  )
}
