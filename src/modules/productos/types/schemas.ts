import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().uuid('Invalid category'),
  familyId: z.string().uuid('Invalid family'),
  state: z.enum(['healthy', 'diseased', 'dormant'], {
    required_error: 'State is required',
  }),
  sizeClassification: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  parentId: z.string().uuid('Invalid parent category').optional(),
})

export const familySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type FamilyFormData = z.infer<typeof familySchema>
