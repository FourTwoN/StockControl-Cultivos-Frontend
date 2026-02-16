import { Routes, Route } from 'react-router'
import { InventarioPage } from './pages/InventarioPage.tsx'
import { BatchDetailPage } from './pages/BatchDetailPage.tsx'
import { MovementsPage } from './pages/MovementsPage.tsx'

export default function ModuleRoutes() {
  return (
    <Routes>
      <Route index element={<InventarioPage />} />
      <Route path="movements" element={<MovementsPage />} />
      <Route path=":batchId" element={<BatchDetailPage />} />
    </Routes>
  )
}
