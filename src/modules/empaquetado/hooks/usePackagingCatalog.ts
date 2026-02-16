import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { packagingService } from '../services/packagingService.ts'
import type { usePagination } from '@core/hooks/usePagination.ts'

interface UsePackagingCatalogParams {
  readonly page: number
  readonly size: number
  readonly search?: string
  readonly typeId?: string
  readonly materialId?: string
  readonly colorId?: string
}

const CATALOG_QUERY_KEY = 'packaging-catalog'

export function usePackagingCatalog(
  params: UsePackagingCatalogParams,
  pagination: ReturnType<typeof usePagination>,
) {
  const query = useQuery({
    queryKey: [CATALOG_QUERY_KEY, params],
    queryFn: () => packagingService.getCatalogList(params),
  })

  useEffect(() => {
    if (query.data) {
      pagination.setTotal(query.data.totalPages, query.data.totalElements)
    }
  }, [query.data, pagination])

  return query
}

export { CATALOG_QUERY_KEY }
