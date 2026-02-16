import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from './types.ts'

const AUTH_TOKEN_KEY = 'auth0_token'
const TENANT_ID_KEY = 'tenant_id'
const LOGIN_PATH = '/login'
const AUTH_BYPASS = import.meta.env.VITE_AUTH_BYPASS === 'true'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

function addAuthHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const tenantId = localStorage.getItem(TENANT_ID_KEY)

  if (import.meta.env.DEV) {
    console.debug('[API] Request:', config.method?.toUpperCase(), config.url)
    console.debug('[API] Token present:', Boolean(token), token ? `(${token.slice(0, 20)}...)` : '')
    console.debug('[API] Tenant ID:', tenantId)
  }

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  if (tenantId) {
    config.headers.set('X-Tenant-ID', tenantId)
  }

  return config
}

function buildApiError(status: number, message: string): ApiError {
  return {
    status,
    message,
    timestamp: new Date().toISOString(),
  }
}

function handleUnauthorized(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)

  // In local bypass mode there is no real login flow, so avoid redirect loops.
  if (AUTH_BYPASS) {
    return
  }

  if (window.location.pathname !== LOGIN_PATH) {
    window.location.href = LOGIN_PATH
  }
}

function handleErrorResponse(error: AxiosError<ApiError>): Promise<never> {
  const status = error.response?.status ?? 0

  if (status === 401) {
    handleUnauthorized()
    return Promise.reject(buildApiError(401, 'Session expired. Redirecting to login.'))
  }

  if (status === 403) {
    console.error('[API] Forbidden:', error.response?.data?.message ?? 'Access denied')
    return Promise.reject(error.response?.data ?? buildApiError(403, 'Access denied.'))
  }

  if (status >= 500) {
    console.error('[API] Server error:', error.response?.data?.message ?? 'Internal server error')
    return Promise.reject(
      error.response?.data ?? buildApiError(status, 'An unexpected server error occurred.'),
    )
  }

  return Promise.reject(
    error.response?.data ?? buildApiError(status, error.message || 'An unexpected error occurred.'),
  )
}

apiClient.interceptors.request.use(addAuthHeaders)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => handleErrorResponse(error),
)

export { apiClient }
