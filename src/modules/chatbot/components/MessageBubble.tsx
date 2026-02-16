import { Bot, User } from 'lucide-react'
import { format } from 'date-fns'
import { MarkdownRenderer } from './MarkdownRenderer.tsx'
import { ToolResultCard } from './ToolResultCard.tsx'
import { ChartRenderer } from './ChartRenderer.tsx'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '../types/Chat.ts'

interface MessageBubbleProps {
  readonly message: ChatMessage
  readonly className?: string
}

function UserAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
      <User className="h-4 w-4" />
    </div>
  )
}

function AssistantAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
      <Bot className="h-4 w-4" />
    </div>
  )
}

function MessageTimestamp({
  createdAt,
  align,
}: {
  readonly createdAt: string
  readonly align: 'left' | 'right'
}) {
  const formatted = format(new Date(createdAt), 'HH:mm')

  return (
    <span
      className={cn(
        'mt-1 block text-xs text-muted',
        align === 'right' ? 'text-right' : 'text-left',
      )}
    >
      {formatted}
    </span>
  )
}

function UserBubble({ message, className }: MessageBubbleProps) {
  return (
    <div className={cn('flex items-start justify-end gap-2 chat-message-enter', className)}>
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-white">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <MessageTimestamp createdAt={message.createdAt} align="right" />
      </div>
      <UserAvatar />
    </div>
  )
}

function AssistantBubble({ message, className }: MessageBubbleProps) {
  return (
    <div className={cn('flex items-start gap-2 chat-message-enter', className)}>
      <AssistantAvatar />
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm">
          <MarkdownRenderer content={message.content} />
        </div>

        {message.toolExecutions && message.toolExecutions.length > 0 && (
          <div className="mt-2">
            {message.toolExecutions.map((execution) => (
              <ToolResultCard key={execution.id} execution={execution} />
            ))}
          </div>
        )}

        {message.chartData && <ChartRenderer chartData={message.chartData} />}

        <MessageTimestamp createdAt={message.createdAt} align="left" />
      </div>
    </div>
  )
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  if (message.role === 'user') {
    return <UserBubble message={message} className={className} />
  }

  return <AssistantBubble message={message} className={className} />
}
