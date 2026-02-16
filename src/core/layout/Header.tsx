import { useLocation } from 'react-router'
import { Menu, Bell, Sun, Moon, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@core/auth/useAuth'
import { useTenant } from '@core/tenant/useTenant'
import { useThemeMode } from '@core/hooks/useThemeMode'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Avatar,
  AvatarFallback,
} from '@core/components/ui'

interface HeaderProps {
  readonly onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const { tenantConfig } = useTenant()
  const { mode, toggle } = useThemeMode()
  const location = useLocation()

  const currentModule = location.pathname.split('/').filter(Boolean)[0] ?? ''
  const moduleLabel = currentModule.charAt(0).toUpperCase() + currentModule.slice(1)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const notificationCount = 0

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center border-b border-border/50 px-4 shadow-[var(--shadow-xs)]">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="mr-3 min-h-11 min-w-11 rounded-lg p-2 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-primary md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        {tenantConfig.theme.logoUrl ? (
          <img
            src={tenantConfig.theme.logoUrl}
            alt={tenantConfig.theme.appName}
            className="h-8 w-auto"
          />
        ) : (
          <span className="gradient-text text-lg font-bold">{tenantConfig.theme.appName}</span>
        )}
      </div>

      {/* Breadcrumb */}
      {moduleLabel && (
        <div className="ml-4 hidden items-center gap-2 text-sm text-muted md:flex">
          <span className="text-border">/</span>
          <span className="font-medium text-text-secondary">{moduleLabel}</span>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          className="min-h-11 min-w-11 rounded-lg p-2 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-primary"
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative min-h-11 min-w-11 rounded-lg p-2 text-muted transition-all duration-200 hover:bg-primary/10 hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center rounded-full ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40 hover:shadow-[var(--shadow-glow-primary)]"
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="gradient-primary text-xs font-medium text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="text-sm font-medium text-text-primary">{user?.name}</p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={logout}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
