export type {
  DashboardData,
  StockHistoryPoint,
  SalesSummaryPoint,
  TopProduct,
  WarehouseOccupancy,
  KPI,
  WarehouseScorecardEntry,
  ProductValuation,
  GlobalProductAnalytics,
} from './types/Analytics.ts'
export { analyticsService } from './services/analyticsService.ts'
export { useDashboard } from './hooks/useDashboard.ts'
export { useStockHistory } from './hooks/useStockHistory.ts'
export { useSalesSummary } from './hooks/useSalesSummary.ts'
export { useTopProducts } from './hooks/useTopProducts.ts'
export { useOccupancy } from './hooks/useOccupancy.ts'
export { useKPIs } from './hooks/useKPIs.ts'
export { useWarehouseScorecard } from './hooks/useWarehouseScorecard.ts'
export { useGlobalProductAnalytics } from './hooks/useGlobalProductAnalytics.ts'
