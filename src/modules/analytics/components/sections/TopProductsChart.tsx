import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@core/components/ui'
import { FadeIn } from '@core/components/motion'
import { WidgetContainer } from '../widgets/WidgetContainer.tsx'
import { useGlobalProductAnalytics } from '../../hooks/useGlobalProductAnalytics.ts'
import { getChartColors } from '../../utils/colorCalculator.ts'
import type { TopProduct } from '../../types/Analytics.ts'

const numberFormatter = new Intl.NumberFormat('en-US')

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

interface TooltipPayloadEntry {
  readonly name: string
  readonly value: number
  readonly payload: TopProduct
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
      <p className="mb-1 text-sm font-medium text-primary">
        {entry.payload.productName}
      </p>
      <p className="text-xs text-muted">
        Qty sold: {numberFormatter.format(entry.value)}
      </p>
      <p className="text-xs text-muted">
        Revenue: {currencyFormatter.format(entry.payload.totalRevenue)}
      </p>
    </div>
  )
}

export function TopProductsChart() {
  const { data, isLoading } = useGlobalProductAnalytics()

  if (isLoading) {
    return (
      <WidgetContainer title="Top Products by Quantity">
        <Skeleton className="h-64 w-full" variant="rectangle" />
      </WidgetContainer>
    )
  }

  const topProducts = data?.topProducts ?? []
  const colors = getChartColors(topProducts.length)

  // Recharts needs a mutable array for data prop
  const chartData = [...topProducts]

  return (
    <FadeIn>
      <WidgetContainer title="Top Products by Quantity">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, bottom: 5, left: 100 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              horizontal={false}
            />
            <XAxis
              type="number"
              tickFormatter={(v: number) => numberFormatter.format(v)}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              type="category"
              dataKey="productName"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={90}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="totalQuantitySold"
              name="Quantity Sold"
              radius={[0, 4, 4, 0]}
            >
              {topProducts.map((product, index) => (
                <Cell
                  key={product.productId}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </WidgetContainer>
    </FadeIn>
  )
}
