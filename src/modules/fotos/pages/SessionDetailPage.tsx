import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Camera } from 'lucide-react'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { Button } from '@core/components/ui/Button'
import { Card } from '@core/components/ui/Card'
import { Badge } from '@core/components/ui/Badge'
import { Skeleton } from '@core/components/ui/Skeleton'
import { usePhotoSession } from '../hooks/usePhotoSession.ts'
import { useSessionImages } from '../hooks/useSessionImages.ts'
import { ProcessingProgress } from '../components/ProcessingProgress.tsx'
import { PhotoGallery } from '../components/PhotoGallery.tsx'
import { ImageCompare } from '../components/ImageCompare.tsx'
import type { PhotoSession } from '../types/Photo.ts'
import type { SessionImage } from '../types/Photo.ts'

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

export function SessionDetailPage() {
  const { sessionId = '' } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const { data: session, isLoading: isLoadingSession } = usePhotoSession(sessionId)
  const { data: images, isLoading: isLoadingImages } = useSessionImages(sessionId)

  const [selectedImage, setSelectedImage] = useState<SessionImage | null>(null)

  const handleBack = useCallback(() => {
    void navigate('/fotos')
  }, [navigate])

  const handleImageSelect = useCallback((image: SessionImage) => {
    setSelectedImage(image)
  }, [])

  if (isLoadingSession) {
    return (
      <AnimatedPage className="p-4 sm:p-6">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="mb-4 h-32" variant="rectangle" />
        <Skeleton className="h-64" variant="rectangle" />
      </AnimatedPage>
    )
  }

  if (!session) {
    return (
      <AnimatedPage className="p-4 sm:p-6">
        <p className="text-muted">Session not found</p>
        <Button variant="ghost" onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </Button>
      </AnimatedPage>
    )
  }

  const showCompare = selectedImage?.processedUrl != null

  return (
    <AnimatedPage className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary">{session.name}</h1>
              <Badge variant={STATUS_BADGE_MAP[session.status]}>
                {STATUS_LABELS[session.status]}
              </Badge>
            </div>
            {session.description && (
              <p className="mt-0.5 text-sm text-muted">{session.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Camera className="h-4 w-4" />
            {session.imageCount} image{session.imageCount !== 1 ? 's' : ''}
          </span>
          <span>
            {session.detectionCount} detection{session.detectionCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Processing Progress */}
      {(session.status === 'PROCESSING' || session.status === 'PENDING') && (
        <div className="mb-6">
          <ProcessingProgress sessionId={sessionId} />
        </div>
      )}

      {/* Session Info */}
      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Created By" value={session.createdBy} />
          <InfoItem label="Created At" value={new Date(session.createdAt).toLocaleString()} />
          <InfoItem label="Processed" value={`${session.processedCount} / ${session.imageCount}`} />
          {session.completedAt && (
            <InfoItem label="Completed At" value={new Date(session.completedAt).toLocaleString()} />
          )}
        </div>
      </Card>

      {/* Image Compare */}
      {showCompare && selectedImage && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-primary">
            Image Comparison: {selectedImage.fileName}
          </h2>
          <ImageCompare
            originalUrl={selectedImage.originalUrl}
            processedUrl={selectedImage.processedUrl!}
          />
        </div>
      )}

      {/* Photo Gallery */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-primary">Images</h2>
        <PhotoGallery
          images={images ?? []}
          isLoading={isLoadingImages}
          onImageSelect={handleImageSelect}
        />
      </div>
    </AnimatedPage>
  )
}

interface InfoItemProps {
  readonly label: string
  readonly value: string
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm font-medium text-primary">{value}</p>
    </div>
  )
}
