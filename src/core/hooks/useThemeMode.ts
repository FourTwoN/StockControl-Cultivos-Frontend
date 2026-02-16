import { useState, useEffect, useCallback } from 'react'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'demeter-theme-mode'

function getSystemPreference(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredMode(): ThemeMode | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return null
}

function applyMode(mode: ThemeMode): void {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() => getStoredMode() ?? getSystemPreference())

  useEffect(() => {
    applyMode(mode)
  }, [mode])

  // Listen for system preference changes when no explicit user choice
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    function handleChange(e: MediaQueryListEvent) {
      if (!getStoredMode()) {
        setMode(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { mode, toggle } as const
}
