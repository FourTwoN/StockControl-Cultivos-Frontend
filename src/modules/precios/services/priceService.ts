import { apiClient } from '@core/api/apiClient.ts'
import type { PagedResponse, ApiRequestConfig } from '@core/api/types.ts'
import type { PriceList, PriceItem } from '../types/Price.ts'
import type { PriceListFormData, PriceItemFormData } from '../types/schemas.ts'

const BASE_URL = '/api/v1/price-lists'

function buildPriceListUrl(id: string): string {
  return `${BASE_URL}/${id}`
}

function buildEntriesUrl(priceListId: string): string {
  return `${BASE_URL}/${priceListId}/entries`
}

function buildBulkUrl(priceListId: string): string {
  return `${BASE_URL}/${priceListId}/entries/bulk`
}

function buildEntryUrl(priceListId: string, entryId: string): string {
  return `${BASE_URL}/${priceListId}/entries/${entryId}`
}

export async function fetchPriceLists(
  config: ApiRequestConfig = {},
): Promise<PagedResponse<PriceList>> {
  const { data } = await apiClient.get<PagedResponse<PriceList>>(BASE_URL, {
    params: {
      page: config.page ?? 0,
      size: config.size ?? 20,
      sort: config.sort,
      ...config.filters,
    },
  })
  return data
}

export async function fetchPriceList(id: string): Promise<PriceList> {
  const { data } = await apiClient.get<PriceList>(buildPriceListUrl(id))
  return data
}

export async function createPriceList(payload: PriceListFormData): Promise<PriceList> {
  const { data } = await apiClient.post<PriceList>(BASE_URL, payload)
  return data
}

export async function updatePriceList(id: string, payload: PriceListFormData): Promise<PriceList> {
  const { data } = await apiClient.put<PriceList>(buildPriceListUrl(id), payload)
  return data
}

export async function deletePriceList(id: string): Promise<void> {
  await apiClient.delete(buildPriceListUrl(id))
}

export async function fetchPriceEntries(priceListId: string): Promise<PriceItem[]> {
  const { data } = await apiClient.get<PriceItem[]>(buildEntriesUrl(priceListId))
  return data
}

export async function bulkUploadEntries(priceListId: string, file: File): Promise<PriceItem[]> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<PriceItem[]>(buildBulkUrl(priceListId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updatePriceEntry(
  priceListId: string,
  entryId: string,
  payload: PriceItemFormData,
): Promise<PriceItem> {
  const { data } = await apiClient.put<PriceItem>(buildEntryUrl(priceListId, entryId), payload)
  return data
}

// Legacy aliases for backward compatibility
export const fetchPriceItems = fetchPriceEntries
export const bulkUploadItems = bulkUploadEntries
export const updatePriceItem = updatePriceEntry
