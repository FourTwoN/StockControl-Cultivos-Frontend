import { useQuery } from '@tanstack/react-query'
import { costService } from '../services/costService.ts'

export function useBatchCost(batchId: string) {
  return useQuery({
    queryKey: ['costs', 'batches', batchId],
    queryFn: () => costService.fetchBatchCost(batchId),
    enabled: batchId.length > 0,
  })
}
