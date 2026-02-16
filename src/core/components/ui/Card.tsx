import type { ReactNode, MouseEventHandler } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  readonly children: ReactNode
  readonly className?: string
  readonly onClick?: MouseEventHandler<HTMLDivElement>
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/50 bg-surface p-4 shadow-[var(--shadow-sm)] transition-all duration-200',
        onClick &&
          'cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:border-primary/20',
        className,
      )}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
              }
            }
          : undefined
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
