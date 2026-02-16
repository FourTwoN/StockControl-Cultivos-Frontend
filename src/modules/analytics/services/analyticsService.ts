import { apiClient } from '@core/api/apiClient'
import type {
  DashboardData,
  StockHistoryPoint,
  SalesSummaryPoint,
  TopProduct,
  WarehouseOccupancy,
  KPI,
  WarehouseScorecardEntry,
  GlobalProductAnalytics,
} from '../types/Analytics.ts'

interface StockHistoryParams {
  readonly from: string
  readonly to: string
}

interface SalesSummaryParams {
  readonly period: 'monthly' | 'weekly'
}

interface TopProductsParams {
  readonly limit?: number
}

export const analyticsService = {
  fetchDashboard: () =>
    apiClient.get<DashboardData>('/api/v1/analytics/dashboard').then((r) => r.data),

  fetchStockHistory: (params: StockHistoryParams) =>
    apiClient
      .get<StockHistoryPoint[]>('/api/v1/analytics/stock-history', {
        params: { from: params.from, to: params.to },
      })
      .then((r) => r.data),

  fetchSalesSummary: (params: SalesSummaryParams) =>
    apiClient
      .get<SalesSummaryPoint[]>('/api/v1/analytics/sales-summary', {
        params: { period: params.period },
      })
      .then((r) => r.data),

  fetchTopProducts: (params?: TopProductsParams) =>
    apiClient
      .get<TopProduct[]>('/api/v1/analytics/top-products', {
        params: { limit: params?.limit ?? 10 },
      })
      .then((r) => r.data),

  fetchOccupancy: () =>
    apiClient.get<WarehouseOccupancy[]>('/api/v1/analytics/location-occupancy').then((r) => r.data),

  fetchKPIs: () => apiClient.get<KPI[]>('/api/v1/analytics/kpis').then((r) => r.data),

  fetchWarehouseScorecard: () =>
    apiClient
      .get<WarehouseScorecardEntry[]>('/api/v1/analytics/warehouse-scorecard')
      .then((r) => r.data),

  fetchGlobalProductAnalytics: () =>
    apiClient
      .get<GlobalProductAnalytics>('/api/v1/analytics/global-product-analytics')
      .then((r) => r.data),
}
