import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService.ts'
import type { UserFormData } from '../types/schemas.ts'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserFormData) => userService.createUser(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
