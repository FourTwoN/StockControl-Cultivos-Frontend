import { useQuery } from '@tanstack/react-query'
import { locationService } from '../services/locationService.ts'

export const binKeys = {
  all: ['bins'] as const,
  byLocation: (locationId: string) => ['bins', locationId] as const,
} as const

export function useBins(locationId: string) {
  return useQuery({
    queryKey: binKeys.byLocation(locationId),
    queryFn: () => locationService.getBins(locationId),
    enabled: locationId.length > 0,
  })
}
