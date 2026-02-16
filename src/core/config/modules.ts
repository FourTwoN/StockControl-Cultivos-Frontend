import {
  Package,
  ShoppingCart,
  BarChart3,
  MapPin,
  DollarSign,
  Box,
  Tag,
  Users,
  Camera,
  MessageSquare,
} from 'lucide-react'
import { createElement } from 'react'
import type { ReactNode } from 'react'

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
  readonly type: ModuleType
}

const ICON_SIZE = 20

export const moduleRegistry: readonly ModuleDefinition[] = [
  {
    key: 'inventario',
    label: 'Inventario',
    path: '/inventario',
    icon: createElement(Package, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'productos',
    label: 'Productos',
    path: '/productos',
    icon: createElement(ShoppingCart, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'ventas',
    label: 'Ventas',
    path: '/ventas',
    icon: createElement(DollarSign, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'costos',
    label: 'Costos',
    path: '/costos',
    icon: createElement(BarChart3, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'ubicaciones',
    label: 'Ubicaciones',
    path: '/ubicaciones',
    icon: createElement(MapPin, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'empaquetado',
    label: 'Empaquetado',
    path: '/empaquetado',
    icon: createElement(Box, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'precios',
    label: 'Precios',
    path: '/precios',
    icon: createElement(Tag, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'usuarios',
    label: 'Usuarios',
    path: '/usuarios',
    icon: createElement(Users, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: createElement(BarChart3, { size: ICON_SIZE }),
    type: ModuleType.CORE,
  },
  {
    key: 'fotos',
    label: 'Fotos',
    path: '/fotos',
    icon: createElement(Camera, { size: ICON_SIZE }),
    type: ModuleType.DLC,
  },
  {
    key: 'chatbot',
    label: 'Chatbot',
    path: '/chatbot',
    icon: createElement(MessageSquare, { size: ICON_SIZE }),
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
