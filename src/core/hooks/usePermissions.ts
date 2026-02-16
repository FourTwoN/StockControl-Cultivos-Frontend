import { useAuth } from '@core/auth/useAuth'
import type { UserRole } from '@core/types/enums'

export function usePermissions() {
  const { roles } = useAuth()

  const hasRole = (role: UserRole): boolean => roles.includes(role)
  const hasAnyRole = (requiredRoles: readonly UserRole[]): boolean =>
    requiredRoles.some((role) => roles.includes(role))
  const isAdmin = roles.includes('ADMIN')
  const isSupervisor = roles.includes('SUPERVISOR') || isAdmin

  return { roles, hasRole, hasAnyRole, isAdmin, isSupervisor } as const
}
