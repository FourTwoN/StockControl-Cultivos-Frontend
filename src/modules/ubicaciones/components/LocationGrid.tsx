import { AnimatedList, AnimatedListItem } from '@core/components/motion/AnimatedList'
import type { StorageLocation } from '../types/Location.ts'
import { LocationCard } from './LocationCard.tsx'

interface LocationGridProps {
  readonly locations: readonly StorageLocation[]
  readonly onLocationClick?: (location: StorageLocation) => void
}

export function LocationGrid({ locations, onLocationClick }: LocationGridProps) {
  return (
    <AnimatedList className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <AnimatedListItem key={location.id}>
          <LocationCard location={location} onClick={onLocationClick} />
        </AnimatedListItem>
      ))}
    </AnimatedList>
  )
}
