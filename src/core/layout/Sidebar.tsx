import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { NavItem } from '@core/layout/types'
import { useAuth } from '@core/auth/useAuth'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Avatar,
  AvatarFallback,
  Separator,
} from '@core/components/ui'

interface SidebarProps {
  readonly items: readonly NavItem[]
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly isCollapsed: boolean
  readonly onToggleCollapse: () => void
}

export function Sidebar({ items, isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuth()
  const [isHoverExpanded, setIsHoverExpanded] = useState(false)

  const effectiveExpanded = !isCollapsed || isHoverExpanded

  const isActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  )

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

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
        onMouseEnter={() => {
          if (isCollapsed) setIsHoverExpanded(true)
        }}
        onMouseLeave={() => {
          if (isCollapsed) setIsHoverExpanded(false)
        }}
        className={cn(
          'fixed top-14 left-0 z-50 flex h-[calc(100vh-3.5rem)] flex-col border-r border-border/50 bg-surface transition-all duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
          effectiveExpanded ? 'md:w-60' : 'md:w-16',
          'w-60',
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)' }}
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

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <TooltipProvider delayDuration={0}>
            <ul className="relative flex flex-col gap-0.5">
              {items.map((item) => {
                const active = isActive(item.path)
                const linkContent = (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      active
                        ? 'text-primary'
                        : 'text-muted hover:bg-primary/[0.04] hover:text-text-primary',
                      !effectiveExpanded && 'md:justify-center md:px-2',
                    )}
                  >
                    {/* Active indicator pill */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute inset-0 rounded-lg bg-primary/8 shadow-[var(--shadow-xs)]"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>

                    <span className="relative z-10 flex-shrink-0">{item.icon}</span>
                    <span className={cn('relative z-10', !effectiveExpanded && 'md:hidden')}>
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={cn(
                          'relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white',
                          !effectiveExpanded && 'md:hidden',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )

                return (
                  <li key={item.path}>
                    {!effectiveExpanded ? (
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

        {/* User avatar section */}
        <div className="border-t border-border/50 p-2">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-2 py-2',
              !effectiveExpanded && 'md:justify-center',
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className={cn('min-w-0 flex-1', !effectiveExpanded && 'md:hidden')}>
              <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>
        </div>

        <Separator className="mx-2" />

        {/* Collapse toggle (desktop only) */}
        <div className="hidden p-2 md:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-lg p-2 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-primary"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed && !isHoverExpanded ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
