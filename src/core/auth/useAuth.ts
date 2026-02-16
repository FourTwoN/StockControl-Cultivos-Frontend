import { useContext } from 'react'
import { AuthContext } from '@core/auth/authContext'
import type { AuthContextValue } from '@core/auth/authContext'

export type UseAuthReturn = AuthContextValue

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
