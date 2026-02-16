import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '@core/components/forms/FormField'
import { Button } from '@core/components/ui/Button'
import { productSchema } from '../types/schemas.ts'
import type { ProductFormData } from '../types/schemas.ts'
import type { Product } from '../types/Product.ts'
import { useCategories } from '../hooks/useCategories.ts'
import { useFamilies } from '../hooks/useFamilies.ts'

interface ProductFormProps {
  readonly initialData?: Product
  readonly onSubmit: (data: ProductFormData) => void
  readonly isSubmitting?: boolean
}

const STATE_OPTIONS = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'diseased', label: 'Diseased' },
  { value: 'dormant', label: 'Dormant' },
] as const

export function ProductForm({ initialData, onSubmit, isSubmitting = false }: ProductFormProps) {
  const { data: categories } = useCategories()
  const { data: families } = useFamilies()

  const defaultValues: ProductFormData = useMemo(
    () => ({
      name: initialData?.name ?? '',
      sku: initialData?.sku ?? '',
      description: initialData?.description ?? '',
      categoryId: initialData?.categoryId ?? '',
      familyId: initialData?.familyId ?? '',
      state: initialData?.state ?? 'healthy',
      sizeClassification: initialData?.sizeClassification ?? '',
    }),
    [initialData],
  )

  const { control, handleSubmit } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const categoryOptions = useMemo(
    () =>
      (Array.isArray(categories) ? categories : []).map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    [categories],
  )

  const familyOptions = useMemo(
    () =>
      (Array.isArray(families) ? families : []).map((fam) => ({
        value: fam.id,
        label: fam.name,
      })),
    [families],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField<ProductFormData>
          name="name"
          control={control}
          label="Name"
          placeholder="Product name"
        />
        <FormField<ProductFormData>
          name="sku"
          control={control}
          label="SKU"
          placeholder="Product SKU"
        />
      </div>

      <FormField<ProductFormData>
        name="description"
        control={control}
        label="Description"
        type="textarea"
        placeholder="Product description"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField<ProductFormData>
          name="categoryId"
          control={control}
          label="Category"
          type="select"
          options={categoryOptions}
          placeholder="Select a category"
        />
        <FormField<ProductFormData>
          name="familyId"
          control={control}
          label="Family"
          type="select"
          options={familyOptions}
          placeholder="Select a family"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField<ProductFormData>
          name="state"
          control={control}
          label="State"
          type="select"
          options={[...STATE_OPTIONS]}
          placeholder="Select state"
        />
        <FormField<ProductFormData>
          name="sizeClassification"
          control={control}
          label="Size Classification"
          placeholder="e.g. Large, Medium, Small"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
