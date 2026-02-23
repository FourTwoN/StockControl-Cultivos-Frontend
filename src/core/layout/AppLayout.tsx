import { useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { Header } from '@core/layout/Header'
import { Sidebar } from '@core/layout/Sidebar'
import { MobileNav } from '@core/layout/MobileNav'
import type { NavItem } from '@core/layout/types'

interface AppLayoutProps {
  readonly children: ReactNode
  readonly navItems: readonly NavItem[]
}

export function AppLayout({ children, navItems }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onMenuToggle={openSidebar} />

      <div className="flex flex-1">
        <Sidebar
          items={navItems}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main content - offset for collapsed sidebar (72px) */}
        <main className="flex-1 transition-all duration-300 md:ml-[72px] p-4 pb-20 md:p-6 md:pb-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      <MobileNav items={navItems} />
    </div>
  )
}
