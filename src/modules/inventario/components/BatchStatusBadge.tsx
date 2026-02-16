import { Badge } from '@core/components/ui/Badge'
import type { BatchStatus } from '@core/types/enums'

type BadgeVariant = 'success' | 'warning' | 'outline' | 'default'

const STATUS_VARIANT_MAP: Readonly<Record<BatchStatus, BadgeVariant>> = {
  ACTIVE: 'success',
  DEPLETED: 'outline',
  QUARANTINE: 'warning',
  ARCHIVED: 'default',
}

const STATUS_LABEL_MAP: Readonly<Record<BatchStatus, string>> = {
  ACTIVE: 'Active',
  DEPLETED: 'Depleted',
  QUARANTINE: 'Quarantine',
  ARCHIVED: 'Archived',
}

interface BatchStatusBadgeProps {
  readonly status: BatchStatus
}

export function BatchStatusBadge({ status }: BatchStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT_MAP[status]}>{STATUS_LABEL_MAP[status]}</Badge>
}
