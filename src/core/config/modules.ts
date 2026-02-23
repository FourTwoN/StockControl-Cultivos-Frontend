import { createElement } from 'react'
import type { ReactNode } from 'react'

import { MaterialIcon } from '@core/components/ui/MaterialIcon'

export const ModuleType = {
  CORE: 'core',
  DLC: 'dlc',
} as const
export type ModuleType = (typeof ModuleType)[keyof typeof ModuleType]

export interface ModuleDefinition {
  readonly key: string
  readonly label: string
  readonly path: string
  readonly icon: ReactNode
  readonly iconName: string
  readonly type: ModuleType
}

const ICON_SIZE = 20

export const moduleRegistry: readonly ModuleDefinition[] = [
  {
    key: 'mapa',
    label: 'Mapa',
    path: '/mapa',
    icon: createElement(MaterialIcon, { name: 'map', size: ICON_SIZE }),
    iconName: 'map',
    type: ModuleType.CORE,
  },
  {
    key: 'cultivo',
    label: 'Cultivo',
    path: '/cultivo',
    icon: createElement(MaterialIcon, { name: 'grass', size: ICON_SIZE }),
    iconName: 'grass',
    type: ModuleType.CORE,
  },
  {
    key: 'inventario',
    label: 'Inventario',
    path: '/inventario',
    icon: createElement(MaterialIcon, { name: 'inventory_2', size: ICON_SIZE }),
    iconName: 'inventory_2',
    type: ModuleType.CORE,
  },
  {
    key: 'productos',
    label: 'Productos',
    path: '/productos',
    icon: createElement(MaterialIcon, { name: 'shopping_cart', size: ICON_SIZE }),
    iconName: 'shopping_cart',
    type: ModuleType.CORE,
  },
  {
    key: 'ventas',
    label: 'Ventas',
    path: '/ventas',
    icon: createElement(MaterialIcon, { name: 'payments', size: ICON_SIZE }),
    iconName: 'payments',
    type: ModuleType.CORE,
  },
  {
    key: 'costos',
    label: 'Costos',
    path: '/costos',
    icon: createElement(MaterialIcon, { name: 'analytics', size: ICON_SIZE }),
    iconName: 'analytics',
    type: ModuleType.CORE,
  },
  {
    key: 'ubicaciones',
    label: 'Ubicaciones',
    path: '/ubicaciones',
    icon: createElement(MaterialIcon, { name: 'location_on', size: ICON_SIZE }),
    iconName: 'location_on',
    type: ModuleType.CORE,
  },
  {
    key: 'empaquetado',
    label: 'Empaquetado',
    path: '/empaquetado',
    icon: createElement(MaterialIcon, { name: 'package_2', size: ICON_SIZE }),
    iconName: 'package_2',
    type: ModuleType.CORE,
  },
  {
    key: 'precios',
    label: 'Precios',
    path: '/precios',
    icon: createElement(MaterialIcon, { name: 'price_change', size: ICON_SIZE }),
    iconName: 'price_change',
    type: ModuleType.CORE,
  },
  {
    key: 'usuarios',
    label: 'Usuarios',
    path: '/usuarios',
    icon: createElement(MaterialIcon, { name: 'account_circle', size: ICON_SIZE }),
    iconName: 'account_circle',
    type: ModuleType.CORE,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: createElement(MaterialIcon, { name: 'bar_chart', size: ICON_SIZE }),
    iconName: 'bar_chart',
    type: ModuleType.CORE,
  },
  {
    key: 'fotos',
    label: 'Fotos',
    path: '/fotos',
    icon: createElement(MaterialIcon, { name: 'photo_library', size: ICON_SIZE }),
    iconName: 'photo_library',
    type: ModuleType.DLC,
  },
  {
    key: 'chatbot',
    label: 'Chatbot',
    path: '/chatbot',
    icon: createElement(MaterialIcon, { name: 'chat', size: ICON_SIZE }),
    iconName: 'chat',
    type: ModuleType.DLC,
  },
] as const

export const allModuleKeys: readonly string[] = moduleRegistry.map((m) => m.key)

export function getEnabledModules(enabledModules: readonly string[]): readonly ModuleDefinition[] {
  return moduleRegistry.filter((m) => enabledModules.includes(m.key))
}

export function getFirstEnabledPath(enabledModules: readonly string[]): string {
  const first = moduleRegistry.find((m) => enabledModules.includes(m.key))
  return first?.path ?? '/inventario'
}
