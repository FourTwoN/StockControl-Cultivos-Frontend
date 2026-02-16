import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { StockMovement } from '../types/StockMovement.ts'
import type { MovementRequest } from '../types/schemas.ts'

const BASE_PATH = '/api/v1/stock-movements'

interface FetchMovementsParams {
  readonly batchId?: string
  readonly page: number
  readonly size: number
  readonly type?: string
  readonly startDate?: string
  readonly endDate?: string
}

async function fetchMovements(params: FetchMovementsParams): Promise<PagedResponse<StockMovement>> {
  const { batchId, page, size, type, startDate, endDate } = params
  const queryParams: Record<string, string | number> = { page, size }

  if (batchId) {
    queryParams.batchId = batchId
  }
  if (type) {
    queryParams.type = type
  }
  if (startDate) {
    queryParams.startDate = startDate
  }
  if (endDate) {
    queryParams.endDate = endDate
  }

  const response = await apiClient.get<PagedResponse<StockMovement>>(BASE_PATH, {
    params: queryParams,
  })
  return response.data
}

async function createMovement(data: MovementRequest): Promise<StockMovement> {
  const response = await apiClient.post<StockMovement>(BASE_PATH, data)
  return response.data
}

export const movementService = {
  fetchMovements,
  createMovement,
} as const
