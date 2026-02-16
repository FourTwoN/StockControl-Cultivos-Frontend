import { createContext } from 'react'
import type { AuthUser } from '@core/auth/types'
import type { UserRole } from '@core/types/enums'

export interface AuthContextValue {
  readonly user: AuthUser | null
  readonly token: string | null
  readonly isAuthenticated: boolean
  readonly isLoading: boolean
  readonly roles: readonly UserRole[]
  readonly login: () => void
  readonly logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
