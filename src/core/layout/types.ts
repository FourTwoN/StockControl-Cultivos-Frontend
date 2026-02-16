import type { ReactNode } from 'react'

export interface NavItem {
  readonly label: string
  readonly path: string
  readonly icon: ReactNode
  readonly badge?: number
}
