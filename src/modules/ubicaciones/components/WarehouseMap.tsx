import 'leaflet/dist/leaflet.css'
import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Warehouse } from '../types/Location.ts'

// Fix Leaflet default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const DEFAULT_CENTER: L.LatLngExpression = [-34.6, -58.4]
const DEFAULT_ZOOM = 5

interface WarehouseMapProps {
  readonly warehouses: readonly Warehouse[]
}

function computeCapacityPercent(warehouse: Warehouse): number {
  if (warehouse.totalCapacity === 0) return 0
  return Math.round((warehouse.usedCapacity / warehouse.totalCapacity) * 100)
}

function hasValidCoordinates(wh: Warehouse): boolean {
  return wh.latitude !== null && wh.longitude !== null
}

export function WarehouseMap({ warehouses }: WarehouseMapProps) {
  const markers = useMemo(
    () =>
      warehouses
        .filter(hasValidCoordinates)
        .map((wh) => ({
          id: wh.id,
          position: [wh.latitude, wh.longitude] as L.LatLngExpression,
          name: wh.name,
          address: wh.address,
          capacityPercent: computeCapacityPercent(wh),
        })),
    [warehouses],
  )

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-lg border border-border md:h-[600px]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{marker.name}</p>
                <p className="text-gray-600">{marker.address}</p>
                <p>
                  Capacity: <strong>{marker.capacityPercent}%</strong>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
