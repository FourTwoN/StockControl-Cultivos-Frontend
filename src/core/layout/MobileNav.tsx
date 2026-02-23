import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import type { NavItem } from '@core/layout/types'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@core/components/ui'
import { MaterialIcon } from '@core/components/ui/MaterialIcon'

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
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white md:hidden"
      style={{
        borderColor: 'var(--demeter-border-sidebar)',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <ul className="flex items-center justify-around">
        {visibleItems.map((item) => {
          const active = isActive(item.path)
          return (
            <li key={item.path} className="flex-1">
              <motion.div whileTap={{ scale: 0.92 }}>
                <Link
                  to={item.path}
                  className="relative flex flex-col items-center gap-0.5 px-2 py-3 text-xs font-medium transition-all duration-200"
                  style={{
                    color: active ? '#40a04a' : '#6b806d',
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      className="absolute inset-x-2 top-0 h-0.5 rounded-full"
                      style={{ backgroundColor: '#40a04a' }}
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
                  className="relative flex w-full flex-col items-center gap-0.5 px-2 py-3 text-xs font-medium transition-all duration-200"
                  style={{
                    color: isOverflowActive ? '#40a04a' : '#6b806d',
                  }}
                >
                  {isOverflowActive && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      className="absolute inset-x-2 top-0 h-0.5 rounded-full"
                      style={{ backgroundColor: '#40a04a' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <MaterialIcon name="more_horiz" size={24} />
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
                              ? 'bg-[rgba(64,160,74,0.1)]'
                              : 'hover:bg-[rgba(64,160,74,0.05)]',
                          )}
                          style={{
                            color: active ? '#40a04a' : '#6b806d',
                          }}
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
