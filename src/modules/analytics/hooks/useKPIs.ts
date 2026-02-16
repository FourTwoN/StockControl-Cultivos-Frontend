import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService.ts'

export function useKPIs() {
  return useQuery({
    queryKey: ['analytics', 'kpis'],
    queryFn: () => analyticsService.fetchKPIs(),
  })
}
