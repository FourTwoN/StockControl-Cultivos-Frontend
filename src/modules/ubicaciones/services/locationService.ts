import { apiClient } from '@core/api/apiClient.ts'
import type { PagedResponse } from '@core/api/types.ts'
import type { Warehouse, StorageArea, StorageLocation, StorageBin } from '../types/Location.ts'
import type {
  WarehouseFormData,
  StorageAreaFormData,
  StorageLocationFormData,
  StorageBinFormData,
} from '../types/schemas.ts'

const WAREHOUSES_PATH = '/api/v1/warehouses'

// --- Warehouses ---

async function getWarehouses(): Promise<readonly Warehouse[]> {
  const response = await apiClient.get<PagedResponse<Warehouse>>(WAREHOUSES_PATH)
  return response.data.content
}

async function getWarehouse(id: string): Promise<Warehouse> {
  const response = await apiClient.get<Warehouse>(`${WAREHOUSES_PATH}/${id}`)
  return response.data
}

async function createWarehouse(data: WarehouseFormData): Promise<Warehouse> {
  const response = await apiClient.post<Warehouse>(WAREHOUSES_PATH, data)
  return response.data
}

async function updateWarehouse(id: string, data: WarehouseFormData): Promise<Warehouse> {
  const response = await apiClient.put<Warehouse>(`${WAREHOUSES_PATH}/${id}`, data)
  return response.data
}

// --- Storage Areas (nested under Warehouses) ---

async function getAreas(warehouseId: string): Promise<readonly StorageArea[]> {
  const response = await apiClient.get<StorageArea[]>(`${WAREHOUSES_PATH}/${warehouseId}/areas`)
  return response.data
}

async function createArea(warehouseId: string, data: StorageAreaFormData): Promise<StorageArea> {
  const response = await apiClient.post<StorageArea>(
    `${WAREHOUSES_PATH}/${warehouseId}/areas`,
    data,
  )
  return response.data
}

// --- Storage Locations (nested under Areas) ---

async function getLocations(areaId: string): Promise<readonly StorageLocation[]> {
  const response = await apiClient.get<StorageLocation[]>(`/api/v1/areas/${areaId}/locations`)
  return response.data
}

async function createLocation(
  areaId: string,
  data: StorageLocationFormData,
): Promise<StorageLocation> {
  const response = await apiClient.post<StorageLocation>(`/api/v1/areas/${areaId}/locations`, data)
  return response.data
}

// --- Storage Bins (nested under Locations) ---

async function getBins(locationId: string): Promise<readonly StorageBin[]> {
  const response = await apiClient.get<StorageBin[]>(`/api/v1/locations/${locationId}/bins`)
  return response.data
}

async function createBin(locationId: string, data: StorageBinFormData): Promise<StorageBin> {
  const response = await apiClient.post<StorageBin>(`/api/v1/locations/${locationId}/bins`, data)
  return response.data
}

export const locationService = {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  getAreas,
  createArea,
  getLocations,
  createLocation,
  getBins,
  createBin,
} as const
