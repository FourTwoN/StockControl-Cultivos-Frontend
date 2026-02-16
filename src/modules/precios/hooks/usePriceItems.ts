import { useQuery } from '@tanstack/react-query'
import { fetchPriceItems } from '../services/priceService.ts'
import { priceListKeys } from './usePriceLists.ts'

export function usePriceItems(listId: string) {
  return useQuery({
    queryKey: priceListKeys.items(listId),
    queryFn: () => fetchPriceItems(listId),
    enabled: listId.length > 0,
  })
}
