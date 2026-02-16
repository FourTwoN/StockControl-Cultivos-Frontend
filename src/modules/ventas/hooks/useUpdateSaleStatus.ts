import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saleService } from '../services/saleService.ts'
import type { Sale } from '../types/Sale.ts'

export function useUpdateSaleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { readonly id: string; readonly status: Sale['status'] }) =>
      saleService.updateSaleStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })
}
