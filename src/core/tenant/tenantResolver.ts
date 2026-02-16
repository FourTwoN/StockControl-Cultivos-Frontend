const KNOWN_ROUTES = new Set([
  'inventario',
  'productos',
  'ventas',
  'reportes',
  'configuracion',
  'usuarios',
  'dashboard',
  'lotes',
  'movimientos',
  'login',
  'callback',
  'logout',
])

function isLocalhost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '[::1]'
  )
}

function isIpAddress(hostname: string): boolean {
  const ipv4Regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  return ipv4Regex.test(hostname) || hostname.startsWith('[')
}

function isCloudRunUrl(hostname: string): boolean {
  // Cloud Run URLs: *.run.app or *.a.run.app
  return hostname.endsWith('.run.app')
}

function resolveFromSubdomain(): string | null {
  const { hostname } = window.location

  if (isLocalhost(hostname) || isIpAddress(hostname)) {
    return null
  }

  // Skip subdomain resolution for Cloud Run auto-generated URLs
  if (isCloudRunUrl(hostname)) {
    return null
  }

  const parts = hostname.split('.')

  // Handle *.localhost (e.g., go-bar.localhost for local dev)
  if (parts.length === 2 && parts[1] === 'localhost') {
    return parts[0] ?? null
  }

  // Standard subdomain: tenant.domain.tld (3+ parts)
  if (parts.length < 3) {
    return null
  }

  return parts[0] ?? null
}

function resolveFromPath(): string | null {
  const { pathname } = window.location
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return null
  }

  const firstSegment = segments[0]
  if (!firstSegment || KNOWN_ROUTES.has(firstSegment)) {
    return null
  }

  return firstSegment
}

function resolveFromEnv(): string | null {
  // Check runtime config first, then build-time env
  return window.__RUNTIME_CONFIG__?.DEFAULT_TENANT_ID ?? import.meta.env.VITE_DEFAULT_TENANT_ID ?? null
}

/**
 * Resolution chain (highest to lowest priority):
 * 1. Subdomain — go-bar.demeter.app or go-bar.localhost (production/dev)
 * 2. Path prefix — /go-bar/dashboard (staging)
 * 3. JWT claim — tenant_id from authenticated user (runtime fallback)
 * 4. Env variable — VITE_DEFAULT_TENANT_ID (development override)
 */
export function resolveTenantId(jwtTenantId?: string | null): string | null {
  return resolveFromSubdomain() ?? resolveFromPath() ?? jwtTenantId ?? resolveFromEnv()
}
