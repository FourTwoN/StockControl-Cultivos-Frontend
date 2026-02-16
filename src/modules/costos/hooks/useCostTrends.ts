import { useQuery } from '@tanstack/react-query'
import { costService } from '../services/costService.ts'

interface UseCostTrendsParams {
  readonly productId: string
  readonly from?: string
  readonly to?: string
}

export function useCostTrends(params: UseCostTrendsParams) {
  return useQuery({
    queryKey: ['costs', 'trends', params],
    queryFn: () => costService.fetchCostTrends(params),
    enabled: params.productId.length > 0,
  })
}
