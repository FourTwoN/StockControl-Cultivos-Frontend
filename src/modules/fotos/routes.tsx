import { Routes, Route } from 'react-router'
import { PhotosPage } from './pages/PhotosPage.tsx'
import { SessionDetailPage } from './pages/SessionDetailPage.tsx'
import { MLAnalysisPage } from './pages/MLAnalysisPage.tsx'

export default function FotosRoutes() {
  return (
    <Routes>
      <Route index element={<PhotosPage />} />
      <Route path="ml-analysis" element={<MLAnalysisPage />} />
      <Route path=":sessionId" element={<SessionDetailPage />} />
    </Routes>
  )
}
