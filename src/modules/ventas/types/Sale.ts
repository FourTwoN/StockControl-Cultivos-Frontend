export interface Sale {
  readonly id: string
  readonly saleNumber: string
  readonly items: readonly SaleItem[]
  readonly totalAmount: number
  readonly currency: string | null
  readonly status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  readonly customerName?: string
  readonly notes?: string
  readonly createdBy: string
  readonly createdAt: string
}

export interface SaleItem {
  readonly id: string
  readonly productId: string
  readonly productName: string
  readonly productSku: string
  readonly quantity: number
  readonly unitPrice: number
  readonly discount: number
  readonly subtotal: number
}
