import { Tabs, TabsList, TabsTrigger, TabsContent } from '@core/components/ui'
import { AnimatedPage } from '@core/components/motion'
import { Dashboard } from '../components/Dashboard.tsx'
import { ExecutiveSummary } from '../components/sections/ExecutiveSummary.tsx'
import { WarehouseScorecard } from '../components/sections/WarehouseScorecard.tsx'
import { TopProductsChart } from '../components/sections/TopProductsChart.tsx'
import { ValuationDonutChart } from '../components/sections/ValuationDonutChart.tsx'
import { StockChart } from '../components/StockChart.tsx'
import { SalesChart } from '../components/SalesChart.tsx'
import { useStockHistory } from '../hooks/useStockHistory.ts'
import { useSalesSummary } from '../hooks/useSalesSummary.ts'
import { useTrendsDateRange } from '../hooks/useTrendsDateRange.ts'

function TrendsTab() {
  const { dateRange, salesPeriod, handleFromChange, handleToChange, handlePeriodChange } =
    useTrendsDateRange()

  const stockHistory = useStockHistory(dateRange.from, dateRange.to)
  const salesSummary = useSalesSummary(salesPeriod)

  const stockHistoryData = Array.isArray(stockHistory.data) ? stockHistory.data : []
  const salesSummaryData = Array.isArray(salesSummary.data) ? salesSummary.data : []

  return (
    <div className="flex flex-col gap-6">
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

      <StockChart data={stockHistoryData} isLoading={stockHistory.isLoading} />
      <SalesChart data={salesSummaryData} isLoading={salesSummary.isLoading} />
    </div>
  )
}

export function AnalyticsPage() {
  return (
    <AnimatedPage>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Analytics</h1>
          <p className="mt-1 text-sm text-muted">
            Monitor stock levels, sales performance, and warehouse occupancy
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="flex flex-col gap-6">
              <ExecutiveSummary />
              <Dashboard />
            </div>
          </TabsContent>

          <TabsContent value="warehouses">
            <WarehouseScorecard />
          </TabsContent>

          <TabsContent value="products">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TopProductsChart />
              <ValuationDonutChart />
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <TrendsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  )
}
