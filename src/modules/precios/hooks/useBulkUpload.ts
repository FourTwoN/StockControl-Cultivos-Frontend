import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bulkUploadItems } from '../services/priceService.ts'
import { priceListKeys } from './usePriceLists.ts'

interface BulkUploadParams {
  readonly listId: string
  readonly file: File
}

export function useBulkUpload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, file }: BulkUploadParams) => bulkUploadItems(listId, file),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({
        queryKey: priceListKeys.items(variables.listId),
      })
      void queryClient.invalidateQueries({
        queryKey: priceListKeys.detail(variables.listId),
      })
    },
  })
}
