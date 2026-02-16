import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { useAuth } from '@core/auth/useAuth'

interface AuthGuardProps {
  readonly children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, login, logout } = useAuth()
  const [searchParams] = useSearchParams()

  const authError = useMemo(() => {
    const error = searchParams.get('error')
    const description = searchParams.get('error_description')
    if (!error) return null
    return { error, description }
  }, [searchParams])

  // Auth0 callback in progress — SDK is exchanging code for tokens
  const isProcessingCallback = searchParams.has('code') && searchParams.has('state')

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !authError && !isProcessingCallback) {
      login()
    }
  }, [isLoading, isAuthenticated, login, authError, isProcessingCallback])

  if (authError) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-xl font-semibold text-red-600">Authentication Error</h1>
        <p className="max-w-md text-center text-gray-600">
          {authError.description ?? authError.error}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={login}
          >
            Try Again
          </button>
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || isProcessingCallback) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
