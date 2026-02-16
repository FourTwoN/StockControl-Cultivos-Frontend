import { useQuery } from '@tanstack/react-query'
import { locationService } from '../services/locationService.ts'
import { warehouseKeys } from './useWarehouses.ts'

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: () => locationService.getWarehouse(id),
    enabled: id.length > 0,
  })
}
