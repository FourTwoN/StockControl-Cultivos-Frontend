import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService.ts'

export function useSalesSummary(period: 'monthly' | 'weekly') {
  return useQuery({
    queryKey: ['analytics', 'sales-summary', period],
    queryFn: () => analyticsService.fetchSalesSummary({ period }),
  })
}
