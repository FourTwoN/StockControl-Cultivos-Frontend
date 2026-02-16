import { useQuery } from '@tanstack/react-query'
import { packagingService } from '../services/packagingService.ts'

const TYPES_QUERY_KEY = 'packaging-types'

export function usePackagingTypes() {
  return useQuery({
    queryKey: [TYPES_QUERY_KEY],
    queryFn: () => packagingService.getTypes(),
  })
}

export { TYPES_QUERY_KEY }
