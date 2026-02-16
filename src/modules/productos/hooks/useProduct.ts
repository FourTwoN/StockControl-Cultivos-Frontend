import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService.ts'

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.fetchProduct(id),
    enabled: id.length > 0,
  })
}
