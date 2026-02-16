import { apiClient } from '@core/api/apiClient'
import type { Category, ProductFamily } from '../types/Product.ts'
import type { CategoryFormData, FamilyFormData } from '../types/schemas.ts'

export const categoryService = {
  fetchCategories: () => apiClient.get<Category[]>('/api/v1/categories').then((r) => r.data),

  createCategory: (data: CategoryFormData) =>
    apiClient.post<Category>('/api/v1/categories', data).then((r) => r.data),

  updateCategory: (id: string, data: CategoryFormData) =>
    apiClient.put<Category>(`/api/v1/categories/${id}`, data).then((r) => r.data),

  deleteCategory: (id: string) =>
    apiClient.delete<void>(`/api/v1/categories/${id}`).then((r) => r.data),
}

export const familyService = {
  fetchFamilies: () => apiClient.get<ProductFamily[]>('/api/v1/families').then((r) => r.data),

  createFamily: (data: FamilyFormData) =>
    apiClient.post<ProductFamily>('/api/v1/families', data).then((r) => r.data),

  updateFamily: (id: string, data: FamilyFormData) =>
    apiClient.put<ProductFamily>(`/api/v1/families/${id}`, data).then((r) => r.data),

  deleteFamily: (id: string) =>
    apiClient.delete<void>(`/api/v1/families/${id}`).then((r) => r.data),
}
