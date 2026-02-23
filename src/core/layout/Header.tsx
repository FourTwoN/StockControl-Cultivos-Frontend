import { Menu, Bell, Sun, Moon, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@core/auth/useAuth'
import { useThemeMode } from '@core/hooks/useThemeMode'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Avatar,
  AvatarFallback,
} from '@core/components/ui'
import { DemeterLogo } from '@core/components/ui/DemeterLogo'

interface HeaderProps {
  readonly onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const { mode, toggle } = useThemeMode()

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
    <header
      className="sticky top-0 z-30 flex h-16 items-center border-b px-4 md:hidden"
      style={{
        backgroundColor: 'rgba(246, 248, 246, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderColor: 'rgba(229, 231, 235, 0.5)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="mr-3 min-h-11 min-w-11 rounded-lg p-2 transition-all duration-200 hover:bg-[rgba(64,160,74,0.1)]"
        style={{ color: 'var(--demeter-text-secondary)' }}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Logo */}
      <DemeterLogo size="sm" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          className="min-h-11 min-w-11 rounded-lg p-2 transition-all duration-200 hover:bg-[rgba(64,160,74,0.1)]"
          style={{ color: 'var(--demeter-text-secondary)' }}
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative min-h-11 min-w-11 rounded-lg p-2 transition-all duration-200 hover:bg-[rgba(23,207,23,0.1)]"
          style={{ color: 'var(--demeter-text-secondary)' }}
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
              className="flex items-center rounded-full transition-all duration-200"
              style={{
                boxShadow: '0 0 0 2px rgba(64, 160, 74, 0.3)',
              }}
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback
                  className="text-xs font-medium text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  }}
                >
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
