export interface Product {
  readonly id: string
  readonly sku: string
  readonly name: string
  readonly description: string
  readonly categoryId: string
  readonly categoryName: string
  readonly familyId: string
  readonly familyName: string
  readonly state: 'healthy' | 'diseased' | 'dormant'
  readonly sizeClassification: string
  readonly imageUrl?: string
  readonly customAttributes: Readonly<Record<string, unknown>>
  readonly createdAt: string
  readonly updatedAt: string
}

export interface Category {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly parentId?: string
  readonly children?: readonly Category[]
  readonly productCount: number
}

export interface ProductFamily {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly imageUrl?: string
  readonly productCount: number
}
