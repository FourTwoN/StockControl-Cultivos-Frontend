import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PriceListFormData } from '../types/schemas.ts'
import { createPriceList } from '../services/priceService.ts'
import { priceListKeys } from './usePriceLists.ts'

export function useCreatePriceList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PriceListFormData) => createPriceList(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: priceListKeys.all })
    },
  })
}
