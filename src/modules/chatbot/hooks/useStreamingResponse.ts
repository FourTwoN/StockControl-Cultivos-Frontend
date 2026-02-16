import { useState, useCallback, useRef, useEffect } from 'react'
import { chatService } from '../services/chatService.ts'
import type { StreamChunk, ToolExecution, ChartData } from '../types/Chat.ts'

interface StreamingState {
  readonly data: string
  readonly isStreaming: boolean
  readonly error: string | null
  readonly toolExecutions: readonly ToolExecution[]
  readonly chartData: ChartData | null
}

interface UseStreamingResponseReturn {
  readonly data: string
  readonly isStreaming: boolean
  readonly error: string | null
  readonly toolExecutions: readonly ToolExecution[]
  readonly chartData: ChartData | null
  readonly startStreaming: (sessionId: string) => void
  readonly stopStreaming: () => void
}

const INITIAL_STATE: StreamingState = {
  data: '',
  isStreaming: false,
  error: null,
  toolExecutions: [],
  chartData: null,
}

function appendStreamContent(prev: string, chunk: string): string {
  return prev + chunk
}

function buildToolExecution(incoming: Record<string, unknown>): ToolExecution {
  return {
    id: (incoming['id'] as string) ?? crypto.randomUUID(),
    toolName: (incoming['toolName'] as string) ?? 'unknown',
    input: (incoming['input'] as Record<string, unknown>) ?? {},
    output: (incoming['output'] as Record<string, unknown>) ?? {},
    status: (incoming['status'] as 'success' | 'error') ?? 'success',
    executionTimeMs: (incoming['executionTimeMs'] as number) ?? 0,
  }
}

export function useStreamingResponse(): UseStreamingResponseReturn {
  const [state, setState] = useState<StreamingState>(INITIAL_STATE)
  const connectionRef = useRef<{ close: () => void } | null>(null)

  const closeConnection = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close()
      connectionRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      closeConnection()
    }
  }, [closeConnection])

  const handleChunk = useCallback(
    (chunk: StreamChunk) => {
      switch (chunk.type) {
        case 'text':
          setState((prev) => ({
            ...prev,
            data: appendStreamContent(prev.data, chunk.content),
          }))
          break

        case 'tool_start':
          setState((prev) => ({
            ...prev,
            data: appendStreamContent(prev.data, chunk.content),
          }))
          break

        case 'tool_end':
          setState((prev) => ({
            ...prev,
            toolExecutions: chunk.data
              ? [...prev.toolExecutions, buildToolExecution(chunk.data)]
              : prev.toolExecutions,
          }))
          break

        case 'chart':
          setState((prev) => ({
            ...prev,
            chartData: chunk.data
              ? (chunk.data as unknown as ChartData)
              : prev.chartData,
          }))
          break

        case 'done':
          setState((prev) => ({ ...prev, isStreaming: false }))
          closeConnection()
          break

        case 'error':
          setState((prev) => ({
            ...prev,
            isStreaming: false,
            error: chunk.content,
          }))
          closeConnection()
          break
      }
    },
    [closeConnection],
  )

  const startStreaming = useCallback(
    (sessionId: string) => {
      closeConnection()
      setState({ ...INITIAL_STATE, isStreaming: true })

      const connection = chatService.streamMessage(sessionId)
      connectionRef.current = connection
      connection.onChunk(handleChunk)
    },
    [closeConnection, handleChunk],
  )

  const stopStreaming = useCallback(() => {
    closeConnection()
    setState((prev) => ({ ...prev, isStreaming: false }))
  }, [closeConnection])

  return {
    data: state.data,
    isStreaming: state.isStreaming,
    error: state.error,
    toolExecutions: state.toolExecutions,
    chartData: state.chartData,
    startStreaming,
    stopStreaming,
  }
}
