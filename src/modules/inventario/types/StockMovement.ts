import type { MovementType } from '@core/types/enums'

export interface StockMovement {
  readonly id: string
  readonly batchId: string
  readonly type: MovementType
  readonly quantity: number
  readonly sourceBinId?: string
  readonly sourceBinName?: string
  readonly destinationBinId?: string
  readonly destinationBinName?: string
  readonly performedBy: string
  readonly notes?: string
  readonly createdAt: string
}
