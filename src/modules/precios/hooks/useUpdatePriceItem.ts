import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PriceItemFormData } from '../types/schemas.ts'
import { updatePriceItem } from '../services/priceService.ts'
import { priceListKeys } from './usePriceLists.ts'

interface UpdatePriceItemParams {
  readonly listId: string
  readonly itemId: string
  readonly data: PriceItemFormData
}

export function useUpdatePriceItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, itemId, data }: UpdatePriceItemParams) =>
      updatePriceItem(listId, itemId, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({
        queryKey: priceListKeys.items(variables.listId),
      })
    },
  })
}
