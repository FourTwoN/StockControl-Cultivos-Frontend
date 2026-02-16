import { useQuery } from '@tanstack/react-query'
import { stockService } from '../services/stockService.ts'

interface UseStockBatchesParams {
  readonly page: number
  readonly size: number
  readonly productId?: string
  readonly locationId?: string
  readonly status?: string
}

export const STOCK_BATCHES_QUERY_KEY = 'stock-batches'

export function useStockBatches(params: UseStockBatchesParams) {
  return useQuery({
    queryKey: [
      STOCK_BATCHES_QUERY_KEY,
      params.page,
      params.size,
      params.productId,
      params.locationId,
      params.status,
    ],
    queryFn: () => stockService.fetchBatches(params),
  })
}
