import { useMemo } from 'react'
import { AppLayout } from '@core/layout'
import { useTenant } from '@core/tenant/useTenant'
import { getNavItems } from '@core/config/navigation'
import { AppRoutes } from './AppRoutes'

export function AuthenticatedApp() {
  const { enabledModules } = useTenant()
  const navItems = useMemo(() => getNavItems(enabledModules), [enabledModules])

  return (
    <AppLayout navItems={navItems}>
      <AppRoutes />
    </AppLayout>
  )
}
