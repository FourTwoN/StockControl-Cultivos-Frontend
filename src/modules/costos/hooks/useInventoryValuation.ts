import { useQuery } from '@tanstack/react-query'
import { costService } from '../services/costService.ts'

export function useInventoryValuation() {
  return useQuery({
    queryKey: ['costs', 'valuation'],
    queryFn: () => costService.fetchInventoryValuation(),
  })
}
