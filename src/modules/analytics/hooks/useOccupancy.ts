import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService.ts'

export function useOccupancy() {
  return useQuery({
    queryKey: ['analytics', 'occupancy'],
    queryFn: () => analyticsService.fetchOccupancy(),
  })
}
