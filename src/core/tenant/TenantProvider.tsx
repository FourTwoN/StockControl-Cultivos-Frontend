import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import type { TenantConfig } from '@core/tenant/types'
import { resolveTenantId } from '@core/tenant/tenantResolver'
import { useAuth } from '@core/auth/useAuth'
import env from '@core/config/env'
import { Industry } from '@core/types/enums'
import { allModuleKeys } from '@core/config/modules'

interface TenantContextValue {
  readonly tenantId: string | null
  readonly tenantConfig: TenantConfig | null
  readonly isLoading: boolean
  readonly error: string | null
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined)

function createLocalTenantConfig(tenantId: string): TenantConfig {
  return {
    id: tenantId,
    name: `Local Tenant ${tenantId}`,
    industry: Industry.CULTIVOS,
    theme: {
      primary: '#16a34a',
      secondary: '#0f172a',
      accent: '#22c55e',
      background: '#f8fafc',
      appName: 'Stock Control (Local)',
    },
    enabledModules: [...allModuleKeys],
    settings: {
      source: 'local-bypass',
    },
  }
}

async function fetchTenantConfig(tenantId: string, signal: AbortSignal): Promise<TenantConfig> {
  const url = `${env.API_URL}/api/v1/tenants/${encodeURIComponent(tenantId)}/config`

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch tenant config: ${response.status} ${response.statusText}`)
  }

  const data: unknown = await response.json()
  return data as TenantConfig
}

interface TenantProviderProps {
  readonly children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { user } = useAuth()
  const [state, setState] = useState<TenantContextValue>({
    tenantId: null,
    tenantConfig: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const abortController = new AbortController()

    const loadTenant = async () => {
      const resolvedId = resolveTenantId(user?.tenantId)

      if (!resolvedId) {
        setState({
          tenantId: null,
          tenantConfig: null,
          isLoading: false,
          error: 'Unable to resolve tenant ID',
        })
        return
      }

      if (env.AUTH_BYPASS) {
        setState({
          tenantId: resolvedId,
          tenantConfig: createLocalTenantConfig(resolvedId),
          isLoading: false,
          error: null,
        })
        return
      }

      setState((prev) => ({ ...prev, tenantId: resolvedId, isLoading: true }))

      try {
        const config = await fetchTenantConfig(resolvedId, abortController.signal)
        setState({
          tenantId: resolvedId,
          tenantConfig: config,
          isLoading: false,
          error: null,
        })
      } catch (err) {
        if (abortController.signal.aborted) {
          return
        }
        const message = err instanceof Error ? err.message : 'Failed to load tenant config'
        setState({
          tenantId: resolvedId,
          tenantConfig: null,
          isLoading: false,
          error: message,
        })
      }
    }

    void loadTenant()

    return () => {
      abortController.abort()
    }
  }, [user?.tenantId])

  if (state.isLoading) {
    return <div data-testid="tenant-loading">Loading tenant...</div>
  }

  return <TenantContext.Provider value={state}>{children}</TenantContext.Provider>
}

export function useTenantContext(): TenantContextValue {
  const context = useContext(TenantContext)

  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider')
  }

  return context
}
