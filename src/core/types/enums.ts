export const MovementType = {
  ENTRADA: 'ENTRADA',
  MUERTE: 'MUERTE',
  TRASPLANTE: 'TRASPLANTE',
  VENTA: 'VENTA',
  AJUSTE: 'AJUSTE',
} as const
export type MovementType = (typeof MovementType)[keyof typeof MovementType]

export const UserRole = {
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  WORKER: 'WORKER',
  VIEWER: 'VIEWER',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const BatchStatus = {
  ACTIVE: 'ACTIVE',
  DEPLETED: 'DEPLETED',
  QUARANTINE: 'QUARANTINE',
  ARCHIVED: 'ARCHIVED',
} as const
export type BatchStatus = (typeof BatchStatus)[keyof typeof BatchStatus]

export const Industry = {
  CULTIVOS: 'CULTIVOS',
  VENDING: 'VENDING',
  COMERCIANTES: 'COMERCIANTES',
} as const
export type Industry = (typeof Industry)[keyof typeof Industry]
