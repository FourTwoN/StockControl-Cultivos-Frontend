import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { NavItem } from '@core/layout/types'
import { useAuth } from '@core/auth/useAuth'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@core/components/ui'
import { DemeterLogo } from '@core/components/ui/DemeterLogo'
import { MaterialIcon } from '@core/components/ui/MaterialIcon'

const SIDEBAR_COLLAPSED_WIDTH = 72
const SIDEBAR_EXPANDED_WIDTH = 256

interface SidebarProps {
  readonly items: readonly NavItem[]
  readonly isOpen: boolean
  readonly onClose: () => void
}

export function Sidebar({ items, isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuth()
  const [isHoverExpanded, setIsHoverExpanded] = useState(false)

  const isActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHoverExpanded(true)}
        onMouseLeave={() => setIsHoverExpanded(false)}
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen flex-col bg-white border-r',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
          'w-64 md:w-auto',
        )}
        style={{
          width: 'var(--sidebar-width)',
          borderColor: 'var(--demeter-border-sidebar)',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          ['--sidebar-width' as string]: isHoverExpanded
            ? `${SIDEBAR_EXPANDED_WIDTH}px`
            : `${SIDEBAR_COLLAPSED_WIDTH}px`,
        }}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-end p-2 md:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-primary"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center px-4 py-5 md:px-3">
          <DemeterLogo size="md" collapsed={!isHoverExpanded} />
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <TooltipProvider delayDuration={0}>
            <ul className="relative flex flex-col gap-1">
              {items.map((item) => {
                const active = isActive(item.path)
                const linkContent = (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg p-3 text-sm transition-all duration-200',
                      active
                        ? 'font-bold'
                        : 'font-medium hover:bg-[rgba(64,160,74,0.1)]',
                      !isHoverExpanded && 'md:justify-center',
                    )}
                    style={{
                      color: active ? 'var(--color-primary)' : 'var(--demeter-text-secondary)',
                    }}
                  >
                    {/* Active indicator background */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute inset-0 rounded-lg"
                          style={{ backgroundColor: 'rgba(64, 160, 74, 0.2)' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>

                    <span className="relative z-10 flex-shrink-0">{item.icon}</span>
                    <span
                      className={cn(
                        'relative z-10 whitespace-nowrap transition-opacity duration-150',
                        !isHoverExpanded && 'md:opacity-0 md:w-0 md:overflow-hidden',
                      )}
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1)',
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={cn(
                          'relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white',
                          !isHoverExpanded && 'md:hidden',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )

                return (
                  <li key={item.path}>
                    {!isHoverExpanded ? (
                      <Tooltip>
                        <TooltipTrigger asChild className="hidden md:flex">
                          {linkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                        {/* Mobile: render without tooltip */}
                        <div className="md:hidden">{linkContent}</div>
                      </Tooltip>
                    ) : (
                      linkContent
                    )}
                  </li>
                )
              })}
            </ul>
          </TooltipProvider>
        </nav>

        {/* User profile link at bottom */}
        <div className="border-t px-3 py-3" style={{ borderColor: 'var(--demeter-border-sidebar)' }}>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/perfil"
                  className={cn(
                    'flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-200',
                    'hover:bg-[rgba(64,160,74,0.1)]',
                    !isHoverExpanded && 'md:justify-center',
                  )}
                  style={{ color: 'var(--demeter-text-secondary)' }}
                >
                  <MaterialIcon name="account_circle" size={20} />
                  <span
                    className={cn(
                      'whitespace-nowrap transition-opacity duration-150',
                      !isHoverExpanded && 'md:opacity-0 md:w-0 md:overflow-hidden',
                    )}
                  >
                    {user?.name ?? 'Mi Perfil'}
                  </span>
                </Link>
              </TooltipTrigger>
              {!isHoverExpanded && (
                <TooltipContent side="right" className="hidden md:block">
                  Mi Perfil
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    </>
  )
}
