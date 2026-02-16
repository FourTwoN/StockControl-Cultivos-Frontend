import { apiClient } from '@core/api/apiClient'
import type { ChatSession, ChatMessage, StreamChunk } from '../types/Chat.ts'

const BASE_PATH = '/api/v1/chat/sessions'

interface StreamConnection {
  readonly onChunk: (callback: (chunk: StreamChunk) => void) => void
  readonly close: () => void
}

function parseSSEEvent(eventData: string): StreamChunk {
  try {
    return JSON.parse(eventData) as StreamChunk
  } catch {
    return { type: 'text', content: eventData }
  }
}

function buildStreamUrl(sessionId: string): string {
  const baseUrl = import.meta.env.VITE_API_URL ?? ''
  return `${baseUrl}${BASE_PATH}/${sessionId}/stream`
}

function buildAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth0_token')
  const tenantId = localStorage.getItem('tenant_id')
  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (tenantId) {
    headers['X-Tenant-ID'] = tenantId
  }

  return headers
}

function streamMessage(sessionId: string): StreamConnection {
  const url = buildStreamUrl(sessionId)
  let chunkCallback: ((chunk: StreamChunk) => void) | null = null

  const headers = buildAuthHeaders()
  const urlWithAuth = new URL(url)

  Object.entries(headers).forEach(([key, value]) => {
    urlWithAuth.searchParams.set(key, value)
  })

  const eventSource = new EventSource(urlWithAuth.toString())

  eventSource.onmessage = (event: MessageEvent<string>) => {
    if (chunkCallback) {
      const chunk = parseSSEEvent(event.data)
      chunkCallback(chunk)
    }
  }

  eventSource.onerror = () => {
    if (chunkCallback) {
      chunkCallback({ type: 'error', content: 'Connection lost. Please try again.' })
    }
    eventSource.close()
  }

  return {
    onChunk: (callback: (chunk: StreamChunk) => void) => {
      chunkCallback = callback
    },
    close: () => {
      eventSource.close()
    },
  }
}

export const chatService = {
  fetchSessions: () => apiClient.get<ChatSession[]>(BASE_PATH).then((r) => r.data),

  createSession: () => apiClient.post<ChatSession>(BASE_PATH).then((r) => r.data),

  fetchMessages: (sessionId: string) =>
    apiClient.get<ChatMessage[]>(`${BASE_PATH}/${sessionId}/messages`).then((r) => r.data),

  sendMessage: (sessionId: string, content: string) =>
    apiClient.post<void>(`${BASE_PATH}/${sessionId}/messages`, { content }).then((r) => r.data),

  streamMessage,
}
