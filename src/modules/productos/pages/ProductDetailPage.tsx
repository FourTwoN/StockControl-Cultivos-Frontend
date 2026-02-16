import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Pencil } from 'lucide-react'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { Card } from '@core/components/ui/Card'
import { Badge } from '@core/components/ui/Badge'
import { Button } from '@core/components/ui/Button'
import { Modal } from '@core/components/ui/Modal'
import { Skeleton } from '@core/components/ui/Skeleton'
import { useToast } from '@core/components/ui/Toast'
import { useProduct } from '../hooks/useProduct.ts'
import { useUpdateProduct } from '../hooks/useUpdateProduct.ts'
import { ProductForm } from '../components/ProductForm.tsx'
import type { ProductFormData } from '../types/schemas.ts'

type BadgeVariant = 'success' | 'warning' | 'default'

const STATE_BADGE_MAP: Readonly<Record<string, BadgeVariant>> = {
  healthy: 'success',
  diseased: 'destructive' as BadgeVariant,
  dormant: 'warning',
}

export function ProductDetailPage() {
  const { productId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: product, isLoading } = useProduct(productId)
  const updateProduct = useUpdateProduct()

  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleBack = useCallback(() => {
    void navigate('/productos')
  }, [navigate])

  const handleOpenEdit = useCallback(() => {
    setIsEditOpen(true)
  }, [])

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false)
  }, [])

  const handleSubmit = useCallback(
    (data: ProductFormData) => {
      updateProduct.mutate(
        { id: productId, data },
        {
          onSuccess: () => {
            toast.success('Product updated successfully')
            setIsEditOpen(false)
          },
          onError: () => {
            toast.error('Failed to update product')
          },
        },
      )
    },
    [productId, updateProduct, toast],
  )

  if (isLoading) {
    return (
      <AnimatedPage className="p-4 sm:p-6">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" variant="rectangle" />
          <Skeleton className="h-64" variant="rectangle" />
        </div>
      </AnimatedPage>
    )
  }

  if (!product) {
    return (
      <AnimatedPage className="p-4 sm:p-6">
        <p className="text-muted">Product not found</p>
        <Button variant="ghost" onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
            <p className="text-sm text-muted">SKU: {product.sku}</p>
          </div>
        </div>
        <Button onClick={handleOpenEdit}>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-primary">General Information</h2>
          <dl className="flex flex-col gap-3">
            <div>
              <dt className="text-xs font-medium uppercase text-muted">Description</dt>
              <dd className="mt-1 text-sm text-primary">{product.description}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted">State</dt>
              <dd className="mt-1">
                <Badge variant={STATE_BADGE_MAP[product.state]}>{product.state}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted">Size Classification</dt>
              <dd className="mt-1 text-sm text-primary">{product.sizeClassification || 'N/A'}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-primary">Classification</h2>
          <dl className="flex flex-col gap-3">
            <div>
              <dt className="text-xs font-medium uppercase text-muted">Category</dt>
              <dd className="mt-1 text-sm text-primary">{product.categoryName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted">Family</dt>
              <dd className="mt-1 text-sm text-primary">{product.familyName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted">Created</dt>
              <dd className="mt-1 text-sm text-primary">
                {new Date(product.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted">Last Updated</dt>
              <dd className="mt-1 text-sm text-primary">
                {new Date(product.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </Card>

        {product.imageUrl && (
          <Card className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-primary">Image</h2>
            <div className="overflow-hidden rounded-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-auto max-h-96 w-full object-contain"
              />
            </div>
          </Card>
        )}
      </div>

      <Modal open={isEditOpen} onClose={handleCloseEdit} title="Edit Product" size="lg">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isSubmitting={updateProduct.isPending}
        />
      </Modal>
    </AnimatedPage>
  )
}
