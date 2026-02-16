import { useQuery } from '@tanstack/react-query'
import { locationService } from '../services/locationService.ts'

export const warehouseKeys = {
  all: ['warehouses'] as const,
  detail: (id: string) => ['warehouses', id] as const,
} as const

export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.all,
    queryFn: locationService.getWarehouses,
  })
}
