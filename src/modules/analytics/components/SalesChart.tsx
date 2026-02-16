import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Skeleton } from '@core/components/ui'
import type { SalesSummaryPoint } from '../types/Analytics.ts'

interface SalesChartProps {
  readonly data: readonly SalesSummaryPoint[]
  readonly isLoading: boolean
}

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
  readonly color: string
}

interface CustomTooltipProps {
  readonly active?: boolean
  readonly payload?: readonly TooltipPayloadEntry[]
  readonly label?: string
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0 || !label) {
    return null
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-3 shadow-md">
      <p className="mb-2 text-xs font-medium text-muted">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted">{entry.name}:</span>
          <span className="font-medium text-primary">
            {entry.name === 'Revenue'
              ? currencyFormatter.format(entry.value)
              : numberFormatter.format(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function SalesChart({ data, isLoading }: SalesChartProps) {
  if (isLoading) {
    return (
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-primary">Sales Summary</h3>
        <Skeleton className="h-64 w-full" variant="rectangle" />
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-primary">Sales Summary</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={[...data]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis
            yAxisId="sales"
            orientation="left"
            tickFormatter={(v: number) => numberFormatter.format(v)}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis
            yAxisId="revenue"
            orientation="right"
            tickFormatter={(v: number) => currencyFormatter.format(v)}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            yAxisId="sales"
            dataKey="totalSales"
            name="Sales"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="revenue"
            dataKey="totalRevenue"
            name="Revenue"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
