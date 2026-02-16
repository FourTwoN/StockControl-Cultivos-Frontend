import { useState, useCallback } from 'react'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { Modal } from '@core/components/ui/Modal'
import { ConfirmDialog } from '@core/components/ui/ConfirmDialog'
import { useToast } from '@core/components/ui/Toast'
import { ProductList } from '../components/ProductList.tsx'
import { ProductForm } from '../components/ProductForm.tsx'
import { useCreateProduct } from '../hooks/useCreateProduct.ts'
import { useUpdateProduct } from '../hooks/useUpdateProduct.ts'
import { useDeleteProduct } from '../hooks/useDeleteProduct.ts'
import type { Product } from '../types/Product.ts'
import type { ProductFormData } from '../types/schemas.ts'

interface ModalState {
  readonly isOpen: boolean
  readonly product?: Product
}

interface DeleteState {
  readonly isOpen: boolean
  readonly product?: Product
}

export function ProductsPage() {
  const toast = useToast()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [modal, setModal] = useState<ModalState>({ isOpen: false })
  const [deleteDialog, setDeleteDialog] = useState<DeleteState>({
    isOpen: false,
  })

  const handleCreate = useCallback(() => {
    setModal({ isOpen: true })
  }, [])

  const handleEdit = useCallback((product: Product) => {
    setModal({ isOpen: true, product })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModal({ isOpen: false })
  }, [])

  const handleDeleteRequest = useCallback((product: Product) => {
    setDeleteDialog({ isOpen: true, product })
  }, [])

  const handleCloseDelete = useCallback(() => {
    setDeleteDialog({ isOpen: false })
  }, [])

  const handleSubmit = useCallback(
    (data: ProductFormData) => {
      if (modal.product) {
        updateProduct.mutate(
          { id: modal.product.id, data },
          {
            onSuccess: () => {
              toast.success('Product updated successfully')
              setModal({ isOpen: false })
            },
            onError: () => {
              toast.error('Failed to update product')
            },
          },
        )
      } else {
        createProduct.mutate(data, {
          onSuccess: () => {
            toast.success('Product created successfully')
            setModal({ isOpen: false })
          },
          onError: () => {
            toast.error('Failed to create product')
          },
        })
      }
    },
    [modal.product, createProduct, updateProduct, toast],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleteDialog.product) return

    deleteProduct.mutate(deleteDialog.product.id, {
      onSuccess: () => {
        toast.success('Product deleted successfully')
        setDeleteDialog({ isOpen: false })
      },
      onError: () => {
        toast.error('Failed to delete product')
      },
    })
  }, [deleteDialog.product, deleteProduct, toast])

  return (
    <AnimatedPage className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Products</h1>
        <p className="mt-1 text-sm text-muted">Manage your product catalog</p>
      </div>

      <ProductList onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDeleteRequest} />

      <Modal
        open={modal.isOpen}
        onClose={handleCloseModal}
        title={modal.product ? 'Edit Product' : 'New Product'}
        size="lg"
      >
        <ProductForm
          initialData={modal.product}
          onSubmit={handleSubmit}
          isSubmitting={createProduct.isPending || updateProduct.isPending}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.name ?? ''}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </AnimatedPage>
  )
}
