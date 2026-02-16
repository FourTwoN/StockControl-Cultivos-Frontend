import { useMutation, useQueryClient } from '@tanstack/react-query'
import { movementService } from '../services/movementService.ts'
import { STOCK_BATCHES_QUERY_KEY } from './useStockBatches.ts'
import { MOVEMENTS_QUERY_KEY } from './useMovements.ts'
import type { MovementRequest } from '../types/schemas.ts'

export function useCreateMovement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MovementRequest) => movementService.createMovement(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [STOCK_BATCHES_QUERY_KEY] })
      void queryClient.invalidateQueries({ queryKey: [MOVEMENTS_QUERY_KEY] })
    },
  })
}
