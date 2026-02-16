export interface ChatSession {
  readonly id: string
  readonly title: string
  readonly messageCount: number
  readonly lastMessageAt?: string
  readonly createdAt: string
}

export interface ChatMessage {
  readonly id: string
  readonly sessionId: string
  readonly role: 'user' | 'assistant' | 'system'
  readonly content: string
  readonly toolExecutions?: readonly ToolExecution[]
  readonly chartData?: ChartData
  readonly createdAt: string
}

export interface ToolExecution {
  readonly id: string
  readonly toolName: string
  readonly input: Record<string, unknown>
  readonly output: Record<string, unknown>
  readonly status: 'success' | 'error'
  readonly executionTimeMs: number
}

export interface ChartData {
  readonly type: 'bar' | 'line' | 'pie'
  readonly title: string
  readonly data: readonly Record<string, unknown>[]
  readonly xKey: string
  readonly yKey: string
}

export interface StreamChunk {
  readonly type: 'text' | 'tool_start' | 'tool_end' | 'chart' | 'done' | 'error'
  readonly content: string
  readonly data?: Record<string, unknown>
}
