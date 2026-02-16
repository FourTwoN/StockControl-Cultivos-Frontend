import { useQuery } from '@tanstack/react-query'
import type { ApiRequestConfig } from '@core/api/types.ts'
import { fetchPriceLists } from '../services/priceService.ts'

export const priceListKeys = {
  all: ['price-lists'] as const,
  list: (config: ApiRequestConfig) => ['price-lists', 'list', config] as const,
  detail: (id: string) => ['price-lists', id] as const,
  items: (listId: string) => ['price-lists', listId, 'items'] as const,
} as const

export function usePriceLists(config: ApiRequestConfig = {}) {
  return useQuery({
    queryKey: priceListKeys.list(config),
    queryFn: () => fetchPriceLists(config),
  })
}
