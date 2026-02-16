export interface PhotoSession {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  readonly imageCount: number
  readonly processedCount: number
  readonly detectionCount: number
  readonly createdBy: string
  readonly createdAt: string
  readonly completedAt?: string
}

export interface SessionImage {
  readonly id: string
  readonly sessionId: string
  readonly originalUrl: string
  readonly processedUrl?: string
  readonly thumbnailUrl?: string
  readonly fileName: string
  readonly fileSize: number
  readonly latitude?: number
  readonly longitude?: number
  readonly capturedAt?: string
  readonly detections?: readonly Detection[]
}

export interface Detection {
  readonly id: string
  readonly className: string
  readonly confidence: number
  readonly boundingBox: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }
}

export interface ProcessingStatus {
  readonly sessionId: string
  readonly status: PhotoSession['status']
  readonly progress: number
  readonly processedCount: number
  readonly totalCount: number
  readonly errors: readonly string[]
}
