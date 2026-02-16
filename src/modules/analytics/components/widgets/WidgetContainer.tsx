import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WidgetContainerProps {
  readonly title: string
  readonly subtitle?: string
  readonly children: ReactNode
  readonly className?: string
  readonly action?: ReactNode
}

export function WidgetContainer({
  title,
  subtitle,
  children,
  className,
  action,
}: WidgetContainerProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/50 bg-surface p-4 shadow-[var(--shadow-sm)]',
        'transition-shadow duration-200 hover:shadow-[var(--shadow-md)]',
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-primary">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </div>
  )
}
