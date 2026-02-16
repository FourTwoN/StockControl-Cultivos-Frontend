import { Card } from '@core/components/ui/Card'
import { TrendingUp } from 'lucide-react'

interface CostTrendChartProps {
  readonly productId?: string
}

export function CostTrendChart({ productId }: CostTrendChartProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-muted" />
        <h3 className="text-lg font-semibold text-primary">Cost Trends</h3>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/5">
        <div className="text-center">
          <TrendingUp className="mx-auto h-10 w-10 text-muted/40" />
          <p className="mt-2 text-sm text-muted">Cost trend chart - Recharts integration pending</p>
          {productId && <p className="mt-1 text-xs text-muted/60">Product ID: {productId}</p>}
        </div>
      </div>
    </Card>
  )
}
