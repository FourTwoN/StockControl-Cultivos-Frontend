import { Routes, Route } from 'react-router'
import PriceListPage from './pages/PriceListPage.tsx'
import PriceListDetailPage from './pages/PriceListDetailPage.tsx'

export default function PreciosRoutes() {
  return (
    <Routes>
      <Route index element={<PriceListPage />} />
      <Route path=":listId" element={<PriceListDetailPage />} />
    </Routes>
  )
}
