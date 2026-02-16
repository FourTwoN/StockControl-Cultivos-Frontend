import { useMutation, useQueryClient } from '@tanstack/react-query'
import { packagingService } from '../services/packagingService.ts'
import type { PackagingCatalogFormData } from '../types/schemas.ts'
import { CATALOG_QUERY_KEY } from './usePackagingCatalog.ts'

interface UpdatePackagingParams {
  readonly id: string
  readonly data: PackagingCatalogFormData
}

export function useUpdatePackaging() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdatePackagingParams) =>
      packagingService.updateCatalogItem(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CATALOG_QUERY_KEY] })
    },
  })
}
