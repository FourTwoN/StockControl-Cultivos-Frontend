// Runtime config type (injected via public/config.js)
interface RuntimeConfig {
  API_URL?: string
  AUTH0_DOMAIN?: string
  AUTH0_CLIENT_ID?: string
  AUTH0_AUDIENCE?: string
  AUTH0_CALLBACK_URL?: string
  AUTH_BYPASS?: boolean
  DEFAULT_TENANT_ID?: string
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig
  }
}

// Helper to get config value with runtime override support
function getConfig<T>(key: keyof RuntimeConfig, viteValue: T): T {
  const runtimeValue = window.__RUNTIME_CONFIG__?.[key]
  if (runtimeValue !== undefined) {
    return runtimeValue as T
  }
  return viteValue
}

// Environment configuration with runtime override support
// Priority: window.__RUNTIME_CONFIG__ > import.meta.env.VITE_*
const env = {
  API_URL: getConfig('API_URL', import.meta.env.VITE_API_URL as string),
  AUTH0_DOMAIN: getConfig('AUTH0_DOMAIN', import.meta.env.VITE_AUTH0_DOMAIN as string),
  AUTH0_CLIENT_ID: getConfig('AUTH0_CLIENT_ID', import.meta.env.VITE_AUTH0_CLIENT_ID as string),
  AUTH0_AUDIENCE: getConfig('AUTH0_AUDIENCE', import.meta.env.VITE_AUTH0_AUDIENCE as string),
  AUTH0_CALLBACK_URL: getConfig(
    'AUTH0_CALLBACK_URL',
    import.meta.env.VITE_AUTH0_CALLBACK_URL as string,
  ),
  AUTH_BYPASS: getConfig('AUTH_BYPASS', import.meta.env.VITE_AUTH_BYPASS === 'true'),
  DEFAULT_TENANT_ID: getConfig(
    'DEFAULT_TENANT_ID',
    import.meta.env.VITE_DEFAULT_TENANT_ID as string | undefined,
  ),
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const

export default env
