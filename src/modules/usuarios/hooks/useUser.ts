import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService.ts'

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.fetchUser(id),
    enabled: id.length > 0,
  })
}
