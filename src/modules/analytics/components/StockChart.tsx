import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { Card, Skeleton } from '@core/components/ui'
import type { StockHistoryPoint } from '../types/Analytics.ts'

interface StockChartProps {
  readonly data: readonly StockHistoryPoint[]
  readonly isLoading: boolean
}

const numberFormatter = new Intl.NumberFormat('en-US')

function formatXAxisDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM dd')
}

function formatTooltipValue(value: number): string {
  return numberFormatter.format(value)
}

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
      <p className="mb-2 text-xs font-medium text-muted">
        {format(parseISO(label), 'MMM dd, yyyy')}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted">{entry.name}:</span>
          <span className="font-medium text-primary">{formatTooltipValue(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function StockChart({ data, isLoading }: StockChartProps) {
  if (isLoading) {
    return (
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-primary">Stock History</h3>
        <Skeleton className="h-64 w-full" variant="rectangle" />
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-primary">Stock History</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={[...data]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisDate}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis tickFormatter={formatTooltipValue} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="totalQuantity"
            name="Total"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="activeQuantity"
            name="Active"
            stackId="2"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="depletedQuantity"
            name="Depleted"
            stackId="3"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
