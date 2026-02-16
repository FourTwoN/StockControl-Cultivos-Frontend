import { z } from 'zod'

export const movementSchema = z.object({
  batchId: z.string().uuid('Invalid batch ID'),
  type: z.enum(['ENTRADA', 'MUERTE', 'TRASPLANTE', 'VENTA', 'AJUSTE'], {
    required_error: 'Movement type is required',
  }),
  quantity: z
    .number({ required_error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than 0'),
  destinationBinId: z.string().uuid('Invalid destination bin').optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional().or(z.literal('')),
})

export type MovementRequest = z.infer<typeof movementSchema>
