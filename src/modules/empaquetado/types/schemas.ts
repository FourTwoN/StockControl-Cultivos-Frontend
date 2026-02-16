import { z } from 'zod'

export const packagingCatalogSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU must be 50 characters or less'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  typeId: z.string().min(1, 'Type is required'),
  materialId: z.string().min(1, 'Material is required'),
  colorId: z.string().min(1, 'Color is required'),
  dimensions: z
    .string()
    .max(100, 'Dimensions must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  weight: z
    .number()
    .min(0, 'Weight must be non-negative')
    .optional()
    .or(z.nan().transform(() => undefined)),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isActive: z.boolean(),
})

export type PackagingCatalogFormData = z.infer<typeof packagingCatalogSchema>

export const packagingTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(255, 'Description must be 255 characters or less')
    .optional()
    .or(z.literal('')),
})

export type PackagingTypeFormData = z.infer<typeof packagingTypeSchema>

export const packagingMaterialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(255, 'Description must be 255 characters or less')
    .optional()
    .or(z.literal('')),
})

export type PackagingMaterialFormData = z.infer<typeof packagingMaterialSchema>

export const packagingColorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  hex: z
    .string()
    .min(1, 'Hex color is required')
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #FF0000)'),
})

export type PackagingColorFormData = z.infer<typeof packagingColorSchema>
