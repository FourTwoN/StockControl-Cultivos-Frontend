import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { resolveTenantId } from '../tenantResolver'

function setWindowLocation(overrides: Partial<Location>) {
  Object.defineProperty(window, 'location', {
    value: {
      hostname: 'localhost',
      pathname: '/',
      ...overrides,
    },
    writable: true,
    configurable: true,
  })
}

describe('resolveTenantId', () => {
  beforeEach(() => {
    setWindowLocation({ hostname: 'localhost', pathname: '/' })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('subdomain resolution', () => {
    it('resolves tenant from subdomain', () => {
      setWindowLocation({ hostname: 'acme.demeter.ai', pathname: '/' })

      expect(resolveTenantId()).toBe('acme')
    })

    it('resolves tenant from deep subdomain', () => {
      setWindowLocation({ hostname: 'acme.app.demeter.ai', pathname: '/' })

      expect(resolveTenantId()).toBe('acme')
    })

    it('returns null for two-part hostname (no subdomain)', () => {
      // Delete the env var so resolveFromEnv returns null
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', undefined as unknown as string)
      setWindowLocation({ hostname: 'demeter.ai', pathname: '/' })

      const result = resolveTenantId()
      expect(result).toBeFalsy()
    })
  })

  describe('path prefix resolution', () => {
    it('resolves tenant from path prefix', () => {
      setWindowLocation({ hostname: 'localhost', pathname: '/acme/inventario' })

      expect(resolveTenantId()).toBe('acme')
    })

    it('does not match known routes as tenant', () => {
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', undefined as unknown as string)
      setWindowLocation({ hostname: 'localhost', pathname: '/inventario/batch-1' })

      const result = resolveTenantId()
      expect(result).toBeFalsy()
    })

    it('does not match login route as tenant', () => {
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', undefined as unknown as string)
      setWindowLocation({ hostname: 'localhost', pathname: '/login' })

      const result = resolveTenantId()
      expect(result).toBeFalsy()
    })
  })

  describe('environment variable fallback', () => {
    it('falls back to VITE_DEFAULT_TENANT_ID', () => {
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', 'default-tenant')
      setWindowLocation({ hostname: 'localhost', pathname: '/' })

      expect(resolveTenantId()).toBe('default-tenant')
    })

    it('returns null when env variable is undefined', () => {
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', undefined as unknown as string)
      setWindowLocation({ hostname: 'localhost', pathname: '/' })

      expect(resolveTenantId()).toBeNull()
    })
  })

  describe('localhost handling', () => {
    it('skips subdomain resolution for localhost', () => {
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', undefined as unknown as string)
      setWindowLocation({ hostname: 'localhost', pathname: '/' })

      expect(resolveTenantId()).toBeNull()
    })

    it('skips subdomain resolution for 127.0.0.1', () => {
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', undefined as unknown as string)
      setWindowLocation({ hostname: '127.0.0.1', pathname: '/' })

      expect(resolveTenantId()).toBeNull()
    })

    it('skips subdomain resolution for IP addresses', () => {
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', undefined as unknown as string)
      setWindowLocation({ hostname: '192.168.1.100', pathname: '/' })

      expect(resolveTenantId()).toBeNull()
    })
  })

  describe('resolution priority', () => {
    it('prefers subdomain over path', () => {
      setWindowLocation({
        hostname: 'tenant-a.demeter.ai',
        pathname: '/tenant-b/inventario',
      })

      expect(resolveTenantId()).toBe('tenant-a')
    })

    it('prefers path over env when subdomain is unavailable', () => {
      vi.stubEnv('VITE_DEFAULT_TENANT_ID', 'env-tenant')
      setWindowLocation({ hostname: 'localhost', pathname: '/path-tenant/dashboard' })

      expect(resolveTenantId()).toBe('path-tenant')
    })
  })
})
