import type { ReactNode } from 'react'

interface EmptyStateProps {
  readonly icon: ReactNode
  readonly title: string
  readonly description: string
  readonly action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
