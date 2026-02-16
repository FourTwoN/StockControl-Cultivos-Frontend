import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import env from '@core/config/env'
import type { AuthUser } from '@core/auth/types'
import { AuthContext } from '@core/auth/authContext'
import type { AuthContextValue } from '@core/auth/authContext'
import { UserRole } from '@core/types/enums'

// Auth0 custom claims
// Backend expects 'permissions' and 'tenant_id' without namespace
// But we also support legacy namespaced claims for backward compatibility
const CLAIMS_NAMESPACE = 'https://demeter.app'
const AUTH_TOKEN_KEY = 'auth0_token'
const TENANT_ID_KEY = 'tenant_id'

// Stable empty array to prevent re-render loops
const EMPTY_ROLES: readonly UserRole[] = []

interface AuthProviderProps {
  readonly children: ReactNode
}

interface AuthStateProviderProps {
  readonly children: ReactNode
}

function LocalAuthProvider({ children }: AuthStateProviderProps) {
  const roles = useMemo<readonly UserRole[]>(() => Object.values(UserRole), [])
  const tenantId = env.DEFAULT_TENANT_ID ?? 'local'

  const user = useMemo<AuthUser>(
    () => ({
      id: 'local-dev-user',
      email: 'dev@local.test',
      name: 'Local Developer',
      tenantId,
      roles,
    }),
    [roles, tenantId],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token: 'local-dev-token',
      isAuthenticated: true,
      isLoading: false,
      roles,
      login: () => undefined,
      logout: () => undefined,
    }),
    [roles, user],
  )

  useEffect(() => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'local-dev-token')
    localStorage.setItem(TENANT_ID_KEY, tenantId)

    return () => {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(TENANT_ID_KEY)
    }
  }, [tenantId])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function Auth0StateProvider({ children }: AuthStateProviderProps) {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchToken = async () => {
      if (!isAuthenticated) {
        if (!cancelled) {
          setToken(null)
        }
        return
      }

      try {
        const accessToken = await getAccessTokenSilently()
        if (!cancelled) {
          setToken(accessToken)
        }
      } catch {
        if (!cancelled) {
          setToken(null)
        }
      }
    }

    void fetchToken()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, getAccessTokenSilently])

  const roles = useMemo(() => {
    if (!auth0User) return EMPTY_ROLES
    // Try non-namespaced first (backend format), then namespaced (legacy)
    const permissions =
      (auth0User['permissions'] as readonly UserRole[] | undefined) ??
      (auth0User[`${CLAIMS_NAMESPACE}/roles`] as readonly UserRole[] | undefined)
    return permissions ?? EMPTY_ROLES
  }, [auth0User])

  const user = useMemo<AuthUser | null>(() => {
    if (!auth0User || !isAuthenticated) return null

    // Try non-namespaced first (backend format), then namespaced (legacy)
    const tenantId =
      (auth0User['tenant_id'] as string | undefined) ??
      (auth0User[`${CLAIMS_NAMESPACE}/tenant_id`] as string | undefined)

    return {
      id: auth0User.sub ?? '',
      email: auth0User.email ?? '',
      name: auth0User.name ?? '',
      picture: auth0User.picture,
      tenantId: tenantId ?? '',
      roles,
    }
  }, [auth0User, isAuthenticated, roles])

  const login = useCallback(() => {
    void loginWithRedirect()
  }, [loginWithRedirect])

  const logout = useCallback(() => {
    void auth0Logout({
      logoutParams: { returnTo: window.location.origin },
    })
  }, [auth0Logout])

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      return
    }
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }, [token])

  useEffect(() => {
    if (user?.tenantId) {
      localStorage.setItem(TENANT_ID_KEY, user.tenantId)
      return
    }
    localStorage.removeItem(TENANT_ID_KEY)
  }, [user?.tenantId])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      roles,
      login,
      logout,
    }),
    [user, token, isAuthenticated, isLoading, roles, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: AuthProviderProps) {
  if (env.AUTH_BYPASS) {
    return <LocalAuthProvider>{children}</LocalAuthProvider>
  }

  return (
    <Auth0Provider
      domain={env.AUTH0_DOMAIN}
      clientId={env.AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: env.AUTH0_AUDIENCE,
        scope: 'openid profile email',
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      <Auth0StateProvider>{children}</Auth0StateProvider>
    </Auth0Provider>
  )
}
