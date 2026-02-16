import { useQuery } from '@tanstack/react-query'
import { photoService } from '../services/photoService.ts'

export function usePhotoSession(id: string) {
  return useQuery({
    queryKey: ['photo-sessions', id],
    queryFn: () => photoService.fetchSession(id),
    enabled: id.length > 0,
  })
}
