import { useState, useCallback, useMemo } from 'react'
import { DollarSign, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { AnimatedList, AnimatedListItem } from '@core/components/motion/AnimatedList'
import { Button } from '@core/components/ui/Button.tsx'
import { Skeleton } from '@core/components/ui/Skeleton.tsx'
import { EmptyState } from '@core/components/ui/EmptyState.tsx'
import { Modal } from '@core/components/ui/Modal.tsx'
import { Input } from '@core/components/ui/Input.tsx'
import { SearchInput } from '@core/components/forms/SearchInput.tsx'
import { useToast } from '@core/components/ui/Toast.tsx'
import { useDebounce } from '@core/hooks/useDebounce.ts'
import type { PriceListFormData } from '../types/schemas.ts'
import { priceListSchema } from '../types/schemas.ts'
import { PriceListCard } from '../components/PriceListCard.tsx'
import { usePriceLists } from '../hooks/usePriceLists.ts'
import { useCreatePriceList } from '../hooks/useCreatePriceList.ts'

export default function PriceListPage() {
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const toast = useToast()

  const filters = useMemo(
    () => (debouncedSearch ? { search: debouncedSearch } : undefined),
    [debouncedSearch],
  )

  const { data, isLoading, isError } = usePriceLists({
    filters: filters ?? undefined,
  })
  const createMutation = useCreatePriceList()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PriceListFormData>({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      name: '',
      description: '',
      effectiveFrom: '',
      effectiveTo: '',
      currency: 'ARS',
      isActive: true,
    },
  })

  const handleCreate = useCallback(
    (formData: PriceListFormData) => {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success('Price list created successfully')
          setIsCreateOpen(false)
          reset()
        },
        onError: () => {
          toast.error('Failed to create price list')
        },
      })
    },
    [createMutation, toast, reset],
  )

  const handleCloseModal = useCallback(() => {
    setIsCreateOpen(false)
    reset()
  }, [reset])

  if (isLoading) {
    return (
      <AnimatedPage className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} variant="rectangle" className="h-32" />
          ))}
        </div>
      </AnimatedPage>
    )
  }

  if (isError) {
    return (
      <AnimatedPage className="p-6">
        <EmptyState
          icon={<DollarSign className="h-8 w-8" />}
          title="Failed to load price lists"
          description="An error occurred while loading price list data. Please try again later."
        />
      </AnimatedPage>
    )
  }

  const priceLists = data?.content ?? []

  return (
    <AnimatedPage className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">Price Lists</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Price List
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search price lists..." />

      {priceLists.length === 0 ? (
        <EmptyState
          icon={<DollarSign className="h-8 w-8" />}
          title="No price lists"
          description={
            debouncedSearch
              ? 'No price lists match your search criteria.'
              : 'No price lists have been created yet.'
          }
          action={
            !debouncedSearch ? (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create first price list
              </Button>
            ) : undefined
          }
        />
      ) : (
        <AnimatedList className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {priceLists.map((priceList) => (
            <AnimatedListItem key={priceList.id}>
              <PriceListCard priceList={priceList} />
            </AnimatedListItem>
          ))}
        </AnimatedList>
      )}

      {/* Create Price List Modal */}
      <Modal open={isCreateOpen} onClose={handleCloseModal} title="Create Price List">
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input label="Name" {...register('name')} error={errors.name?.message} />
          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />
          <Input
            label="Effective From"
            type="date"
            {...register('effectiveFrom')}
            error={errors.effectiveFrom?.message}
          />
          <Input
            label="Effective To"
            type="date"
            {...register('effectiveTo')}
            error={errors.effectiveTo?.message}
          />
          <Input label="Currency" {...register('currency')} error={errors.currency?.message} />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-primary">
              Active
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </AnimatedPage>
  )
}
