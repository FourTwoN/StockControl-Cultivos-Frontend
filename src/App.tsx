import { Suspense } from 'react'
import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@core/auth'
import { AuthGuard } from '@core/auth'
import { TenantProvider, TenantTheme } from '@core/tenant'
import { ErrorBoundary } from '@core/layout'
import { ToastProvider } from '@core/components/ui'
import { Skeleton } from '@core/components/ui'
import { queryClient } from '@core/api'
import { AuthenticatedApp } from './AuthenticatedApp'

function PageFallback() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton variant="rectangle" className="h-8 w-64" />
      <Skeleton variant="rectangle" className="h-96" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <AuthGuard>
                <TenantProvider>
                  <TenantTheme>
                    <Suspense fallback={<PageFallback />}>
                      <AuthenticatedApp />
                    </Suspense>
                  </TenantTheme>
                </TenantProvider>
              </AuthGuard>
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
