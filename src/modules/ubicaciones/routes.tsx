import { Routes, Route } from 'react-router'
import MapPage from './pages/MapPage.tsx'
import LocationDetailPage from './pages/LocationDetailPage.tsx'
import CultivationPage from './pages/CultivationPage.tsx'

export default function UbicacionesRoutes() {
  return (
    <Routes>
      <Route index element={<MapPage />} />
      <Route path="map" element={<MapPage />} />
      <Route path="cultivation" element={<CultivationPage />} />
      <Route path=":locationId" element={<LocationDetailPage />} />
    </Routes>
  )
}
