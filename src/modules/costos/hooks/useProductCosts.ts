import { useQuery } from '@tanstack/react-query'
import { costService } from '../services/costService.ts'

export function useProductCosts(page: number, size: number) {
  return useQuery({
    queryKey: ['costs', 'products', page, size],
    queryFn: () => costService.fetchProductCosts(page, size),
  })
}
