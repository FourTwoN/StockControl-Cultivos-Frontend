import type { ReactNode } from 'react'
import type { UserRole } from '@core/types/enums'
import { useAuth } from '@core/auth/useAuth'

interface RoleGuardProps {
  readonly allowedRoles: readonly UserRole[]
  readonly children: ReactNode
  readonly fallback?: ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { roles } = useAuth()

  const hasRequiredRole = roles.some((role) => allowedRoles.includes(role))

  if (!hasRequiredRole) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
