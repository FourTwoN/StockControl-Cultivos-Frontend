import { useQuery } from '@tanstack/react-query'
import { photoService } from '../services/photoService.ts'

export function useSessionImages(sessionId: string) {
  return useQuery({
    queryKey: ['photo-sessions', sessionId, 'images'],
    queryFn: () => photoService.fetchSessionImages(sessionId),
    enabled: sessionId.length > 0,
  })
}
