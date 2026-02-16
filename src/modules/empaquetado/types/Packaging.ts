export interface PackagingCatalog {
  readonly id: string
  readonly sku: string
  readonly name: string
  readonly typeId: string
  readonly typeName: string
  readonly materialId: string
  readonly materialName: string
  readonly colorId: string
  readonly colorName: string
  readonly colorHex: string
  readonly dimensions?: string
  readonly weight?: number
  readonly imageUrl?: string
  readonly isActive: boolean
  readonly createdAt: string
}

export interface PackagingType {
  readonly id: string
  readonly name: string
  readonly description?: string
}

export interface PackagingMaterial {
  readonly id: string
  readonly name: string
  readonly description?: string
}

export interface PackagingColor {
  readonly id: string
  readonly name: string
  readonly hex: string
}
