import { apiClient } from '@core/api/apiClient.ts'
import type { PagedResponse } from '@core/api/types.ts'
import type {
  PackagingCatalog,
  PackagingType,
  PackagingMaterial,
  PackagingColor,
} from '../types/Packaging.ts'
import type { PackagingCatalogFormData } from '../types/schemas.ts'

const BASE_PATH = '/api/v1/packaging'

interface CatalogListParams {
  readonly page: number
  readonly size: number
  readonly search?: string
  readonly typeId?: string
  readonly materialId?: string
  readonly colorId?: string
}

// --- Catalog ---

async function getCatalogList(params: CatalogListParams): Promise<PagedResponse<PackagingCatalog>> {
  const { page, size, search, typeId, materialId, colorId } = params
  const queryParams: Record<string, string | number> = { page, size }

  if (search) {
    queryParams.search = search
  }
  if (typeId) {
    queryParams.typeId = typeId
  }
  if (materialId) {
    queryParams.materialId = materialId
  }
  if (colorId) {
    queryParams.colorId = colorId
  }

  const response = await apiClient.get<PagedResponse<PackagingCatalog>>(`${BASE_PATH}/catalogs`, {
    params: queryParams,
  })
  return response.data
}

async function getCatalogById(id: string): Promise<PackagingCatalog> {
  const response = await apiClient.get<PackagingCatalog>(`${BASE_PATH}/catalog/${id}`)
  return response.data
}

async function createCatalogItem(data: PackagingCatalogFormData): Promise<PackagingCatalog> {
  const response = await apiClient.post<PackagingCatalog>(`${BASE_PATH}/catalogs`, data)
  return response.data
}

async function updateCatalogItem(
  id: string,
  data: PackagingCatalogFormData,
): Promise<PackagingCatalog> {
  const response = await apiClient.put<PackagingCatalog>(`${BASE_PATH}/catalog/${id}`, data)
  return response.data
}

async function deleteCatalogItem(id: string): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/catalog/${id}`)
}

// Helper to extract array from paginated or array response
function extractArray<T>(data: T[] | PagedResponse<T>): readonly T[] {
  if (Array.isArray(data)) {
    return data
  }
  if (data && typeof data === 'object' && 'content' in data) {
    return (data as PagedResponse<T>).content
  }
  return []
}

// --- Types ---

async function getTypes(): Promise<readonly PackagingType[]> {
  const response = await apiClient.get<PackagingType[] | PagedResponse<PackagingType>>(
    `${BASE_PATH}/types`,
  )
  return extractArray(response.data)
}

async function createType(data: {
  readonly name: string
  readonly description?: string
}): Promise<PackagingType> {
  const response = await apiClient.post<PackagingType>(`${BASE_PATH}/types`, data)
  return response.data
}

// --- Materials ---

async function getMaterials(): Promise<readonly PackagingMaterial[]> {
  const response = await apiClient.get<PackagingMaterial[] | PagedResponse<PackagingMaterial>>(
    `${BASE_PATH}/materials`,
  )
  return extractArray(response.data)
}

async function createMaterial(data: {
  readonly name: string
  readonly description?: string
}): Promise<PackagingMaterial> {
  const response = await apiClient.post<PackagingMaterial>(`${BASE_PATH}/materials`, data)
  return response.data
}

// --- Colors ---

async function getColors(): Promise<readonly PackagingColor[]> {
  const response = await apiClient.get<PackagingColor[] | PagedResponse<PackagingColor>>(
    `${BASE_PATH}/colors`,
  )
  return extractArray(response.data)
}

async function createColor(data: {
  readonly name: string
  readonly hex: string
}): Promise<PackagingColor> {
  const response = await apiClient.post<PackagingColor>(`${BASE_PATH}/colors`, data)
  return response.data
}

export const packagingService = {
  getCatalogList,
  getCatalogById,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  getTypes,
  createType,
  getMaterials,
  createMaterial,
  getColors,
  createColor,
} as const
