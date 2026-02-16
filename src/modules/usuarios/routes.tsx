import { Routes, Route } from 'react-router'
import { UsersPage } from './pages/UsersPage.tsx'
import { UserProfilePage } from './pages/UserProfilePage.tsx'

export default function UsuariosRoutes() {
  return (
    <Routes>
      <Route index element={<UsersPage />} />
      <Route path="profile" element={<UserProfilePage />} />
    </Routes>
  )
}
