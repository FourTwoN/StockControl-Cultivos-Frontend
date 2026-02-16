import { useState, useCallback } from 'react'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { Modal } from '@core/components/ui/Modal'
import { useToast } from '@core/components/ui/Toast'
import { SaleList } from '../components/SaleList.tsx'
import { SaleForm } from '../components/SaleForm.tsx'
import { useCreateSale } from '../hooks/useCreateSale.ts'
import type { SaleFormData } from '../types/schemas.ts'

export function VentasPage() {
  const toast = useToast()
  const createSale = useCreateSale()

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const handleOpenCreate = useCallback(() => {
    setIsCreateOpen(true)
  }, [])

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false)
  }, [])

  const handleSubmit = useCallback(
    (data: SaleFormData) => {
      createSale.mutate(data, {
        onSuccess: () => {
          toast.success('Sale created successfully')
          setIsCreateOpen(false)
        },
        onError: () => {
          toast.error('Failed to create sale')
        },
      })
    },
    [createSale, toast],
  )

  return (
    <AnimatedPage className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Sales</h1>
        <p className="mt-1 text-sm text-muted">Manage sales and view receipts</p>
      </div>

      <SaleList onCreate={handleOpenCreate} />

      <Modal open={isCreateOpen} onClose={handleCloseCreate} title="New Sale" size="lg">
        <SaleForm onSubmit={handleSubmit} isSubmitting={createSale.isPending} />
      </Modal>
    </AnimatedPage>
  )
}
