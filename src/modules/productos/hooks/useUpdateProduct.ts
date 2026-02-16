import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/productService.ts'
import type { ProductFormData } from '../types/schemas.ts'

interface UpdateProductArgs {
  readonly id: string
  readonly data: ProductFormData
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductArgs) => productService.updateProduct(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      void queryClient.invalidateQueries({
        queryKey: ['products', variables.id],
      })
    },
  })
}
