import { useMutation, useQueryClient } from '@tanstack/react-query'
import { photoService } from '../services/photoService.ts'

interface CreateSessionData {
  readonly name: string
  readonly description?: string
}

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSessionData) => photoService.createSession(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['photo-sessions'] })
    },
  })
}
