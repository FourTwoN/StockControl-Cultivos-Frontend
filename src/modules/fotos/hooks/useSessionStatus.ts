import { useQuery } from '@tanstack/react-query'
import { photoService } from '../services/photoService.ts'
import type { ProcessingStatus } from '../types/Photo.ts'

function isTerminalStatus(status: ProcessingStatus['status']): boolean {
  return status === 'COMPLETED' || status === 'FAILED'
}

export function useSessionStatus(sessionId: string) {
  return useQuery({
    queryKey: ['photo-sessions', sessionId, 'status'],
    queryFn: () => photoService.fetchSessionStatus(sessionId),
    enabled: sessionId.length > 0,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data && isTerminalStatus(data.status)) {
        return false
      }
      return 3000
    },
  })
}
