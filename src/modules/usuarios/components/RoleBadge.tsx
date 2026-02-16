import { Badge } from '@core/components/ui/Badge'
import type { UserRole } from '@core/types/enums'

type BadgeVariant = 'success' | 'warning' | 'default' | 'destructive'

const ROLE_BADGE_MAP: Readonly<Record<UserRole, BadgeVariant>> = {
  ADMIN: 'destructive',
  SUPERVISOR: 'warning',
  WORKER: 'default',
  VIEWER: 'default',
}

const ROLE_LABELS: Readonly<Record<UserRole, string>> = {
  ADMIN: 'Admin',
  SUPERVISOR: 'Supervisor',
  WORKER: 'Worker',
  VIEWER: 'Viewer',
}

interface RoleBadgeProps {
  readonly role: UserRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return <Badge variant={ROLE_BADGE_MAP[role]}>{ROLE_LABELS[role]}</Badge>
}
