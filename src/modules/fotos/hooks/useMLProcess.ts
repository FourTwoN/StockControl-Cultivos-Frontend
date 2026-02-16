import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@core/api'

interface ProcessImageRequest {
  filename: string
  contentType: string
  imageBase64: string
  pipeline: string
}

interface SessionStatus {
  sessionId: string
  status: string
  totalImages: number
  processedImages: number
}

interface ProcessingResponse {
  success: boolean
  sessionId: string
  imageId: string
  pipeline: string
  durationMs: number
  segmentsFound: number
  detectionsFound: number
  sessionStatus: SessionStatus
  error: string | null
}

interface PipelineInfo {
  steps: string[]
}

interface PipelinesResponse {
  industry: string
  version: string
  pipelines: Record<string, PipelineInfo>
}

interface MLHealthResponse {
  mlWorkerAvailable: boolean
  profile: string
}

/**
 * Hook to process an image through the ML pipeline.
 */
export function useMLProcess() {
  return useMutation({
    mutationFn: async (request: ProcessImageRequest): Promise<ProcessingResponse> => {
      const response = await apiClient.post<ProcessingResponse>('/api/v1/dev/ml/process', request)
      return response.data
    },
  })
}

/**
 * Hook to get available ML pipelines.
 */
export function useMLPipelines() {
  return useQuery({
    queryKey: ['ml-pipelines'],
    queryFn: async (): Promise<PipelinesResponse> => {
      const response = await apiClient.get<PipelinesResponse>('/api/v1/dev/ml/pipelines')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

/**
 * Hook to check ML Worker health.
 */
export function useMLHealth() {
  return useQuery({
    queryKey: ['ml-health'],
    queryFn: async (): Promise<MLHealthResponse> => {
      const response = await apiClient.get<MLHealthResponse>('/api/v1/dev/ml/health')
      return response.data
    },
    refetchInterval: 10000, // Check every 10 seconds
    retry: false,
  })
}

/**
 * Convert a File to Base64 string.
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
