import { useMutation, useQueryClient } from '@tanstack/react-query'
import { photoService } from '../services/photoService.ts'

interface UploadParams {
  readonly sessionId: string
  readonly file: File
}

/**
 * Uploads a photo to a specific session.
 * The sessionId is required in the new API structure.
 */
export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, file }: UploadParams) => photoService.uploadPhoto(sessionId, file),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['photo-sessions'] })
      void queryClient.invalidateQueries({ queryKey: ['photo-session', variables.sessionId] })
    },
  })
}
