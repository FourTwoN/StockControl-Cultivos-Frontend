import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Camera, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@core/components/ui/Card'
import { Badge } from '@core/components/ui/Badge'
import type { PhotoSession } from '../types/Photo.ts'

interface SessionCardProps {
  readonly session: PhotoSession
}

type BadgeVariant = 'default' | 'warning' | 'success' | 'destructive'

const STATUS_BADGE_MAP: Readonly<Record<PhotoSession['status'], BadgeVariant>> = {
  PENDING: 'default',
  PROCESSING: 'warning',
  COMPLETED: 'success',
  FAILED: 'destructive',
}

const STATUS_LABELS: Readonly<Record<PhotoSession['status'], string>> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
}

const STATUS_ICONS: Readonly<Record<PhotoSession['status'], typeof Clock>> = {
  PENDING: Clock,
  PROCESSING: Loader2,
  COMPLETED: CheckCircle2,
  FAILED: AlertCircle,
}

function computeProgress(session: PhotoSession): number {
  if (session.imageCount === 0) return 0
  return Math.round((session.processedCount / session.imageCount) * 100)
}

export function SessionCard({ session }: SessionCardProps) {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    void navigate(`/fotos/${session.id}`)
  }, [navigate, session.id])

  const progress = computeProgress(session)
  const StatusIcon = STATUS_ICONS[session.status]

  return (
    <Card onClick={handleClick} className={cn(
      'flex flex-col gap-3',
      session.status === 'PROCESSING' && 'ring-1 ring-warning/30 animate-pulse',
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-primary">{session.name}</h3>
          {session.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted">{session.description}</p>
          )}
        </div>
        <Badge variant={STATUS_BADGE_MAP[session.status]}>
          <StatusIcon
            className={cn(
              'mr-1 h-3 w-3',
              session.status === 'PROCESSING' && 'animate-spin',
            )}
          />
          {STATUS_LABELS[session.status]}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <Camera className="h-3.5 w-3.5" />
          {session.imageCount} image{session.imageCount !== 1 ? 's' : ''}
        </span>
        <span>
          {session.processedCount} / {session.imageCount} processed
        </span>
        {session.detectionCount > 0 && (
          <span className="font-medium text-warning">
            {session.detectionCount} detection{session.detectionCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-border/40">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              session.status === 'FAILED' ? 'bg-destructive' : 'bg-primary',
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-right text-[10px] text-muted">{progress}%</span>
      </div>

      <p className="text-[10px] text-muted">
        Created {new Date(session.createdAt).toLocaleDateString()}
        {session.completedAt && (
          <> &middot; Completed {new Date(session.completedAt).toLocaleDateString()}</>
        )}
      </p>
    </Card>
  )
}
