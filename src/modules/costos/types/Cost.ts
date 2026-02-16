export interface ProductCost {
  readonly productId: string
  readonly productName: string
  readonly productSku: string
  readonly averageCost: number
  readonly lastCost: number
  readonly totalUnits: number
  readonly totalValue: number
  readonly currency: string
}

export interface BatchCost {
  readonly batchId: string
  readonly productName: string
  readonly unitCost: number
  readonly totalCost: number
  readonly quantity: number
  readonly additionalCosts: readonly CostEntry[]
}

export interface CostEntry {
  readonly id: string
  readonly description: string
  readonly amount: number
  readonly date: string
}

export interface InventoryValuation {
  readonly totalValue: number | null
  readonly totalUnits: number | null
  readonly currency: string | null
  readonly byCategory: readonly CategoryValuation[]
}

export interface CategoryValuation {
  readonly categoryId: string
  readonly categoryName: string
  readonly totalValue: number | null
  readonly totalUnits: number | null
  readonly percentage: number | null
}

export interface CostTrend {
  readonly date: string
  readonly averageCost: number
  readonly minCost: number
  readonly maxCost: number
}
