import { Routes, Route } from 'react-router'
import { AnalyticsPage } from './pages/AnalyticsPage.tsx'

export default function AnalyticsRoutes() {
  return (
    <Routes>
      <Route index element={<AnalyticsPage />} />
    </Routes>
  )
}
