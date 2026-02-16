import { useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '@core/components/forms/FormField.tsx'
import { Button } from '@core/components/ui/Button.tsx'
import { Skeleton } from '@core/components/ui/Skeleton.tsx'
import { usePackagingTypes } from '../hooks/usePackagingTypes.ts'
import { usePackagingMaterials } from '../hooks/usePackagingMaterials.ts'
import { usePackagingColors } from '../hooks/usePackagingColors.ts'
import { packagingCatalogSchema } from '../types/schemas.ts'
import type { PackagingCatalogFormData } from '../types/schemas.ts'
import type { PackagingCatalog } from '../types/Packaging.ts'

interface PackagingFormProps {
  readonly initialData?: PackagingCatalog
  readonly onSubmit: (data: PackagingCatalogFormData) => void
  readonly onCancel: () => void
  readonly isSubmitting: boolean
}

function buildDefaultValues(item?: PackagingCatalog): PackagingCatalogFormData {
  return {
    sku: item?.sku ?? '',
    name: item?.name ?? '',
    typeId: item?.typeId ?? '',
    materialId: item?.materialId ?? '',
    colorId: item?.colorId ?? '',
    dimensions: item?.dimensions ?? '',
    weight: item?.weight,
    imageUrl: item?.imageUrl ?? '',
    isActive: item?.isActive ?? true,
  }
}

export function PackagingForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: PackagingFormProps) {
  const { data: types, isLoading: typesLoading } = usePackagingTypes()
  const { data: materials, isLoading: materialsLoading } = usePackagingMaterials()
  const { data: colors, isLoading: colorsLoading } = usePackagingColors()

  const { control, handleSubmit, watch } = useForm<PackagingCatalogFormData>({
    resolver: zodResolver(packagingCatalogSchema),
    defaultValues: buildDefaultValues(initialData),
  })

  const selectedColorId = watch('colorId')

  const colorsArray = Array.isArray(colors) ? colors : []
  const typesArray = Array.isArray(types) ? types : []
  const materialsArray = Array.isArray(materials) ? materials : []

  const selectedColor = useMemo(
    () => colorsArray.find((c) => c.id === selectedColorId),
    [colorsArray, selectedColorId],
  )

  const typeOptions = useMemo(
    () => typesArray.map((t) => ({ value: t.id, label: t.name })),
    [typesArray],
  )

  const materialOptions = useMemo(
    () => materialsArray.map((m) => ({ value: m.id, label: m.name })),
    [materialsArray],
  )

  const colorOptions = useMemo(
    () => colorsArray.map((c) => ({ value: c.id, label: c.name })),
    [colorsArray],
  )

  const handleFormSubmit = useCallback(
    (data: PackagingCatalogFormData) => {
      onSubmit(data)
    },
    [onSubmit],
  )

  const isLoadingOptions = typesLoading || materialsLoading || colorsLoading

  if (isLoadingOptions) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField name="sku" control={control} label="SKU" placeholder="e.g. PKG-001" />

        <FormField
          name="name"
          control={control}
          label="Name"
          placeholder="e.g. Small cardboard box"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          name="typeId"
          control={control}
          label="Type"
          type="select"
          options={typeOptions}
          placeholder="Select type"
        />

        <FormField
          name="materialId"
          control={control}
          label="Material"
          type="select"
          options={materialOptions}
          placeholder="Select material"
        />

        <div className="flex gap-2">
          <div className="flex-1">
            <FormField
              name="colorId"
              control={control}
              label="Color"
              type="select"
              options={colorOptions}
              placeholder="Select color"
            />
          </div>
          {selectedColor && (
            <div className="flex items-end pb-1">
              <span
                className="h-10 w-10 rounded-lg border border-border"
                style={{ backgroundColor: selectedColor.hex }}
                title={selectedColor.name}
                aria-label={`Selected color: ${selectedColor.name}`}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          name="dimensions"
          control={control}
          label="Dimensions"
          placeholder="e.g. 30x20x10 cm"
          helperText="Optional"
        />

        <FormField
          name="weight"
          control={control}
          label="Weight (g)"
          type="number"
          placeholder="e.g. 250"
          helperText="Optional"
        />
      </div>

      <FormField
        name="imageUrl"
        control={control}
        label="Image URL"
        placeholder="https://..."
        helperText="Optional"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          {...control.register('isActive')}
        />
        <label htmlFor="isActive" className="text-sm font-medium text-primary">
          Active
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
