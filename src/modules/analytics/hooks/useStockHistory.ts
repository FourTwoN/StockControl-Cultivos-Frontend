import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService.ts'

export function useStockHistory(from: string, to: string) {
  return useQuery({
    queryKey: ['analytics', 'stock-history', from, to],
    queryFn: () => analyticsService.fetchStockHistory({ from, to }),
    enabled: from.length > 0 && to.length > 0,
  })
}
