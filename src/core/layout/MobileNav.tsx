import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'
import type { NavItem } from '@core/layout/types'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@core/components/ui'

interface MobileNavProps {
  readonly items: readonly NavItem[]
}

const MAX_VISIBLE = 4

export function MobileNav({ items }: MobileNavProps) {
  const location = useLocation()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const hasOverflow = items.length > MAX_VISIBLE + 1
  const visibleItems = hasOverflow ? items.slice(0, MAX_VISIBLE) : items
  const overflowItems = hasOverflow ? items.slice(MAX_VISIBLE) : []

  const isActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  )

  const isOverflowActive = overflowItems.some((item) => isActive(item.path))

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 shadow-[var(--shadow-md)] md:hidden">
      <ul className="flex items-center justify-around">
        {visibleItems.map((item) => {
          const active = isActive(item.path)
          return (
            <li key={item.path} className="flex-1">
              <motion.div whileTap={{ scale: 0.92 }}>
                <Link
                  to={item.path}
                  className={cn(
                    'relative flex flex-col items-center gap-0.5 px-2 py-3 text-xs font-medium transition-all duration-200',
                    active ? 'text-primary' : 'text-muted',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </motion.div>
            </li>
          )
        })}

        {/* More button when items overflow */}
        {hasOverflow && (
          <li className="flex-1">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  className={cn(
                    'relative flex w-full flex-col items-center gap-0.5 px-2 py-3 text-xs font-medium transition-all duration-200',
                    isOverflowActive ? 'text-primary' : 'text-muted',
                  )}
                >
                  {isOverflowActive && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <MoreHorizontal className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">More</span>
                </motion.button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>More</SheetTitle>
                </SheetHeader>
                <ul className="mt-4 flex flex-col gap-1">
                  {overflowItems.map((item) => {
                    const active = isActive(item.path)
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                            active
                              ? 'bg-primary/8 text-primary'
                              : 'text-muted hover:bg-surface-hover hover:text-text-primary',
                          )}
                        >
                          <span className="flex-shrink-0">{item.icon}</span>
                          <span>{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </SheetContent>
            </Sheet>
          </li>
        )}
      </ul>
    </nav>
  )
}
