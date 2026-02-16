import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { ValuationSummary } from '../components/ValuationSummary.tsx'
import { CostTable } from '../components/CostTable.tsx'

export function CostosPage() {
  return (
    <AnimatedPage className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Costs</h1>
        <p className="mt-1 text-sm text-muted">Inventory valuation and product cost analysis</p>
      </div>

      <div className="flex flex-col gap-6">
        <ValuationSummary />
        <CostTable />
      </div>
    </AnimatedPage>
  )
}
