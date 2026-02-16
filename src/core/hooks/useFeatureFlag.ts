import { useTenant } from '@core/tenant/useTenant'

export function useFeatureFlag(flag: string): boolean {
  const { enabledModules } = useTenant()
  return enabledModules.includes(flag)
}
