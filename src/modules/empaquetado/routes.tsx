import { Routes, Route } from 'react-router'
import { EmpaquetadoPage } from './pages/EmpaquetadoPage.tsx'

export default function ModuleRoutes() {
  return (
    <Routes>
      <Route index element={<EmpaquetadoPage />} />
    </Routes>
  )
}
