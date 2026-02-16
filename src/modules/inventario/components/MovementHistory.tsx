import { ArrowDownCircle, ArrowRightLeft, ShoppingCart, Settings, Skull } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedList, AnimatedListItem } from '@core/components/motion/AnimatedList'
import { Skeleton } from '@core/components/ui/Skeleton'
import { EmptyState } from '@core/components/ui/EmptyState'
import type { MovementType } from '@core/types/enums'
import type { StockMovement } from '../types/StockMovement.ts'

interface MovementHistoryProps {
  readonly movements: readonly StockMovement[]
  readonly isLoading: boolean
}

interface MovementConfig {
  readonly icon: React.ComponentType<{ className?: string }>
  readonly color: string
  readonly bgColor: string
  readonly label: string
}

const MOVEMENT_CONFIG: Readonly<Record<MovementType, MovementConfig>> = {
  ENTRADA: {
    icon: ArrowDownCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Entry',
  },
  MUERTE: {
    icon: Skull,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Death',
  },
  TRASPLANTE: {
    icon: ArrowRightLeft,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Transplant',
  },
  VENTA: {
    icon: ShoppingCart,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Sale',
  },
  AJUSTE: {
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    label: 'Adjustment',
  },
}

function MovementEntry({
  movement,
  isLast,
}: {
  readonly movement: StockMovement
  readonly isLast: boolean
}) {
  const config = MOVEMENT_CONFIG[movement.type]
  const Icon = config.icon

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && <div className="absolute left-5 top-10 h-full w-px bg-border" />}

      {/* Icon */}
      <div
        className={cn(
          'relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
          config.bgColor,
        )}
      >
        <Icon className={cn('h-5 w-5', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('text-sm font-semibold', config.color)}>{config.label}</span>
            <span className="text-sm font-medium text-primary">x{movement.quantity}</span>
          </div>
          <time className="text-xs text-muted">
            {new Date(movement.createdAt).toLocaleString()}
          </time>
        </div>

        {/* Source / Destination */}
        {(movement.sourceBinName || movement.destinationBinName) && (
          <p className="mt-1 text-xs text-muted">
            {movement.sourceBinName && <span>From: {movement.sourceBinName}</span>}
            {movement.sourceBinName && movement.destinationBinName && (
              <span className="mx-1">&rarr;</span>
            )}
            {movement.destinationBinName && <span>To: {movement.destinationBinName}</span>}
          </p>
        )}

        {/* User */}
        <p className="mt-1 text-xs text-muted">By: {movement.performedBy}</p>

        {/* Notes */}
        {movement.notes && (
          <p className="mt-2 rounded-md bg-background px-3 py-2 text-xs text-muted">
            {movement.notes}
          </p>
        )}
      </div>
    </div>
  )
}

export function MovementHistory({ movements, isLoading }: MovementHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10" variant="circle" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <EmptyState
        icon={<ArrowRightLeft className="h-8 w-8" />}
        title="No movements recorded"
        description="This batch has no movement history yet."
      />
    )
  }

  return (
    <AnimatedList className="flex flex-col">
      {movements.map((movement, index) => (
        <AnimatedListItem key={movement.id}>
          <MovementEntry
            movement={movement}
            isLast={index === movements.length - 1}
          />
        </AnimatedListItem>
      ))}
    </AnimatedList>
  )
}
