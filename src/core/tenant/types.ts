import type { Industry } from '@core/types/enums'

export interface TenantTheme {
  readonly primary: string
  readonly secondary: string
  readonly accent: string
  readonly background: string
  readonly logoUrl?: string
  readonly appName: string
}

export interface TenantConfig {
  readonly id: string
  readonly name: string
  readonly industry: Industry
  readonly theme: TenantTheme
  readonly enabledModules: readonly string[]
  readonly settings: Readonly<Record<string, unknown>>
}
