import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Package, DollarSign, AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { FadeIn } from '@core/components/motion/FadeIn'
import { Card } from '@core/components/ui/Card'
import { StockBatchList } from '../components/StockBatchList.tsx'
import type { StockBatch } from '../types/StockBatch.ts'

interface KpiCardProps {
  readonly icon: React.ReactNode
  readonly label: string
  readonly value: string
  readonly subtitle?: string
  readonly accentClass: string
}

function KpiCard({ icon, label, value, subtitle, accentClass }: KpiCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className={cn('rounded-lg p-2', accentClass)}>{icon}</div>
        <div>
          <p className="text-xs font-medium uppercase text-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}

export function InventarioPage() {
  const navigate = useNavigate()

  const handleViewBatch = useCallback(
    (batch: StockBatch) => {
      void navigate(batch.id)
    },
    [navigate],
  )

  return (
    <AnimatedPage className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Inventory</h1>
        <p className="mt-1 text-sm text-muted">Manage stock batches and track inventory levels</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <FadeIn delay={0}>
          <KpiCard
            icon={<Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            label="Total Items"
            value="--"
            subtitle="Across all batches"
            accentClass="bg-blue-100 dark:bg-blue-900/30"
          />
        </FadeIn>
        <FadeIn delay={0.05}>
          <KpiCard
            icon={<DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
            label="Total Value"
            value="--"
            subtitle="Estimated valuation"
            accentClass="bg-emerald-100 dark:bg-emerald-900/30"
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <KpiCard
            icon={<AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
            label="Low Stock Alerts"
            value="--"
            subtitle="Below threshold"
            accentClass="bg-amber-100 dark:bg-amber-900/30"
          />
        </FadeIn>
      </div>

      <StockBatchList onView={handleViewBatch} />
    </AnimatedPage>
  )
}
