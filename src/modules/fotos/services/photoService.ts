import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { PhotoSession, SessionImage, ProcessingStatus } from '../types/Photo.ts'

const BASE_PATH = '/api/v1/photo-sessions'

interface CreateSessionData {
  readonly name: string
  readonly description?: string
}

// Backend DTO from /images/with-urls endpoint
interface ImageWithUrlsDTO {
  id: string
  sessionId: string
  originalFilename: string
  fileSize: number
  mimeType: string
  imageUrl: string | null
  thumbnailUrl: string | null
  detections: Array<{
    id: string
    label: string
    confidence: number
    boundingBox: Record<string, number>
  }>
  createdAt: string
}

// Map backend DTO to frontend SessionImage type
function mapToSessionImage(dto: ImageWithUrlsDTO): SessionImage {
  return {
    id: dto.id,
    sessionId: dto.sessionId,
    originalUrl: dto.imageUrl ?? '',
    thumbnailUrl: dto.thumbnailUrl ?? undefined,
    fileName: dto.originalFilename ?? 'unknown',
    fileSize: dto.fileSize ?? 0,
    detections: dto.detections?.map((d) => ({
      id: d.id,
      className: d.label,
      confidence: d.confidence,
      boundingBox: {
        x: d.boundingBox?.x1 ?? 0,
        y: d.boundingBox?.y1 ?? 0,
        width: (d.boundingBox?.x2 ?? 0) - (d.boundingBox?.x1 ?? 0),
        height: (d.boundingBox?.y2 ?? 0) - (d.boundingBox?.y1 ?? 0),
      },
    })) ?? [],
  }
}

export const photoService = {
  fetchSessions: (page: number, size: number) =>
    apiClient
      .get<PagedResponse<PhotoSession>>(BASE_PATH, {
        params: { page, size },
      })
      .then((r) => r.data),

  fetchSession: (id: string) =>
    apiClient.get<PhotoSession>(`${BASE_PATH}/${id}`).then((r) => r.data),

  createSession: (data: CreateSessionData) =>
    apiClient.post<PhotoSession>(BASE_PATH, data).then((r) => r.data),

  // Use the new endpoint with signed URLs
  fetchSessionImages: (sessionId: string) =>
    apiClient
      .get<ImageWithUrlsDTO[]>(`${BASE_PATH}/${sessionId}/images/with-urls`)
      .then((r) => r.data.map(mapToSessionImage)),

  uploadPhoto: (sessionId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient
      .post<SessionImage>(`${BASE_PATH}/${sessionId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  fetchSessionStatus: (sessionId: string) =>
    apiClient.get<ProcessingStatus>(`${BASE_PATH}/${sessionId}/status`).then((r) => r.data),
}
