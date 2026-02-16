import type { BatchStatus } from '@core/types/enums'

export interface StockBatch {
  readonly id: string
  readonly productId: string
  readonly productName: string
  readonly productSku: string
  readonly locationId: string
  readonly locationName: string
  readonly binId?: string
  readonly binName?: string
  readonly quantity: number
  readonly initialQuantity: number
  readonly status: BatchStatus
  readonly entryDate: string
  readonly expiryDate?: string
  readonly notes?: string
  readonly customAttributes: Record<string, unknown>
  readonly createdAt: string
  readonly updatedAt: string
}
