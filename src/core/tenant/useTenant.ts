import type { Industry } from '@core/types/enums'
import type { TenantConfig } from '@core/tenant/types'
import { useTenantContext } from '@core/tenant/TenantProvider'

interface UseTenantReturn {
  readonly tenantId: string
  readonly tenantConfig: TenantConfig
  readonly industry: Industry
  readonly enabledModules: readonly string[]
  readonly isLoading: boolean
}

export function useTenant(): UseTenantReturn {
  const context = useTenantContext()

  if (!context.tenantId || !context.tenantConfig) {
    throw new Error(
      'Tenant not loaded. Ensure TenantProvider has resolved a tenant before using useTenant.',
    )
  }

  return {
    tenantId: context.tenantId,
    tenantConfig: context.tenantConfig,
    industry: context.tenantConfig.industry,
    enabledModules: context.tenantConfig.enabledModules,
    isLoading: context.isLoading,
  }
}
