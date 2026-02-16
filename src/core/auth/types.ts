import type { UserRole } from '@core/types/enums'

export interface AuthUser {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly picture?: string
  readonly tenantId: string
  readonly roles: readonly UserRole[]
}

export interface AuthState {
  readonly user: AuthUser | null
  readonly isAuthenticated: boolean
  readonly isLoading: boolean
  readonly token: string | null
}
