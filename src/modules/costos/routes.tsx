import { Routes, Route } from 'react-router'
import { CostosPage } from './pages/CostosPage.tsx'

export default function CostosRoutes() {
  return (
    <Routes>
      <Route index element={<CostosPage />} />
    </Routes>
  )
}
