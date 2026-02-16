import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService.ts'

export function useUsers(page: number, size: number) {
  return useQuery({
    queryKey: ['users', page, size],
    queryFn: () => userService.fetchUsers(page, size),
  })
}
