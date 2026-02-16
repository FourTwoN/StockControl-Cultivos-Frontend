import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { User } from '../types/User.ts'
import type { UserFormData } from '../types/schemas.ts'

export const userService = {
  fetchUsers: (page: number, size: number) =>
    apiClient
      .get<PagedResponse<User>>('/api/v1/users', {
        params: { page, size },
      })
      .then((r) => r.data),

  fetchUser: (id: string) => apiClient.get<User>(`/api/v1/users/${id}`).then((r) => r.data),

  fetchCurrentUser: () => apiClient.get<User>('/api/v1/users/me').then((r) => r.data),

  createUser: (data: UserFormData) =>
    apiClient.post<User>('/api/v1/users', data).then((r) => r.data),

  updateUser: (id: string, data: UserFormData) =>
    apiClient.put<User>(`/api/v1/users/${id}`, data).then((r) => r.data),

  deleteUser: (id: string) => apiClient.delete<void>(`/api/v1/users/${id}`).then((r) => r.data),
}
