import { useQuery } from '@tanstack/react-query'
import { photoService } from '../services/photoService.ts'

export function usePhotoSessions(page: number, size: number) {
  return useQuery({
    queryKey: ['photo-sessions', page, size],
    queryFn: () => photoService.fetchSessions(page, size),
  })
}
