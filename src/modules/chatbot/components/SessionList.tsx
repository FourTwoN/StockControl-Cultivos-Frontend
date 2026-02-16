import { useState, useCallback, useMemo } from 'react'
import { Plus, MessageSquare, Search, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@core/components/ui/Button'
import { ScrollArea } from '@core/components/ui/ScrollArea'
import { Skeleton } from '@core/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { ChatSession } from '../types/Chat.ts'

interface SessionListProps {
  readonly sessions: readonly ChatSession[]
  readonly selectedId: string
  readonly isLoading: boolean
  readonly isCreating: boolean
  readonly onSelect: (id: string) => void
  readonly onNewChat: () => void
  readonly className?: string
}

interface SessionItemProps {
  readonly session: ChatSession
  readonly isSelected: boolean
  readonly onSelect: (id: string) => void
}

function formatSessionDate(session: ChatSession): string {
  const dateStr = session.lastMessageAt ?? session.createdAt
  return format(new Date(dateStr), 'dd/MM HH:mm')
}

function truncatePreview(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title
  return `${title.slice(0, maxLength)}...`
}

function SessionItem({ session, isSelected, onSelect }: SessionItemProps) {
  const handleClick = useCallback(() => {
    onSelect(session.id)
  }, [session.id, onSelect])

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        isSelected
          ? 'bg-primary/10 text-primary'
          : 'text-primary hover:bg-surface',
      )}
    >
      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {truncatePreview(session.title, 40)}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
          <span>{session.messageCount} msgs</span>
          <span aria-hidden="true">&#183;</span>
          <span>{formatSessionDate(session)}</span>
        </div>
      </div>
    </button>
  )
}

function SessionListSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={`skeleton-${i.toString()}`} className="px-3 py-2.5">
          <Skeleton className="mb-2 h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function SessionList({
  sessions,
  selectedId,
  isLoading,
  isCreating,
  onSelect,
  onNewChat,
  className,
}: SessionListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    },
    [],
  )

  const safeSessions = Array.isArray(sessions) ? sessions : []

  const filteredSessions = useMemo(() => {
    if (searchQuery.trim().length === 0) return safeSessions
    const query = searchQuery.toLowerCase()
    return safeSessions.filter((session) =>
      session.title.toLowerCase().includes(query),
    )
  }, [safeSessions, searchQuery])

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold text-primary">Chats</h2>
        <Button
          size="sm"
          onClick={onNewChat}
          disabled={isCreating}
          aria-label="New session"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New
        </Button>
      </div>

      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search conversations..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-primary placeholder:text-muted focus:outline-2 focus:outline-offset-0 focus:outline-primary"
            aria-label="Search conversations"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 py-2">
        {isLoading ? (
          <SessionListSkeleton />
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <MessageSquare className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted">
              {searchQuery.length > 0
                ? 'No matching conversations'
                : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {filteredSessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isSelected={session.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
