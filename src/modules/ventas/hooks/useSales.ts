import { useQuery } from '@tanstack/react-query'
import { saleService } from '../services/saleService.ts'
import type { Sale } from '../types/Sale.ts'

interface UseSalesFilters {
  readonly status?: Sale['status']
  readonly from?: string
  readonly to?: string
}

export function useSales(page: number, size: number, filters?: UseSalesFilters) {
  return useQuery({
    queryKey: ['sales', page, size, filters],
    queryFn: () => saleService.fetchSales(page, size, filters),
  })
}
