import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService.ts'

export function useDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsService.fetchDashboard(),
  })
}
