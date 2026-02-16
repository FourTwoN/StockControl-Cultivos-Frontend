import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Skeleton } from '@core/components/ui'
import type { TopProduct } from '../types/Analytics.ts'

interface TopProductsWidgetProps {
  readonly data: readonly TopProduct[]
  readonly isLoading: boolean
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#6366f1',
] as const

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-US')

interface TooltipPayloadEntry {
  readonly name: string
  readonly value: number
  readonly payload: {
    readonly totalRevenue: number
    readonly percentage: number
  }
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
      <p className="text-xs text-muted">Qty: {numberFormatter.format(entry.value)}</p>
      <p className="text-xs text-muted">
        Revenue: {currencyFormatter.format(entry.payload.totalRevenue)}
      </p>
      <p className="text-xs text-muted">
        Share: {numberFormatter.format(entry.payload.percentage)}%
      </p>
    </div>
  )
}

export function TopProductsWidget({ data, isLoading }: TopProductsWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-primary">Top Products</h3>
        <Skeleton className="h-64 w-full" variant="rectangle" />
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-primary">Top Products</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={[...data]}
            dataKey="totalQuantitySold"
            nameKey="productName"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${data[index].productId}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-2">
        {data.slice(0, 5).map((product, index) => (
          <div key={product.productId} className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="max-w-24 truncate">{product.productName}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
