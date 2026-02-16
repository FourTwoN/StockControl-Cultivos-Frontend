import { useQuery } from '@tanstack/react-query'
import { chatService } from '../services/chatService.ts'

export function useChatMessages(sessionId: string) {
  return useQuery({
    queryKey: ['chat-messages', sessionId],
    queryFn: () => chatService.fetchMessages(sessionId),
    enabled: sessionId.length > 0,
  })
}
