import { useCallback, useRef } from 'react'
import { Send, Loader2, Paperclip } from 'lucide-react'
import { Button } from '@core/components/ui/Button'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  readonly value: string
  readonly onChange: (value: string) => void
  readonly onSubmit: () => void
  readonly isStreaming: boolean
  readonly className?: string
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  isStreaming,
  className,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    },
    [onSubmit],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)

      const textarea = e.target
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160).toString()}px`
    },
    [onChange],
  )

  const isSendDisabled = value.trim().length === 0 || isStreaming

  return (
    <div className={cn('border-t border-border bg-background p-4', className)}>
      <div className="flex items-end gap-2">
        <button
          type="button"
          disabled={isStreaming}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          disabled={isStreaming}
          className="flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-2 focus:outline-offset-0 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Message input"
        />

        <Button
          onClick={onSubmit}
          disabled={isSendDisabled}
          size="md"
          aria-label="Send message"
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      <p className="mt-1.5 text-xs text-muted">
        Press <kbd className="rounded bg-surface-hover px-1 py-0.5 text-xs font-mono">Enter</kbd>{' '}
        to send,{' '}
        <kbd className="rounded bg-surface-hover px-1 py-0.5 text-xs font-mono">Shift + Enter</kbd>{' '}
        for new line
      </p>
    </div>
  )
}
