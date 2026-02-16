import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { Sale } from '../types/Sale.ts'
import type { SaleFormData } from '../types/schemas.ts'

const BASE_PATH = '/api/v1/sales'

interface SaleFilters {
  readonly status?: Sale['status']
  readonly from?: string
  readonly to?: string
}

export const saleService = {
  fetchSales: (page: number, size: number, filters?: SaleFilters) =>
    apiClient
      .get<PagedResponse<Sale>>(BASE_PATH, {
        params: {
          page,
          size,
          ...(filters?.status ? { status: filters.status } : {}),
          ...(filters?.from ? { from: filters.from } : {}),
          ...(filters?.to ? { to: filters.to } : {}),
        },
      })
      .then((r) => r.data),

  fetchSale: (id: string) => apiClient.get<Sale>(`${BASE_PATH}/${id}`).then((r) => r.data),

  createSale: (data: SaleFormData) =>
    apiClient.post<Sale>(BASE_PATH, data).then((r) => r.data),

  completeSale: (id: string) =>
    apiClient.post<Sale>(`${BASE_PATH}/${id}/complete`).then((r) => r.data),

  cancelSale: (id: string) =>
    apiClient.post<Sale>(`${BASE_PATH}/${id}/cancel`).then((r) => r.data),

  // Backward-compatible wrapper that routes to the correct action
  updateSaleStatus: (id: string, status: Sale['status']) => {
    if (status === 'CONFIRMED') {
      return saleService.completeSale(id)
    }
    if (status === 'CANCELLED') {
      return saleService.cancelSale(id)
    }
    throw new Error(`Unsupported status transition: ${status}`)
  },
}
