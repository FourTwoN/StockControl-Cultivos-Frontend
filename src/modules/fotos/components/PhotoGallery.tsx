import { useState, useCallback } from 'react'
import { Eye } from 'lucide-react'
import { AnimatedList, AnimatedListItem } from '@core/components/motion/AnimatedList'
import { Badge } from '@core/components/ui/Badge'
import { Modal } from '@core/components/ui/Modal'
import { Skeleton } from '@core/components/ui/Skeleton'
import { EmptyState } from '@core/components/ui/EmptyState'
import type { SessionImage } from '../types/Photo.ts'

interface PhotoGalleryProps {
  readonly images: readonly SessionImage[]
  readonly isLoading: boolean
  readonly onImageSelect?: (image: SessionImage) => void
}

export function PhotoGallery({ images, isLoading, onImageSelect }: PhotoGalleryProps) {
  const [previewImage, setPreviewImage] = useState<SessionImage | null>(null)

  const handleImageClick = useCallback(
    (image: SessionImage) => {
      setPreviewImage(image)
      onImageSelect?.(image)
    },
    [onImageSelect],
  )

  const handleClosePreview = useCallback(() => {
    setPreviewImage(null)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" variant="rectangle" />
        ))}
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <EmptyState
        icon={<Eye className="h-8 w-8" />}
        title="No images yet"
        description="Upload photos to this session to get started with detection analysis."
      />
    )
  }

  return (
    <>
      <AnimatedList className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <AnimatedListItem key={image.id}>
            <ImageCard image={image} onClick={handleImageClick} />
          </AnimatedListItem>
        ))}
      </AnimatedList>

      <Modal
        open={previewImage !== null}
        onClose={handleClosePreview}
        title={previewImage?.fileName ?? 'Image Preview'}
        size="lg"
      >
        {previewImage && (
          <div className="flex flex-col gap-4">
            <img
              src={previewImage.processedUrl ?? previewImage.originalUrl}
              alt={previewImage.fileName}
              className="w-full rounded-lg object-contain"
            />
            {previewImage.detections && previewImage.detections.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewImage.detections.map((detection) => (
                  <Badge key={detection.id} variant="default">
                    {detection.className} ({Math.round(detection.confidence * 100)}%)
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

interface ImageCardProps {
  readonly image: SessionImage
  readonly onClick: (image: SessionImage) => void
}

function ImageCard({ image, onClick }: ImageCardProps) {
  const handleClick = useCallback(() => {
    onClick(image)
  }, [image, onClick])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick(image)
      }
    },
    [image, onClick],
  )

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-surface transition-shadow hover:shadow-md"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="aspect-square">
        <img
          src={image.thumbnailUrl ?? image.originalUrl}
          alt={image.fileName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {(image.detections?.length ?? 0) > 0 && (
        <div className="absolute right-2 top-2">
          <Badge variant="warning">
            {image.detections!.length} detection{image.detections!.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <p className="truncate text-xs text-white">{image.fileName}</p>
      </div>
    </div>
  )
}
