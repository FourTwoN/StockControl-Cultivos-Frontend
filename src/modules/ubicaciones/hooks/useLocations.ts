import { useQuery } from '@tanstack/react-query'
import { locationService } from '../services/locationService.ts'

export const locationKeys = {
  all: ['locations'] as const,
  byArea: (areaId: string) => ['locations', { areaId }] as const,
} as const

/**
 * Fetches storage locations for a specific area.
 * The areaId is required in the new hierarchical API structure.
 */
export function useLocations(areaId?: string) {
  return useQuery({
    queryKey: areaId ? locationKeys.byArea(areaId) : locationKeys.all,
    queryFn: () => {
      if (!areaId) {
        return Promise.resolve([])
      }
      return locationService.getLocations(areaId)
    },
    enabled: Boolean(areaId),
  })
}
