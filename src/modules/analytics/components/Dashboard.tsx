import { useState, useMemo, useCallback } from 'react'
import { format, subDays } from 'date-fns'
import { BarChart3 } from 'lucide-react'
import { Skeleton, EmptyState } from '@core/components/ui'
import { KPICard } from './KPICard.tsx'
import { StockChart } from './StockChart.tsx'
import { SalesChart } from './SalesChart.tsx'
import { TopProductsWidget } from './TopProductsWidget.tsx'
import { OccupancyWidget } from './OccupancyWidget.tsx'
import { ExportButton } from './ExportButton.tsx'
import { useKPIs } from '../hooks/useKPIs.ts'
import { useStockHistory } from '../hooks/useStockHistory.ts'
import { useSalesSummary } from '../hooks/useSalesSummary.ts'
import { useTopProducts } from '../hooks/useTopProducts.ts'
import { useOccupancy } from '../hooks/useOccupancy.ts'
import type { SalesSummaryPoint, StockHistoryPoint } from '../types/Analytics.ts'

type SalesPeriod = 'monthly' | 'weekly'

function toExportableStock(
  data: readonly StockHistoryPoint[],
): readonly Record<string, unknown>[] {
  return data.map((point) => ({
    date: point.date,
    totalQuantity: point.totalQuantity,
    activeQuantity: point.activeQuantity,
    depletedQuantity: point.depletedQuantity,
  }))
}

function toExportableSales(
  data: readonly SalesSummaryPoint[],
): readonly Record<string, unknown>[] {
  return data.map((point) => ({
    period: point.period,
    totalSales: point.totalSales,
    totalRevenue: point.totalRevenue,
    averageOrderValue: point.averageOrderValue,
  }))
}

function KPISkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`kpi-skeleton-${i}`}
          className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  )
}

export function Dashboard() {
  const [dateRange, setDateRange] = useState(() => ({
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  }))

  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>('monthly')

  const kpis = useKPIs()
  const stockHistory = useStockHistory(dateRange.from, dateRange.to)
  const salesSummary = useSalesSummary(salesPeriod)
  const topProducts = useTopProducts()
  const occupancy = useOccupancy()

  const handleFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, from: e.target.value }))
  }, [])

  const handleToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, to: e.target.value }))
  }, [])

  const handlePeriodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSalesPeriod(e.target.value as SalesPeriod)
  }, [])

  const kpisData = Array.isArray(kpis.data) ? kpis.data : []
  const stockHistoryData = Array.isArray(stockHistory.data) ? stockHistory.data : []
  const salesSummaryData = Array.isArray(salesSummary.data) ? salesSummary.data : []
  const topProductsData = Array.isArray(topProducts.data) ? topProducts.data : []
  const occupancyData = Array.isArray(occupancy.data) ? occupancy.data : []

  const stockExportData = useMemo(
    () => toExportableStock(stockHistoryData),
    [stockHistoryData],
  )

  const salesExportData = useMemo(
    () => toExportableSales(salesSummaryData),
    [salesSummaryData],
  )

  const hasNoData =
    !kpis.isLoading && !kpisData.length && !stockHistory.isLoading && !stockHistoryData.length

  if (hasNoData) {
    return (
      <EmptyState
        icon={<BarChart3 className="h-8 w-8" />}
        title="No analytics data"
        description="Analytics data will appear here once you start recording stock and sales activity."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Date range & controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium text-muted">From</span>
            <input
              type="date"
              value={dateRange.from}
              onChange={handleFromChange}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-primary focus:outline-2 focus:outline-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium text-muted">To</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={handleToChange}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-primary focus:outline-2 focus:outline-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium text-muted">Sales Period</span>
            <select
              value={salesPeriod}
              onChange={handlePeriodChange}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-primary focus:outline-2 focus:outline-primary"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
        </div>
        <div className="flex gap-2">
          <ExportButton data={stockExportData} filename="stock-history" />
          <ExportButton data={salesExportData} filename="sales-summary" />
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      {kpis.isLoading ? (
        <KPISkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpisData.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      )}

      {/* Row 2: Stock Chart (span 2) + Occupancy */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StockChart data={stockHistoryData} isLoading={stockHistory.isLoading} />
        </div>
        <OccupancyWidget data={occupancyData} isLoading={occupancy.isLoading} />
      </div>

      {/* Row 3: Sales Chart (span 2) + Top Products */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart data={salesSummaryData} isLoading={salesSummary.isLoading} />
        </div>
        <TopProductsWidget data={topProductsData} isLoading={topProducts.isLoading} />
      </div>
    </div>
  )
}
