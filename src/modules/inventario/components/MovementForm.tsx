import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '@core/components/forms/FormField'
import { Button } from '@core/components/ui/Button'
import { movementSchema } from '../types/schemas.ts'
import type { MovementRequest } from '../types/schemas.ts'

interface MovementFormProps {
  readonly batchId: string
  readonly onSubmit: (data: MovementRequest) => void
  readonly onCancel: () => void
  readonly isSubmitting: boolean
}

const MOVEMENT_TYPE_OPTIONS = [
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'MUERTE', label: 'Muerte' },
  { value: 'TRASPLANTE', label: 'Trasplante' },
  { value: 'VENTA', label: 'Venta' },
  { value: 'AJUSTE', label: 'Ajuste' },
] as const

export function MovementForm({ batchId, onSubmit, onCancel, isSubmitting }: MovementFormProps) {
  const { control, handleSubmit, watch } = useForm<MovementRequest>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      batchId,
      type: undefined,
      quantity: undefined,
      destinationBinId: undefined,
      notes: '',
    },
  })

  const selectedType = watch('type')
  const showDestinationBin = selectedType === 'TRASPLANTE'

  const handleFormSubmit = useCallback(
    (data: MovementRequest) => {
      const submissionData: MovementRequest = showDestinationBin
        ? data
        : {
            ...data,
            destinationBinId: undefined,
          }
      onSubmit(submissionData)
    },
    [onSubmit, showDestinationBin],
  )

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      <FormField<MovementRequest>
        name="type"
        control={control}
        label="Movement Type"
        type="select"
        options={[...MOVEMENT_TYPE_OPTIONS]}
        placeholder="Select movement type"
      />

      <FormField<MovementRequest>
        name="quantity"
        control={control}
        label="Quantity"
        type="number"
        placeholder="Enter quantity"
      />

      {showDestinationBin && (
        <FormField<MovementRequest>
          name="destinationBinId"
          control={control}
          label="Destination Bin"
          placeholder="Destination bin ID"
          helperText="Required for transplant movements"
        />
      )}

      <FormField<MovementRequest>
        name="notes"
        control={control}
        label="Notes"
        type="textarea"
        placeholder="Optional notes about this movement"
        helperText="Maximum 500 characters"
      />

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Record Movement
        </Button>
      </div>
    </form>
  )
}
