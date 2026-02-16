import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { useTenant } from '@core/tenant/useTenant'

const CSS_VARIABLE_NAMES = [
  '--color-primary',
  '--color-secondary',
  '--color-accent',
  '--color-background',
  '--shadow-glow-primary',
  '--logo-url',
  '--app-name',
] as const

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '27, 79, 114'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

interface TenantThemeProps {
  readonly children: ReactNode
}

export function TenantTheme({ children }: TenantThemeProps) {
  const { tenantConfig } = useTenant()
  const { theme } = tenantConfig

  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.style.setProperty('--color-accent', theme.accent)
    root.style.setProperty('--color-background', theme.background)

    // Derive glow shadow from tenant primary color
    const rgb = hexToRgb(theme.primary)
    root.style.setProperty('--shadow-glow-primary', `0 4px 14px rgba(${rgb}, 0.25)`)

    root.style.setProperty('--logo-url', theme.logoUrl ? `url(${theme.logoUrl})` : 'none')
    root.style.setProperty('--app-name', `"${theme.appName}"`)

    return () => {
      for (const name of CSS_VARIABLE_NAMES) {
        root.style.removeProperty(name)
      }
    }
  }, [theme])

  return <>{children}</>
}
