import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Plus, Calendar, MapPin } from 'lucide-react'
import { Card } from '@core/components/ui/Card'
import { Button } from '@core/components/ui/Button'
import { Modal } from '@core/components/ui/Modal'
import { Skeleton } from '@core/components/ui/Skeleton'
import { useToast } from '@core/components/ui/Toast'
import { useStockBatch } from '../hooks/useStockBatch.ts'
import { useMovements } from '../hooks/useMovements.ts'
import { useCreateMovement } from '../hooks/useCreateMovement.ts'
import { BatchStatusBadge } from '../components/BatchStatusBadge.tsx'
import { MovementHistory } from '../components/MovementHistory.tsx'
import { MovementForm } from '../components/MovementForm.tsx'
import type { MovementRequest } from '../types/schemas.ts'

type ActiveTab = 'info' | 'movements' | 'new-movement'

export function BatchDetailPage() {
  const { batchId = '' } = useParams<{ batchId: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const { data: batch, isLoading: batchLoading } = useStockBatch(batchId)
  const { data: movementsData, isLoading: movementsLoading } = useMovements({
    batchId,
    page: 0,
    size: 50,
  })
  const createMovement = useCreateMovement()

  const [activeTab, setActiveTab] = useState<ActiveTab>('info')
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false)

  const handleBack = useCallback(() => {
    void navigate('/inventario')
  }, [navigate])

  const handleOpenMovementModal = useCallback(() => {
    setIsMovementModalOpen(true)
  }, [])

  const handleCloseMovementModal = useCallback(() => {
    setIsMovementModalOpen(false)
  }, [])

  const handleSubmitMovement = useCallback(
    (data: MovementRequest) => {
      createMovement.mutate(data, {
        onSuccess: () => {
          toast.success('Movement recorded successfully')
          setIsMovementModalOpen(false)
          setActiveTab('movements')
        },
        onError: () => {
          toast.error('Failed to record movement')
        },
      })
    },
    [createMovement, toast],
  )

  if (batchLoading) {
    return (
      <div className="p-4 sm:p-6">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" variant="rectangle" />
          <Skeleton className="h-64" variant="rectangle" />
        </div>
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-muted">Batch not found</p>
        <Button variant="ghost" onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Button>
      </div>
    )
  }

  const quantityPercentage =
    batch.initialQuantity > 0 ? Math.round((batch.quantity / batch.initialQuantity) * 100) : 0

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary">{batch.productName}</h1>
              <BatchStatusBadge status={batch.status} />
            </div>
            <p className="text-sm text-muted">SKU: {batch.productSku}</p>
          </div>
        </div>
        <Button onClick={handleOpenMovementModal}>
          <Plus className="h-4 w-4" />
          New Movement
        </Button>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-1 border-b border-border">
        {(
          [
            { key: 'info', label: 'Information' },
            { key: 'movements', label: 'Movements' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              'px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted hover:text-primary',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Batch details */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-primary">Batch Details</h2>
            <dl className="flex flex-col gap-3">
              <div>
                <dt className="text-xs font-medium uppercase text-muted">Quantity</dt>
                <dd className="mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{batch.quantity}</span>
                    <span className="text-sm text-muted">/ {batch.initialQuantity} initial</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className={[
                        'h-full rounded-full transition-all',
                        quantityPercentage > 50
                          ? 'bg-success'
                          : quantityPercentage > 20
                            ? 'bg-warning'
                            : 'bg-destructive',
                      ].join(' ')}
                      style={{
                        width: `${Math.min(quantityPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </dd>
              </div>

              {batch.notes && (
                <div>
                  <dt className="text-xs font-medium uppercase text-muted">Notes</dt>
                  <dd className="mt-1 text-sm text-primary">{batch.notes}</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Location and dates */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-primary">Location & Dates</h2>
            <dl className="flex flex-col gap-3">
              <div>
                <dt className="text-xs font-medium uppercase text-muted">Location</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm text-primary">
                  <MapPin className="h-4 w-4 text-muted" />
                  {batch.locationName}
                  {batch.binName ? ` / ${batch.binName}` : ''}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase text-muted">Entry Date</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm text-primary">
                  <Calendar className="h-4 w-4 text-muted" />
                  {new Date(batch.entryDate).toLocaleDateString()}
                </dd>
              </div>

              {batch.expiryDate && (
                <div>
                  <dt className="text-xs font-medium uppercase text-muted">Expiry Date</dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm text-primary">
                    <Calendar className="h-4 w-4 text-muted" />
                    {new Date(batch.expiryDate).toLocaleDateString()}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-xs font-medium uppercase text-muted">Created</dt>
                <dd className="mt-1 text-sm text-primary">
                  {new Date(batch.createdAt).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase text-muted">Last Updated</dt>
                <dd className="mt-1 text-sm text-primary">
                  {new Date(batch.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      )}

      {activeTab === 'movements' && (
        <MovementHistory movements={movementsData?.content ?? []} isLoading={movementsLoading} />
      )}

      {/* Movement modal */}
      <Modal
        open={isMovementModalOpen}
        onClose={handleCloseMovementModal}
        title="Record Movement"
        size="md"
      >
        <MovementForm
          batchId={batchId}
          onSubmit={handleSubmitMovement}
          onCancel={handleCloseMovementModal}
          isSubmitting={createMovement.isPending}
        />
      </Modal>
    </div>
  )
}
