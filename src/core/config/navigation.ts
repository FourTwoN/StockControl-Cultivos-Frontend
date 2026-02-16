import type { NavItem } from '@core/layout'
import { getEnabledModules } from '@core/config/modules'

export function getNavItems(enabledModules: readonly string[]): readonly NavItem[] {
  return getEnabledModules(enabledModules).map((m) => ({
    label: m.label,
    path: m.path,
    icon: m.icon,
  }))
}
