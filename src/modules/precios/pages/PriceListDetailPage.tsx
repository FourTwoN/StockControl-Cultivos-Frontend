import { useState, useCallback } from 'react'
import { useParams } from 'react-router'
import { ArrowLeft, Upload, DollarSign } from 'lucide-react'
import { Button } from '@core/components/ui/Button.tsx'
import { Skeleton } from '@core/components/ui/Skeleton.tsx'
import { EmptyState } from '@core/components/ui/EmptyState.tsx'
import { Badge } from '@core/components/ui/Badge.tsx'
import { useToast } from '@core/components/ui/Toast.tsx'
import type { PriceItemFormData } from '../types/schemas.ts'
import { PriceTable } from '../components/PriceTable.tsx'
import { PriceUploadModal } from '../components/PriceUploadModal.tsx'
import { usePriceList } from '../hooks/usePriceList.ts'
import { usePriceItems } from '../hooks/usePriceItems.ts'
import { useUpdatePriceItem } from '../hooks/useUpdatePriceItem.ts'
import { useBulkUpload } from '../hooks/useBulkUpload.ts'

export default function PriceListDetailPage() {
  const { listId = '' } = useParams<{ listId: string }>()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const toast = useToast()

  const { data: priceList, isLoading: isLoadingList } = usePriceList(listId)
  const { data: items, isLoading: isLoadingItems } = usePriceItems(listId)
  const updateMutation = useUpdatePriceItem()
  const uploadMutation = useBulkUpload()

  const handleUpdateItem = useCallback(
    (itemId: string, data: PriceItemFormData) => {
      updateMutation.mutate(
        { listId, itemId, data },
        {
          onSuccess: () => {
            toast.success('Price item updated')
          },
          onError: () => {
            toast.error('Failed to update price item')
          },
        },
      )
    },
    [listId, updateMutation, toast],
  )

  const handleUpload = useCallback(
    (file: File) => {
      uploadMutation.mutate(
        { listId, file },
        {
          onSuccess: () => {
            toast.success('CSV uploaded successfully')
            setIsUploadOpen(false)
          },
          onError: () => {
            toast.error('Failed to upload CSV')
          },
        },
      )
    },
    [listId, uploadMutation, toast],
  )

  const isLoading = isLoadingList || isLoadingItems

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton variant="rectangle" className="h-12" />
        <Skeleton variant="rectangle" className="h-64" />
      </div>
    )
  }

  if (!priceList) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<DollarSign className="h-8 w-8" />}
          title="Price list not found"
          description="The requested price list could not be found."
          action={
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary">{priceList.name}</h1>
              <Badge variant={priceList.isActive ? 'success' : 'outline'}>
                {priceList.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {priceList.description && <p className="text-sm text-muted">{priceList.description}</p>}
          </div>
        </div>

        <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload CSV
        </Button>
      </div>

      <PriceTable items={items ?? []} isLoading={isLoadingItems} onUpdateItem={handleUpdateItem} />

      <PriceUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onConfirm={handleUpload}
        isUploading={uploadMutation.isPending}
      />
    </div>
  )
}
