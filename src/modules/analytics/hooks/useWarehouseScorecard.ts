import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService.ts'

export function useWarehouseScorecard() {
  return useQuery({
    queryKey: ['analytics', 'warehouse-scorecard'],
    queryFn: () => analyticsService.fetchWarehouseScorecard(),
  })
}
