import { useMutation, useQueryClient } from '@tanstack/react-query'
import { packagingService } from '../services/packagingService.ts'
import type { PackagingCatalogFormData } from '../types/schemas.ts'
import { CATALOG_QUERY_KEY } from './usePackagingCatalog.ts'

export function useCreatePackaging() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PackagingCatalogFormData) => packagingService.createCatalogItem(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CATALOG_QUERY_KEY] })
    },
  })
}
