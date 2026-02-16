import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService.ts'
import type { UserFormData } from '../types/schemas.ts'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { readonly id: string; readonly data: UserFormData }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
