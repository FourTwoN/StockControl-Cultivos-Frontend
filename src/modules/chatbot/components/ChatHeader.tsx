import { useCallback } from 'react'
import { Plus, Loader2, MessageSquare, Menu } from 'lucide-react'
import { Button } from '@core/components/ui/Button'
import { cn } from '@/lib/utils'

interface ChatHeaderProps {
  readonly sessionTitle: string
  readonly sessionCount: number
  readonly isCreating: boolean
  readonly onNewChat: () => void
  readonly onToggleSidebar: () => void
  readonly className?: string
}

export function ChatHeader({
  sessionTitle,
  sessionCount,
  isCreating,
  onNewChat,
  onToggleSidebar,
  className,
}: ChatHeaderProps) {
  const handleNewChat = useCallback(() => {
    onNewChat()
  }, [onNewChat])

  const displayTitle = sessionTitle.length > 0 ? sessionTitle : 'New conversation'

  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-border bg-background px-4 py-3',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-primary sm:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted" />
          <h1 className="text-sm font-semibold text-primary">{displayTitle}</h1>
        </div>

        {sessionCount > 0 && (
          <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
            {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
          </span>
        )}
      </div>

      <Button
        size="sm"
        onClick={handleNewChat}
        disabled={isCreating}
        aria-label="New chat"
      >
        {isCreating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        New chat
      </Button>
    </div>
  )
}
