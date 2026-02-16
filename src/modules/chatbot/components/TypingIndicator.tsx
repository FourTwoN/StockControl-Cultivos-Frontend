import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import '../styles/chatbot.css'

interface TypingIndicatorProps {
  readonly className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-start gap-2', className)}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-surface px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
          <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
          <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  )
}
