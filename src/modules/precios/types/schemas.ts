import { z } from 'zod'

export const priceListSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  effectiveFrom: z.string().min(1, 'Effective from date is required'),
  effectiveTo: z.string().optional().or(z.literal('')),
  currency: z.string().min(1, 'Currency is required'),
  isActive: z.boolean(),
})

export type PriceListFormData = z.infer<typeof priceListSchema>

export const priceItemSchema = z.object({
  unitPrice: z
    .number({ invalid_type_error: 'Unit price must be a number' })
    .min(0, 'Unit price must be at least 0'),
  minQuantity: z
    .number({ invalid_type_error: 'Min quantity must be a number' })
    .int('Min quantity must be a whole number')
    .min(1, 'Min quantity must be at least 1'),
  maxQuantity: z
    .number({ invalid_type_error: 'Max quantity must be a number' })
    .int('Max quantity must be a whole number')
    .min(1, 'Max quantity must be at least 1')
    .optional(),
  discount: z
    .number({ invalid_type_error: 'Discount must be a number' })
    .min(0, 'Discount must be at least 0')
    .max(100, 'Discount cannot exceed 100')
    .optional(),
})

export type PriceItemFormData = z.infer<typeof priceItemSchema>
