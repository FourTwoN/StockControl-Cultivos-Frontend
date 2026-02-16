import { MapPin, Warehouse as WarehouseIcon } from 'lucide-react'
import { Card } from '@core/components/ui/Card.tsx'
import { Skeleton } from '@core/components/ui/Skeleton.tsx'
import { EmptyState } from '@core/components/ui/EmptyState.tsx'
import { WarehouseMap } from '../components/WarehouseMap.tsx'
import { useWarehouses } from '../hooks/useWarehouses.ts'

function computeCapacityPercent(total: number, used: number): number {
  if (total === 0) return 0
  return Math.round((used / total) * 100)
}

export default function MapPage() {
  const { data: warehouses, isLoading, isError } = useWarehouses()

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton variant="rectangle" className="h-[400px] md:h-[600px]" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} variant="rectangle" className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<MapPin className="h-8 w-8" />}
          title="Failed to load warehouses"
          description="An error occurred while loading warehouse data. Please try again later."
        />
      </div>
    )
  }

  const warehouseList = Array.isArray(warehouses) ? warehouses : []

  if (warehouseList.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<WarehouseIcon className="h-8 w-8" />}
          title="No warehouses"
          description="No warehouses have been registered yet."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-primary">Warehouse Map</h1>

      <WarehouseMap warehouses={warehouseList} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {warehouseList.map((wh) => {
          const percent = computeCapacityPercent(wh.totalCapacity, wh.usedCapacity)
          return (
            <Card key={wh.id}>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">{wh.name}</h3>
                <p className="text-xs text-muted">{wh.address}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">{wh.areaCount} areas</span>
                  <span className="font-medium text-primary">{percent}% capacity</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
