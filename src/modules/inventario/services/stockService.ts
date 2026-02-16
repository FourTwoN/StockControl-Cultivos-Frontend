import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { StockBatch } from '../types/StockBatch.ts'

const BASE_PATH = '/api/v1/stock-batches'

interface FetchBatchesParams {
  readonly page: number
  readonly size: number
  readonly productId?: string
  readonly locationId?: string
  readonly status?: string
}

async function fetchBatches(params: FetchBatchesParams): Promise<PagedResponse<StockBatch>> {
  const { page, size, productId, locationId, status } = params
  const queryParams: Record<string, string | number> = { page, size }

  if (productId) {
    queryParams.productId = productId
  }
  if (locationId) {
    queryParams.locationId = locationId
  }
  if (status) {
    queryParams.status = status
  }

  const response = await apiClient.get<PagedResponse<StockBatch>>(BASE_PATH, {
    params: queryParams,
  })
  return response.data
}

async function fetchBatchById(id: string): Promise<StockBatch> {
  const response = await apiClient.get<StockBatch>(`${BASE_PATH}/${id}`)
  return response.data
}

export const stockService = {
  fetchBatches,
  fetchBatchById,
} as const
