import { useState, useCallback } from 'react'
import { AlertCircle, Bot } from 'lucide-react'
import { Skeleton } from '@core/components/ui/Skeleton'
import { AnimatedList, AnimatedListItem } from '@core/components/motion/AnimatedList'
import { MessageBubble } from './MessageBubble.tsx'
import { ToolResultCard } from './ToolResultCard.tsx'
import { ChartRenderer } from './ChartRenderer.tsx'
import { MarkdownRenderer } from './MarkdownRenderer.tsx'
import { TypingIndicator } from './TypingIndicator.tsx'
import { MessageInput } from './MessageInput.tsx'
import { useChatMessages } from '../hooks/useChatMessages.ts'
import { useSendMessage } from '../hooks/useSendMessage.ts'
import { useAutoScroll } from '../hooks/useAutoScroll.ts'
import type { ChatMessage } from '../types/Chat.ts'
import '../styles/chatbot.css'

interface ChatWindowProps {
  readonly sessionId: string
}

function StreamingBubble({
  content,
  toolExecutions,
  chartData,
}: {
  readonly content: string
  readonly toolExecutions: readonly import('../types/Chat.ts').ToolExecution[]
  readonly chartData: import('../types/Chat.ts').ChartData | null
}) {
  return (
    <div className="flex items-start gap-2 chat-message-enter">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm">
          <MarkdownRenderer content={content} />
          <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-primary" />
        </div>

        {toolExecutions.length > 0 && (
          <div className="mt-2">
            {toolExecutions.map((execution) => (
              <ToolResultCard key={execution.id} execution={execution} />
            ))}
          </div>
        )}

        {chartData && <ChartRenderer chartData={chartData} />}
      </div>
    </div>
  )
}

function MessageList({
  messages,
  isLoading,
}: {
  readonly messages: readonly ChatMessage[]
  readonly isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="ml-auto h-8 w-1/2" />
        <Skeleton className="h-16 w-3/4" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <p className="text-lg font-medium text-primary">Start a conversation</p>
        <p className="max-w-sm text-sm text-muted">
          Ask questions about your inventory, sales data, or request analytics reports.
        </p>
      </div>
    )
  }

  return (
    <AnimatedList className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <AnimatedListItem key={message.id}>
          <MessageBubble message={message} />
        </AnimatedListItem>
      ))}
    </AnimatedList>
  )
}

function ErrorBanner({ error }: { readonly error: string }) {
  return (
    <div className="mx-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{error}</span>
    </div>
  )
}

export function ChatWindow({ sessionId }: ChatWindowProps) {
  const [input, setInput] = useState('')

  const { data: messages, isLoading: isLoadingMessages } = useChatMessages(sessionId)

  const { sendMessage, isStreaming, streamedContent, activeToolExecutions, chartData, error } =
    useSendMessage(sessionId)

  const { containerRef, endRef } = useAutoScroll({
    dependency: [messages, streamedContent],
  })

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (trimmed.length === 0 || isStreaming) return

    void sendMessage(trimmed)
    setInput('')
  }, [input, isStreaming, sendMessage])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <MessageList messages={messages ?? []} isLoading={isLoadingMessages} />

        {isStreaming && streamedContent.length > 0 && (
          <div className="px-4 pb-4">
            <StreamingBubble
              content={streamedContent}
              toolExecutions={activeToolExecutions}
              chartData={chartData}
            />
          </div>
        )}

        {isStreaming && streamedContent.length === 0 && (
          <div className="px-4 pb-4">
            <TypingIndicator />
          </div>
        )}

        {error && <ErrorBanner error={error} />}

        <div ref={endRef} />
      </div>

      <MessageInput
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isStreaming={isStreaming}
      />
    </div>
  )
}
