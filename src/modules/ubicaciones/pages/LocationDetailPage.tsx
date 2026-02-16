import { useParams } from 'react-router'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Skeleton } from '@core/components/ui/Skeleton.tsx'
import { EmptyState } from '@core/components/ui/EmptyState.tsx'
import { Button } from '@core/components/ui/Button.tsx'
import { BinSelector } from '../components/BinSelector.tsx'
import { useLocations } from '../hooks/useLocations.ts'
import { useBins } from '../hooks/useBins.ts'

function getOccupancyPercent(occupancy: number, maxCapacity: number): number {
  if (maxCapacity === 0) return 0
  return Math.min(Math.round((occupancy / maxCapacity) * 100), 100)
}

export default function LocationDetailPage() {
  const { locationId = '' } = useParams<{ locationId: string }>()

  const { data: locations, isLoading: isLoadingLocations } = useLocations()
  const { data: bins, isLoading: isLoadingBins } = useBins(locationId)

  const location = locations?.find((loc) => loc.id === locationId)
  const isLoading = isLoadingLocations || isLoadingBins

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton variant="rectangle" className="h-32" />
        <Skeleton variant="rectangle" className="h-48" />
      </div>
    )
  }

  if (!location) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<MapPin className="h-8 w-8" />}
          title="Location not found"
          description="The requested storage location could not be found."
          action={
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
          }
        />
      </div>
    )
  }

  const percent = getOccupancyPercent(location.occupancy, location.maxCapacity)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary">{location.name}</h1>
          <p className="text-sm text-muted">Code: {location.code}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted">Occupancy</p>
            <p className="text-lg font-semibold text-primary">{percent}%</p>
          </div>
          <div>
            <p className="text-xs text-muted">Max Capacity</p>
            <p className="text-lg font-semibold text-primary">{location.maxCapacity}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Current</p>
            <p className="text-lg font-semibold text-primary">{location.occupancy}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Bins</p>
            <p className="text-lg font-semibold text-primary">{location.binCount}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-primary">Bin Grid</h2>
        {bins && bins.length > 0 ? (
          <BinSelector bins={bins} />
        ) : (
          <EmptyState
            icon={<MapPin className="h-8 w-8" />}
            title="No bins"
            description="This location has no bins configured yet."
          />
        )}
      </div>
    </div>
  )
}
