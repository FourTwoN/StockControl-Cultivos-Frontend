import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { Button } from '@core/components/ui/Button'
import { Modal } from '@core/components/ui/Modal'
import { ConfirmDialog } from '@core/components/ui/ConfirmDialog'
import { useToast } from '@core/components/ui/Toast'
import { usePagination } from '@core/hooks/usePagination'
import { PackagingCatalogList } from '../components/PackagingCatalogList.tsx'
import { PackagingFilterBar } from '../components/PackagingFilterBar.tsx'
import type { PackagingFilters } from '../components/PackagingFilterBar.tsx'
import { PackagingForm } from '../components/PackagingForm.tsx'
import { usePackagingCatalog } from '../hooks/usePackagingCatalog.ts'
import { usePackagingTypes } from '../hooks/usePackagingTypes.ts'
import { usePackagingMaterials } from '../hooks/usePackagingMaterials.ts'
import { usePackagingColors } from '../hooks/usePackagingColors.ts'
import { useCreatePackaging } from '../hooks/useCreatePackaging.ts'
import { useUpdatePackaging } from '../hooks/useUpdatePackaging.ts'
import { useDeletePackaging } from '../hooks/useDeletePackaging.ts'
import type { PackagingCatalog } from '../types/Packaging.ts'
import type { PackagingCatalogFormData } from '../types/schemas.ts'

interface ModalState {
  readonly isOpen: boolean
  readonly item?: PackagingCatalog
}

interface DeleteState {
  readonly isOpen: boolean
  readonly item?: PackagingCatalog
}

const INITIAL_FILTERS: PackagingFilters = {
  search: '',
  typeId: '',
  materialId: '',
  colorId: '',
}

export function EmpaquetadoPage() {
  const toast = useToast()
  const pagination = usePagination(20)

  const [filters, setFilters] = useState<PackagingFilters>(INITIAL_FILTERS)
  const [modal, setModal] = useState<ModalState>({ isOpen: false })
  const [deleteDialog, setDeleteDialog] = useState<DeleteState>({
    isOpen: false,
  })

  const { data: types } = usePackagingTypes()
  const { data: materials } = usePackagingMaterials()
  const { data: colors } = usePackagingColors()

  const { data, isLoading } = usePackagingCatalog(
    {
      page: pagination.page,
      size: pagination.size,
      search: filters.search || undefined,
      typeId: filters.typeId || undefined,
      materialId: filters.materialId || undefined,
      colorId: filters.colorId || undefined,
    },
    pagination,
  )

  const createPackaging = useCreatePackaging()
  const updatePackaging = useUpdatePackaging()
  const deletePackaging = useDeletePackaging()

  const handleFiltersChange = useCallback(
    (updated: PackagingFilters) => {
      setFilters(updated)
      pagination.setPage(0)
    },
    [pagination],
  )

  const handleCreate = useCallback(() => {
    setModal({ isOpen: true })
  }, [])

  const handleEdit = useCallback((item: PackagingCatalog) => {
    setModal({ isOpen: true, item })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModal({ isOpen: false })
  }, [])

  const handleDeleteRequest = useCallback((item: PackagingCatalog) => {
    setDeleteDialog({ isOpen: true, item })
  }, [])

  const handleCloseDelete = useCallback(() => {
    setDeleteDialog({ isOpen: false })
  }, [])

  const handleSubmit = useCallback(
    (formData: PackagingCatalogFormData) => {
      if (modal.item) {
        updatePackaging.mutate(
          { id: modal.item.id, data: formData },
          {
            onSuccess: () => {
              toast.success('Packaging updated successfully')
              setModal({ isOpen: false })
            },
            onError: () => {
              toast.error('Failed to update packaging')
            },
          },
        )
      } else {
        createPackaging.mutate(formData, {
          onSuccess: () => {
            toast.success('Packaging created successfully')
            setModal({ isOpen: false })
          },
          onError: () => {
            toast.error('Failed to create packaging')
          },
        })
      }
    },
    [modal.item, createPackaging, updatePackaging, toast],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleteDialog.item) return

    deletePackaging.mutate(deleteDialog.item.id, {
      onSuccess: () => {
        toast.success('Packaging deleted successfully')
        setDeleteDialog({ isOpen: false })
      },
      onError: () => {
        toast.error('Failed to delete packaging')
      },
    })
  }, [deleteDialog.item, deletePackaging, toast])

  return (
    <AnimatedPage className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Packaging</h1>
          <p className="mt-1 text-sm text-muted">Manage your packaging catalog</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          New Packaging
        </Button>
      </div>

      <div className="mb-6">
        <PackagingFilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          types={types ?? []}
          materials={materials ?? []}
          colors={colors ?? []}
        />
      </div>

      <PackagingCatalogList
        items={data?.content ?? []}
        isLoading={isLoading}
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        onPageChange={pagination.setPage}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <Modal
        open={modal.isOpen}
        onClose={handleCloseModal}
        title={modal.item ? 'Edit Packaging' : 'New Packaging'}
        size="lg"
      >
        <PackagingForm
          initialData={modal.item}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={createPackaging.isPending || updatePackaging.isPending}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Packaging"
        message={`Are you sure you want to delete "${deleteDialog.item?.name ?? ''}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </AnimatedPage>
  )
}
