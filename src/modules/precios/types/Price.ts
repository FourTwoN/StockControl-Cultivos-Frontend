export interface PriceList {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly effectiveFrom: string
  readonly effectiveTo?: string
  readonly isActive: boolean
  readonly itemCount: number
  readonly currency: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface PriceItem {
  readonly id: string
  readonly priceListId: string
  readonly productId: string
  readonly productName: string
  readonly productSku: string
  readonly unitPrice: number
  readonly minQuantity: number
  readonly maxQuantity?: number
  readonly discount?: number
  readonly finalPrice: number
}

export interface CsvPreviewRow {
  readonly productSku: string
  readonly unitPrice: number
  readonly minQuantity: number
  readonly maxQuantity?: number
  readonly discount?: number
  readonly isValid: boolean
  readonly errors: readonly string[]
}
