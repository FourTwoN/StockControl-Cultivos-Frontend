import { useQuery } from '@tanstack/react-query'
import { movementService } from '../services/movementService.ts'

interface UseMovementsParams {
  readonly batchId?: string
  readonly page: number
  readonly size: number
  readonly type?: string
  readonly startDate?: string
  readonly endDate?: string
}

export const MOVEMENTS_QUERY_KEY = 'stock-movements'

export function useMovements(params: UseMovementsParams) {
  return useQuery({
    queryKey: [
      MOVEMENTS_QUERY_KEY,
      params.batchId,
      params.page,
      params.size,
      params.type,
      params.startDate,
      params.endDate,
    ],
    queryFn: () => movementService.fetchMovements(params),
  })
}
