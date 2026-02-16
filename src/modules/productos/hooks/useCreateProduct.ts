import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/productService.ts'
import type { ProductFormData } from '../types/schemas.ts'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProductFormData) => productService.createProduct(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
