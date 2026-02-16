import { Routes, Route } from 'react-router'
import { ChatPage } from './pages/ChatPage.tsx'

export default function ChatbotRoutes() {
  return (
    <Routes>
      <Route index element={<ChatPage />} />
    </Routes>
  )
}
