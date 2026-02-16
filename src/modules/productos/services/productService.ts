import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { Product } from '../types/Product.ts'
import type { ProductFormData } from '../types/schemas.ts'

export const productService = {
  fetchProducts: (page: number, size: number, search?: string) =>
    apiClient
      .get<PagedResponse<Product>>('/api/v1/products', {
        params: { page, size, ...(search ? { search } : {}) },
      })
      .then((r) => r.data),

  fetchProduct: (id: string) =>
    apiClient.get<Product>(`/api/v1/products/${id}`).then((r) => r.data),

  createProduct: (data: ProductFormData) =>
    apiClient.post<Product>('/api/v1/products', data).then((r) => r.data),

  updateProduct: (id: string, data: ProductFormData) =>
    apiClient.put<Product>(`/api/v1/products/${id}`, data).then((r) => r.data),

  deleteProduct: (id: string) =>
    apiClient.delete<void>(`/api/v1/products/${id}`).then((r) => r.data),
}
