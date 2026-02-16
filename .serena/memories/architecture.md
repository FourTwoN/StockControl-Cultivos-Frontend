# Architecture

## Directory Structure
```
src/
  core/                     # Shared infrastructure
    api/                    # Axios client (apiClient.ts), TanStack Query config (queryClient.ts), types
    auth/                   # Auth0 wrapper (AuthProvider), AuthGuard, RoleGuard, useAuth hook
    tenant/                 # TenantProvider, TenantTheme, tenantResolver, useTenant hook
    layout/                 # AppLayout, Sidebar, Header, MobileNav, ErrorBoundary
    components/             # Design system: Button, Input, Select, Modal, DataTable, Card, Badge, Skeleton, EmptyState, Toast, ConfirmDialog
    hooks/                  # useFeatureFlag, usePermissions, usePagination, useDebounce
    config/                 # env.ts, modules.ts (registry), navigation.ts, routes.ts
    types/                  # enums.ts, global.d.ts
  modules/                  # Business modules (each self-contained)
    inventario/             # Stock batches, movements, lifecycle tracking
    productos/              # Products, categories, families catalog
    ventas/                 # Sales flow, receipts
    costos/                 # Cost entries, inventory valuation
    usuarios/               # User management, RBAC
    ubicaciones/            # Warehouses, locations, bins (Leaflet maps)
    empaquetado/            # Packaging catalog
    precios/                # Price lists, inline editing, CSV upload
    analytics/              # Dashboard with KPIs, charts, CSV export
    fotos/         [DLC]    # Photo processing sessions, gallery
    chatbot/       [DLC]    # AI chat with streaming, markdown, chart rendering
tests/
  setup.ts                  # MSW + Testing Library setup
  mocks/                    # MSW handlers and server
  test-utils.tsx            # Testing utilities with providers
deploy/
  cloudrun/                 # Knative service YAML
  cloudbuild.yaml           # CI/CD pipeline
  terraform/                # Cloud Run infra
```

## Module Internal Structure
Each module follows the same pattern:
```
modules/<name>/
  types/           # TypeScript interfaces + Zod schemas
  services/        # API service functions (axios calls)
  hooks/           # TanStack Query hooks (queries + mutations)
  components/      # Module-specific React components
  pages/           # Route-level page components
  routes.tsx       # Lazy-loaded route definitions
  index.ts         # Barrel export
```

## Provider Tree (App.tsx)
```
ErrorBoundary
  BrowserRouter
    QueryClientProvider
      AuthProvider (Auth0)
        AuthGuard
          TenantProvider
            TenantTheme
              Suspense
                AuthenticatedApp (→ AppLayout → AppRoutes)
      ToastProvider (sibling, not wrapper)
```

## Multi-Tenancy
- Tenant resolution chain: subdomain → path → JWT claim → env variable
- TenantProvider fetches config from `GET /api/v1/tenants/:id/config`
- TenantTheme injects 4 CSS vars on :root (--color-primary, --color-secondary, --color-accent, --color-background)
- API requests include `Authorization: Bearer <jwt>` and `X-Tenant-ID` headers
- Data isolation via PostgreSQL RLS on backend

## Conditional Modules
- All 11 modules (9 core + 2 DLC) are conditional
- Controlled by `TenantConfig.enabledModules` array from backend
- Module registry in `core/config/modules.ts` is the single source of truth
- Navigation, routing, and default redirect all derive from enabledModules
- `useFeatureFlag(moduleKey)` checks if module is enabled

## Path Aliases
- `@core/*` → `src/core/*`
- `@modules/*` → `src/modules/*`
Configured in both `tsconfig.app.json` and `vite.config.ts`

## Vendor Chunking (Production)
- `vendor-react`: react, react-dom, react-router
- `vendor-query`: @tanstack/react-query
- `vendor-charts`: recharts
- `vendor-maps`: leaflet, react-leaflet

## Auth Modes
- `VITE_AUTH_BYPASS=true`: Local dev user with all roles, no Auth0
- `VITE_AUTH_BYPASS=false`: Real Auth0 SPA + JWT with custom claims (tenant_id, roles)
