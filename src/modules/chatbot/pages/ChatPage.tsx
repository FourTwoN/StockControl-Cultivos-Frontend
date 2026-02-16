import { useState, useCallback, useMemo } from 'react'
import { Plus, MessageSquare } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@core/components/ui/Button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@core/components/ui/Sheet'
import { ChatWindow } from '../components/ChatWindow.tsx'
import { ChatHeader } from '../components/ChatHeader.tsx'
import { SessionList } from '../components/SessionList.tsx'
import { useChatSessions } from '../hooks/useChatSessions.ts'
import { chatService } from '../services/chatService.ts'

function EmptyChatPanel({ onNewChat }: { readonly onNewChat: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <MessageSquare className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-primary">Demeter AI Chat</h2>
      <p className="max-w-md text-sm text-muted">
        Ask questions about your inventory, get sales insights, or request data analysis. Select an
        existing conversation or start a new one.
      </p>
      <Button onClick={onNewChat}>
        <Plus className="h-4 w-4" />
        Start New Chat
      </Button>
    </div>
  )
}

export function ChatPage() {
  const queryClient = useQueryClient()
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const { data: sessions, isLoading: isLoadingSessions } = useChatSessions()

  const createSession = useMutation({
    mutationFn: () => chatService.createSession(),
    onSuccess: (newSession) => {
      void queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      setSelectedSessionId(newSession.id)
      setIsMobileSidebarOpen(false)
    },
  })

  const handleSelectSession = useCallback((id: string) => {
    setSelectedSessionId(id)
    setIsMobileSidebarOpen(false)
  }, [])

  const handleNewChat = useCallback(() => {
    createSession.mutate()
  }, [createSession])

  const handleToggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev)
  }, [])

  const handleMobileSidebarChange = useCallback((open: boolean) => {
    setIsMobileSidebarOpen(open)
  }, [])

  const sessionList = sessions ?? []
  const hasSelectedSession = selectedSessionId.length > 0

  const selectedSessionTitle = useMemo(() => {
    if (!hasSelectedSession) return ''
    const found = sessionList.find((s) => s.id === selectedSessionId)
    return found?.title ?? ''
  }, [sessionList, selectedSessionId, hasSelectedSession])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-row">
      {/* Desktop sidebar */}
      <div className="hidden h-full w-80 shrink-0 border-r border-border bg-background sm:block">
        <SessionList
          sessions={sessionList}
          selectedId={selectedSessionId}
          isLoading={isLoadingSessions}
          isCreating={createSession.isPending}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Mobile sidebar via Sheet */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={handleMobileSidebarChange}>
        <SheetContent side="left" className="w-80 p-0 sm:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Chat Sessions</SheetTitle>
            <SheetDescription>Browse and manage your chat sessions</SheetDescription>
          </SheetHeader>
          <SessionList
            sessions={sessionList}
            selectedId={selectedSessionId}
            isLoading={isLoadingSessions}
            isCreating={createSession.isPending}
            onSelect={handleSelectSession}
            onNewChat={handleNewChat}
          />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex h-full flex-1 flex-col">
        <ChatHeader
          sessionTitle={selectedSessionTitle}
          sessionCount={sessionList.length}
          isCreating={createSession.isPending}
          onNewChat={handleNewChat}
          onToggleSidebar={handleToggleMobileSidebar}
        />

        {hasSelectedSession ? (
          <ChatWindow sessionId={selectedSessionId} />
        ) : (
          <EmptyChatPanel onNewChat={handleNewChat} />
        )}
      </div>
    </div>
  )
}
