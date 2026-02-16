export interface Warehouse {
  readonly id: string
  readonly name: string
  readonly address: string
  readonly latitude: number | null
  readonly longitude: number | null
  readonly totalCapacity: number
  readonly usedCapacity: number
  readonly areaCount: number
  readonly createdAt: string
}

export interface StorageArea {
  readonly id: string
  readonly warehouseId: string
  readonly name: string
  readonly areaType: string
  readonly capacity: number
  readonly usedCapacity: number
  readonly locationCount: number
}

export interface StorageLocation {
  readonly id: string
  readonly areaId: string
  readonly warehouseId: string
  readonly name: string
  readonly code: string
  readonly occupancy: number
  readonly maxCapacity: number
  readonly binCount: number
}

export interface StorageBin {
  readonly id: string
  readonly locationId: string
  readonly name: string
  readonly binType: string
  readonly isOccupied: boolean
  readonly currentBatchId?: string
  readonly currentBatchName?: string
}
