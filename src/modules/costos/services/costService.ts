import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { ProductCost, BatchCost, InventoryValuation, CostTrend } from '../types/Cost.ts'

interface CostTrendParams {
  readonly productId: string
  readonly from?: string
  readonly to?: string
}

export const costService = {
  fetchProductCosts: (page: number, size: number) =>
    apiClient
      .get<PagedResponse<ProductCost>>('/api/v1/costs/products', {
        params: { page, size },
      })
      .then((r) => r.data),

  fetchBatchCost: (batchId: string) =>
    apiClient.get<BatchCost>(`/api/v1/costs/batches/${batchId}`).then((r) => r.data),

  fetchInventoryValuation: () =>
    apiClient.get<InventoryValuation>('/api/v1/costs/valuation').then((r) => r.data),

  fetchCostTrends: (params: CostTrendParams) =>
    apiClient
      .get<CostTrend[]>('/api/v1/costs/trends', {
        params: {
          productId: params.productId,
          ...(params.from ? { from: params.from } : {}),
          ...(params.to ? { to: params.to } : {}),
        },
      })
      .then((r) => r.data),
}
