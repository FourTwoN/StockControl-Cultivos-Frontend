import type { UserRole } from '@core/types/enums'

export interface User {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly picture?: string
  readonly role: UserRole
  readonly isActive: boolean
  readonly lastLoginAt?: string
  readonly createdAt: string
}
