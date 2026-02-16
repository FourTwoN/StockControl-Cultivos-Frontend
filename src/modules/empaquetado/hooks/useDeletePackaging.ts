import { useMutation, useQueryClient } from '@tanstack/react-query'
import { packagingService } from '../services/packagingService.ts'
import { CATALOG_QUERY_KEY } from './usePackagingCatalog.ts'

export function useDeletePackaging() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => packagingService.deleteCatalogItem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CATALOG_QUERY_KEY] })
    },
  })
}
