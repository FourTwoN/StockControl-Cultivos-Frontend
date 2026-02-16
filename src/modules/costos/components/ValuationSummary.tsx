import { useMemo } from 'react'
import { DollarSign, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeIn } from '@core/components/motion/FadeIn'
import { Card } from '@core/components/ui/Card'
import { Skeleton } from '@core/components/ui/Skeleton'
import { useInventoryValuation } from '../hooks/useInventoryValuation.ts'
import type { CategoryValuation } from '../types/Cost.ts'

const DEFAULT_CURRENCY = 'ARS'

function formatCurrency(amount: number | null | undefined, currency: string | null | undefined): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || DEFAULT_CURRENCY,
  }).format(amount ?? 0)
}

const CATEGORY_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500',
] as const

function getCategoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}

interface CategoryBarProps {
  readonly category: CategoryValuation
  readonly colorClass: string
  readonly currency: string | null
}

function CategoryBar({ category, colorClass, currency }: CategoryBarProps) {
  const percentage = category.percentage ?? 0

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded-full', colorClass)} />
          <span className="font-medium text-primary">{category.categoryName}</span>
        </div>
        <span className="text-muted">
          {formatCurrency(category.totalValue, currency)} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/20">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClass)}
          style={{ width: `${Math.max(percentage, 1)}%` }}
        />
      </div>
    </div>
  )
}

export function ValuationSummary() {
  const { data: valuation, isLoading } = useInventoryValuation()

  const sortedCategories = useMemo(
    () =>
      valuation
        ? [...valuation.byCategory].sort((a, b) => (b.totalValue ?? 0) - (a.totalValue ?? 0))
        : [],
    [valuation],
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-32" variant="rectangle" />
        <Skeleton className="h-32" variant="rectangle" />
        <Skeleton className="h-32 lg:col-span-1" variant="rectangle" />
      </div>
    )
  }

  if (!valuation) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <FadeIn delay={0}>
        <Card>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted">Total Inventory Value</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {formatCurrency(valuation.totalValue, valuation.currency)}
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted">Total Units</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {new Intl.NumberFormat('es-AR').format(valuation.totalUnits ?? 0)}
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card className="lg:col-span-1">
          <p className="mb-3 text-xs font-medium uppercase text-muted">Value by Category</p>
          <div className="flex flex-col gap-3">
            {sortedCategories.map((category, index) => (
              <CategoryBar
                key={category.categoryId}
                category={category}
                colorClass={getCategoryColor(index)}
                currency={valuation.currency}
              />
            ))}
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}
