import { z } from 'zod'

export const warehouseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(255, 'Address must be 255 characters or less'),
  latitude: z
    .number({ invalid_type_error: 'Latitude must be a number' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number({ invalid_type_error: 'Longitude must be a number' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  totalCapacity: z
    .number({ invalid_type_error: 'Capacity must be a number' })
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1'),
})

export type WarehouseFormData = z.infer<typeof warehouseSchema>

export const storageAreaSchema = z.object({
  warehouseId: z.string().min(1, 'Warehouse is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  areaType: z.string().min(1, 'Area type is required'),
  capacity: z
    .number({ invalid_type_error: 'Capacity must be a number' })
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1'),
})

export type StorageAreaFormData = z.infer<typeof storageAreaSchema>

export const storageLocationSchema = z.object({
  areaId: z.string().min(1, 'Area is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  code: z.string().min(1, 'Code is required').max(50, 'Code must be 50 characters or less'),
  maxCapacity: z
    .number({ invalid_type_error: 'Max capacity must be a number' })
    .int('Max capacity must be a whole number')
    .min(1, 'Max capacity must be at least 1'),
})

export type StorageLocationFormData = z.infer<typeof storageLocationSchema>

export const storageBinSchema = z.object({
  locationId: z.string().min(1, 'Location is required'),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  binType: z.string().min(1, 'Bin type is required'),
})

export type StorageBinFormData = z.infer<typeof storageBinSchema>
