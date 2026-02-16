import { useState, useCallback, useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { chatService } from '../services/chatService.ts'
import type { StreamChunk, ToolExecution, ChartData } from '../types/Chat.ts'

interface StreamState {
  readonly isStreaming: boolean
  readonly streamedContent: string
  readonly activeToolExecutions: readonly ToolExecution[]
  readonly chartData: ChartData | null
  readonly error: string | null
}

const INITIAL_STATE: StreamState = {
  isStreaming: false,
  streamedContent: '',
  activeToolExecutions: [],
  chartData: null,
  error: null,
}

function appendContent(prev: string, chunk: string): string {
  return prev + chunk
}

function addToolExecution(
  prev: readonly ToolExecution[],
  data: Record<string, unknown>,
): readonly ToolExecution[] {
  const execution: ToolExecution = {
    id: (data['id'] as string) ?? crypto.randomUUID(),
    toolName: (data['toolName'] as string) ?? 'unknown',
    input: (data['input'] as Record<string, unknown>) ?? {},
    output: (data['output'] as Record<string, unknown>) ?? {},
    status: (data['status'] as 'success' | 'error') ?? 'success',
    executionTimeMs: (data['executionTimeMs'] as number) ?? 0,
  }
  return [...prev, execution]
}

export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient()
  const [state, setState] = useState<StreamState>(INITIAL_STATE)
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
            streamedContent: appendContent(prev.streamedContent, chunk.content),
          }))
          break

        case 'tool_start':
          setState((prev) => ({
            ...prev,
            streamedContent: appendContent(prev.streamedContent, chunk.content),
          }))
          break

        case 'tool_end':
          setState((prev) => ({
            ...prev,
            activeToolExecutions: chunk.data
              ? addToolExecution(prev.activeToolExecutions, chunk.data)
              : prev.activeToolExecutions,
          }))
          break

        case 'chart':
          setState((prev) => ({
            ...prev,
            chartData: chunk.data ? (chunk.data as unknown as ChartData) : prev.chartData,
          }))
          break

        case 'done':
          setState((prev) => ({
            ...prev,
            isStreaming: false,
          }))
          closeConnection()
          void queryClient.invalidateQueries({
            queryKey: ['chat-messages', sessionId],
          })
          void queryClient.invalidateQueries({
            queryKey: ['chat-sessions'],
          })
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
    [closeConnection, queryClient, sessionId],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (state.isStreaming || sessionId.length === 0) return

      setState({
        ...INITIAL_STATE,
        isStreaming: true,
      })

      try {
        await chatService.sendMessage(sessionId, content)

        const connection = chatService.streamMessage(sessionId)
        connectionRef.current = connection
        connection.onChunk(handleChunk)
      } catch {
        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: 'Failed to send message. Please try again.',
        }))
      }
    },
    [sessionId, state.isStreaming, handleChunk],
  )

  return {
    sendMessage,
    isStreaming: state.isStreaming,
    streamedContent: state.streamedContent,
    activeToolExecutions: state.activeToolExecutions,
    chartData: state.chartData,
    error: state.error,
  }
}
