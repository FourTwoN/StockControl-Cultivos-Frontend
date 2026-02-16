import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService.ts'

export function useProducts(page: number, size: number, search?: string) {
  return useQuery({
    queryKey: ['products', page, size, search],
    queryFn: () => productService.fetchProducts(page, size, search),
  })
}
