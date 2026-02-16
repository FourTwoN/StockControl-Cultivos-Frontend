import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Clock } from 'lucide-react'
import { Card } from '@core/components/ui/Card'
import { Badge } from '@core/components/ui/Badge'
import type { ToolExecution } from '../types/Chat.ts'

interface ToolResultCardProps {
  readonly execution: ToolExecution
}

function formatExecutionTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatJson(data: Record<string, unknown>): string {
  return JSON.stringify(data, null, 2)
}

export function ToolResultCard({ execution }: ToolResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const statusVariant = execution.status === 'success' ? 'success' : 'destructive'
  const statusLabel = execution.status === 'success' ? 'Success' : 'Error'

  return (
    <Card className="my-2 bg-background">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 text-left"
        onClick={handleToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
          <span className="text-sm font-medium text-primary">{execution.toolName}</span>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted">
          <Clock className="h-3 w-3" />
          <span>{formatExecutionTime(execution.executionTimeMs)}</span>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Input</p>
            <pre className="overflow-x-auto rounded bg-surface p-2 text-xs text-primary">
              {formatJson(execution.input)}
            </pre>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Output</p>
            <pre className="overflow-x-auto rounded bg-surface p-2 text-xs text-primary">
              {formatJson(execution.output)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  )
}
