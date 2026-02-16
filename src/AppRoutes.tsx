import { lazy, useMemo } from 'react'
import type { ComponentType } from 'react'
import { useLocation, Routes, Route, Navigate } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { useTenant } from '@core/tenant/useTenant'
import { getFirstEnabledPath } from '@core/config/modules'

const routeComponents: Record<string, React.LazyExoticComponent<ComponentType>> = {
  inventario: lazy(() => import('@modules/inventario/routes')),
  productos: lazy(() => import('@modules/productos/routes')),
  ventas: lazy(() => import('@modules/ventas/routes')),
  costos: lazy(() => import('@modules/costos/routes')),
  usuarios: lazy(() => import('@modules/usuarios/routes')),
  ubicaciones: lazy(() => import('@modules/ubicaciones/routes')),
  empaquetado: lazy(() => import('@modules/empaquetado/routes')),
  precios: lazy(() => import('@modules/precios/routes')),
  analytics: lazy(() => import('@modules/analytics/routes')),
  fotos: lazy(() => import('@modules/fotos/routes')),
  chatbot: lazy(() => import('@modules/chatbot/routes')),
}

const modulePathMap: Record<string, string> = {
  inventario: '/inventario',
  productos: '/productos',
  ventas: '/ventas',
  costos: '/costos',
  usuarios: '/usuarios',
  ubicaciones: '/ubicaciones',
  empaquetado: '/empaquetado',
  precios: '/precios',
  analytics: '/analytics',
  fotos: '/fotos',
  chatbot: '/chatbot',
}

export function AppRoutes() {
  const { enabledModules } = useTenant()
  const defaultPath = useMemo(() => getFirstEnabledPath(enabledModules), [enabledModules])
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to={defaultPath} replace />} />

          {enabledModules.map((key) => {
            const Component = routeComponents[key]
            const path = modulePathMap[key]
            if (!Component || !path) return null
            return <Route key={key} path={`${path}/*`} element={<Component />} />
          })}

          {/* Fallback */}
          <Route path="*" element={<Navigate to={defaultPath} replace />} />
        </Routes>
      </AnimatedPage>
    </AnimatePresence>
  )
}
