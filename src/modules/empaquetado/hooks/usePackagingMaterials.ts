import { useQuery } from '@tanstack/react-query'
import { packagingService } from '../services/packagingService.ts'

const MATERIALS_QUERY_KEY = 'packaging-materials'

export function usePackagingMaterials() {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY],
    queryFn: () => packagingService.getMaterials(),
  })
}

export { MATERIALS_QUERY_KEY }
