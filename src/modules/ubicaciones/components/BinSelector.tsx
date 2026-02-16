import { useCallback } from 'react'
import type { StorageBin } from '../types/Location.ts'

interface BinSelectorProps {
  readonly bins: readonly StorageBin[]
  readonly selectedBinId?: string
  readonly onSelect?: (bin: StorageBin) => void
}

function getBinColor(bin: StorageBin): string {
  if (bin.binType === 'disabled') return 'bg-gray-300 cursor-not-allowed'
  if (bin.isOccupied) return 'bg-destructive/80 hover:bg-destructive'
  return 'bg-success/80 hover:bg-success'
}

export function BinSelector({ bins, selectedBinId, onSelect }: BinSelectorProps) {
  const handleClick = useCallback(
    (bin: StorageBin) => {
      if (bin.binType === 'disabled') return
      onSelect?.(bin)
    },
    [onSelect],
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-success/80" />
          Empty
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-destructive/80" />
          Occupied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-gray-300" />
          Disabled
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {bins.map((bin) => (
          <button
            key={bin.id}
            type="button"
            onClick={() => handleClick(bin)}
            disabled={bin.binType === 'disabled'}
            title={bin.currentBatchName ? `${bin.name} - Batch: ${bin.currentBatchName}` : bin.name}
            className={[
              'flex h-10 w-full items-center justify-center rounded text-xs font-medium text-white transition-colors',
              getBinColor(bin),
              selectedBinId === bin.id ? 'ring-2 ring-primary ring-offset-2' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={`Bin ${bin.name}${bin.isOccupied ? ' (occupied)' : ' (empty)'}`}
          >
            {bin.name.slice(-3)}
          </button>
        ))}
      </div>
    </div>
  )
}
