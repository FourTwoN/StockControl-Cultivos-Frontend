import { useQuery } from '@tanstack/react-query'
import { stockService } from '../services/stockService.ts'

export function useStockBatch(id: string) {
  return useQuery({
    queryKey: ['stock-batches', id],
    queryFn: () => stockService.fetchBatchById(id),
    enabled: id.length > 0,
  })
}
