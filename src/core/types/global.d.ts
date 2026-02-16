interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly VITE_AUTH0_AUDIENCE: string
  readonly VITE_AUTH0_CALLBACK_URL: string
  readonly VITE_AUTH_BYPASS?: string
  readonly VITE_DEFAULT_TENANT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
