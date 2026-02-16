import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService.ts'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => userService.fetchCurrentUser(),
  })
}
