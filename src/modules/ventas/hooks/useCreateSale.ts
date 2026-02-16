import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saleService } from '../services/saleService.ts'
import type { SaleFormData } from '../types/schemas.ts'

export function useCreateSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SaleFormData) => saleService.createSale(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })
}
