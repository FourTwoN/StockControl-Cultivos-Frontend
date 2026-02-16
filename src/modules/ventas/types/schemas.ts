import { z } from 'zod'

const saleItemSchema = z.object({
  productId: z.string().uuid('Invalid product'),
  productName: z.string().min(1, 'Product name is required'),
  productSku: z.string().min(1, 'Product SKU is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  discount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
})

export const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1, 'At least one item is required'),
  customerName: z.string().optional(),
  notes: z.string().optional(),
})

export type SaleFormData = z.infer<typeof saleSchema>
export type SaleItemFormData = z.infer<typeof saleItemSchema>
