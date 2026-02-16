import { Routes, Route } from 'react-router'
import { VentasPage } from './pages/VentasPage.tsx'
import { SaleDetailPage } from './pages/SaleDetailPage.tsx'

export default function VentasRoutes() {
  return (
    <Routes>
      <Route index element={<VentasPage />} />
      <Route path=":saleId" element={<SaleDetailPage />} />
    </Routes>
  )
}
