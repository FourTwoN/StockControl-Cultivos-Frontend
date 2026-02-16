import { useQuery } from '@tanstack/react-query'
import { chatService } from '../services/chatService.ts'

export function useChatSessions() {
  return useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => chatService.fetchSessions(),
  })
}
