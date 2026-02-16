import { useState, useCallback } from 'react'
import { MapPin } from 'lucide-react'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { FadeIn } from '@core/components/motion/FadeIn'
import { Skeleton } from '@core/components/ui/Skeleton.tsx'
import { EmptyState } from '@core/components/ui/EmptyState.tsx'
import { Card } from '@core/components/ui/Card.tsx'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@core/components/ui/Tabs.tsx'
import type { StorageLocation } from '../types/Location.ts'
import { LocationGrid } from '../components/LocationGrid.tsx'
import { useLocations } from '../hooks/useLocations.ts'
import { useBins } from '../hooks/useBins.ts'
import { BinSelector } from '../components/BinSelector.tsx'

function SelectedLocationDetail({ location }: { readonly location: StorageLocation }) {
  const { data: bins, isLoading } = useBins(location.id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton variant="rectangle" className="h-48" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-primary">{location.name}</h2>
        <p className="text-sm text-muted">Code: {location.code}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs text-muted">Occupancy</p>
          <p className="text-sm font-semibold text-primary">{location.occupancy}</p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs text-muted">Max Capacity</p>
          <p className="text-sm font-semibold text-primary">{location.maxCapacity}</p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs text-muted">Bins</p>
          <p className="text-sm font-semibold text-primary">{location.binCount}</p>
        </div>
      </div>
      {bins && bins.length > 0 ? (
        <BinSelector bins={bins} />
      ) : (
        <p className="text-sm text-muted">No bins configured for this location.</p>
      )}
    </div>
  )
}

export default function CultivationPage() {
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null)
  const { data: locations, isLoading, isError } = useLocations()

  const handleLocationClick = useCallback((location: StorageLocation) => {
    setSelectedLocation(location)
  }, [])

  if (isLoading) {
    return (
      <AnimatedPage className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} variant="rectangle" className="h-28" />
          ))}
        </div>
      </AnimatedPage>
    )
  }

  if (isError) {
    return (
      <AnimatedPage className="p-6">
        <EmptyState
          icon={<MapPin className="h-8 w-8" />}
          title="Failed to load locations"
          description="An error occurred while loading location data. Please try again later."
        />
      </AnimatedPage>
    )
  }

  const locationList = locations ?? []

  return (
    <AnimatedPage className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-primary">Cultivation Locations</h1>

      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left: Location grid */}
            <div className="w-full lg:w-1/2">
              {locationList.length === 0 ? (
                <EmptyState
                  icon={<MapPin className="h-8 w-8" />}
                  title="No locations"
                  description="No storage locations have been registered yet."
                />
              ) : (
                <LocationGrid locations={locationList} onLocationClick={handleLocationClick} />
              )}
            </div>

            {/* Right: Selected location details */}
            <div className="w-full lg:w-1/2">
              <FadeIn key={selectedLocation?.id ?? 'empty'}>
                <Card>
                  {selectedLocation ? (
                    <SelectedLocationDetail location={selectedLocation} />
                  ) : (
                    <div className="flex h-48 items-center justify-center">
                      <p className="text-sm text-muted">Select a location to view details</p>
                    </div>
                  )}
                </Card>
              </FadeIn>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="flex flex-col gap-4">
            {locationList.length === 0 ? (
              <EmptyState
                icon={<MapPin className="h-8 w-8" />}
                title="No locations"
                description="No storage locations have been registered yet."
              />
            ) : (
              locationList.map((location) => (
                <Card key={location.id} onClick={() => handleLocationClick(location)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-primary">{location.name}</h3>
                      <p className="text-xs text-muted">{location.code}</p>
                    </div>
                    <div className="text-right text-xs text-muted">
                      <p>{location.occupancy} / {location.maxCapacity} capacity</p>
                      <p>{location.binCount} bins</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  )
}
