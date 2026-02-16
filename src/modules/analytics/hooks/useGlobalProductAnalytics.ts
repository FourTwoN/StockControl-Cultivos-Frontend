import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService.ts'

export function useGlobalProductAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'global-product-analytics'],
    queryFn: () => analyticsService.fetchGlobalProductAnalytics(),
  })
}
