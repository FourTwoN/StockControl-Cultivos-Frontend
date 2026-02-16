import { useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Printer, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@core/components/ui/Card'
import { Badge } from '@core/components/ui/Badge'
import { Button } from '@core/components/ui/Button'
import { Skeleton } from '@core/components/ui/Skeleton'
import { useToast } from '@core/components/ui/Toast'
import { useSale } from '../hooks/useSale.ts'
import { useUpdateSaleStatus } from '../hooks/useUpdateSaleStatus.ts'
import { SaleReceipt } from '../components/SaleReceipt.tsx'
import type { Sale } from '../types/Sale.ts'

type BadgeVariant = 'success' | 'warning' | 'default'

const STATUS_BADGE_MAP: Readonly<Record<Sale['status'], BadgeVariant>> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive' as BadgeVariant,
}

const STATUS_LABELS: Readonly<Record<Sale['status'], string>> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
}

export function SaleDetailPage() {
  const { saleId = '' } = useParams<{ saleId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const receiptRef = useRef<HTMLDivElement>(null)

  const { data: sale, isLoading } = useSale(saleId)
  const updateStatus = useUpdateSaleStatus()

  const handleBack = useCallback(() => {
    void navigate('/ventas')
  }, [navigate])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleConfirm = useCallback(() => {
    updateStatus.mutate(
      { id: saleId, status: 'CONFIRMED' },
      {
        onSuccess: () => {
          toast.success('Sale confirmed successfully')
        },
        onError: () => {
          toast.error('Failed to confirm sale')
        },
      },
    )
  }, [saleId, updateStatus, toast])

  const handleCancel = useCallback(() => {
    updateStatus.mutate(
      { id: saleId, status: 'CANCELLED' },
      {
        onSuccess: () => {
          toast.success('Sale cancelled')
        },
        onError: () => {
          toast.error('Failed to cancel sale')
        },
      },
    )
  }, [saleId, updateStatus, toast])

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-96" variant="rectangle" />
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-muted">Sale not found</p>
        <Button variant="ghost" onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Sales
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary">Sale #{sale.saleNumber}</h1>
              <Badge variant={STATUS_BADGE_MAP[sale.status]}>{STATUS_LABELS[sale.status]}</Badge>
            </div>
            {sale.customerName && (
              <p className="text-sm text-muted">Customer: {sale.customerName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sale.status === 'PENDING' && (
            <>
              <Button variant="outline" onClick={handleConfirm} isLoading={updateStatus.isPending}>
                <CheckCircle className="h-4 w-4" />
                Confirm
              </Button>
              <Button variant="outline" onClick={handleCancel} isLoading={updateStatus.isPending}>
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </div>

      <Card className="print:border-0 print:shadow-none">
        <SaleReceipt ref={receiptRef} sale={sale} />
      </Card>
    </div>
  )
}
