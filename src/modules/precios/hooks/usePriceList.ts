import { useQuery } from '@tanstack/react-query'
import { fetchPriceList } from '../services/priceService.ts'
import { priceListKeys } from './usePriceLists.ts'

export function usePriceList(id: string) {
  return useQuery({
    queryKey: priceListKeys.detail(id),
    queryFn: () => fetchPriceList(id),
    enabled: id.length > 0,
  })
}
