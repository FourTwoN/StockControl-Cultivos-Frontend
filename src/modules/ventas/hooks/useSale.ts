import { useQuery } from '@tanstack/react-query'
import { saleService } from '../services/saleService.ts'

export function useSale(id: string) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => saleService.fetchSale(id),
    enabled: id.length > 0,
  })
}
