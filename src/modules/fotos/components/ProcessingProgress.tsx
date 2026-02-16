import { AlertCircle, CheckCircle2, Loader2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@core/components/ui/Badge'
import { Progress } from '@core/components/ui/Progress'
import { Skeleton } from '@core/components/ui/Skeleton'
import { useSessionStatus } from '../hooks/useSessionStatus.ts'
import type { ProcessingStatus } from '../types/Photo.ts'

interface ProcessingProgressProps {
  readonly sessionId: string
}

type BadgeVariant = 'default' | 'warning' | 'success' | 'destructive'

const STATUS_BADGE_MAP: Readonly<Record<ProcessingStatus['status'], BadgeVariant>> = {
  PENDING: 'default',
  PROCESSING: 'warning',
  COMPLETED: 'success',
  FAILED: 'destructive',
}

const STATUS_LABELS: Readonly<Record<ProcessingStatus['status'], string>> = {
  PENDING: 'Waiting to process',
  PROCESSING: 'Processing images...',
  COMPLETED: 'Processing complete',
  FAILED: 'Processing failed',
}

const STATUS_ICONS: Readonly<Record<ProcessingStatus['status'], typeof Clock>> = {
  PENDING: Clock,
  PROCESSING: Loader2,
  COMPLETED: CheckCircle2,
  FAILED: AlertCircle,
}

function computeProgressPercent(status: ProcessingStatus): number {
  if (status.totalCount === 0) return 0
  return Math.round((status.processedCount / status.totalCount) * 100)
}

export function ProcessingProgress({ sessionId }: ProcessingProgressProps) {
  const { data: status, isLoading } = useSessionStatus(sessionId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full" variant="rectangle" />
      </div>
    )
  }

  if (!status) return null

  const progress = computeProgressPercent(status)
  const StatusIcon = STATUS_ICONS[status.status]

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon
            className={cn(
              'h-4 w-4',
              status.status === 'PROCESSING' && 'animate-spin text-warning',
              status.status === 'COMPLETED' && 'text-success',
              status.status === 'FAILED' && 'text-destructive',
              status.status === 'PENDING' && 'text-muted',
            )}
          />
          <span className="text-sm font-medium text-primary">{STATUS_LABELS[status.status]}</span>
        </div>
        <Badge variant={STATUS_BADGE_MAP[status.status]}>{progress}%</Badge>
      </div>

      <div className="flex flex-col gap-1">
        <Progress
          value={progress}
          className={cn(
            'h-2.5',
            status.status === 'FAILED' && '[&>*]:bg-destructive',
          )}
        />
        <p className="text-xs text-muted">
          {status.processedCount} of {status.totalCount} images processed
        </p>
      </div>

      {status.errors.length > 0 && (
        <div className="flex flex-col gap-1 rounded-md border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-xs font-medium text-destructive">
            {status.errors.length} error{status.errors.length !== 1 ? 's' : ''} occurred:
          </p>
          <ul className="flex flex-col gap-0.5">
            {status.errors.map((error, index) => (
              <li key={index} className="text-xs text-destructive/80">
                &bull; {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
