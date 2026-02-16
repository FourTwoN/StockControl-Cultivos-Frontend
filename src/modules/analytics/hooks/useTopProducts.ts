import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService.ts'

export function useTopProducts(limit: number = 10) {
  return useQuery({
    queryKey: ['analytics', 'top-products', limit],
    queryFn: () => analyticsService.fetchTopProducts({ limit }),
  })
}
