import { useQuery } from '@tanstack/react-query'
import { packagingService } from '../services/packagingService.ts'

const COLORS_QUERY_KEY = 'packaging-colors'

export function usePackagingColors() {
  return useQuery({
    queryKey: [COLORS_QUERY_KEY],
    queryFn: () => packagingService.getColors(),
  })
}

export { COLORS_QUERY_KEY }
