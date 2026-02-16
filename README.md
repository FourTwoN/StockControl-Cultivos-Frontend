# Demeter AI 2.0 — Frontend Template

Multi-tenant React frontend template for the Demeter AI 2.0 platform. Industry-agnostic by design — clone it, customize it per vertical (Cultivos, Comerciantes, Vending, etc.), and deploy to GCP Cloud Run.

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI | React | 19.2 |
| Build | Vite | 7.3 |
| Language | TypeScript (strict) | 5.9 |
| Styling | Tailwind CSS | 4.1 |
| Auth | Auth0 | @auth0/auth0-react 2.3 |
| Server State | TanStack Query | 5.90 |
| Client State | Zustand | 5.0 |
| Forms | react-hook-form + Zod | 7.55 / 3.25 |
| Charts | Recharts | 2.15 |
| Maps | Leaflet + react-leaflet | 1.9 / 5.0 |
| Icons | Lucide React | 0.511 |
| Testing | Vitest + Testing Library + MSW | 4.0 / 16.3 / 2.7 |
| E2E | Playwright | 1.58 |

## Project Structure

```
src/
  core/                          # Shared infrastructure
    auth/                        # Auth0 wrapper, AuthGuard, RoleGuard, useAuth
    tenant/                      # TenantProvider, TenantTheme, resolver, useTenant
    api/                         # Axios client + interceptors (auth, tenant, error)
    layout/                      # AppLayout, Sidebar, Header, MobileNav, ErrorBoundary
    components/                  # Design system (Button, Input, Modal, DataTable, etc.)
    hooks/                       # useFeatureFlag, usePermissions, usePagination, useDebounce
    config/                      # env.ts, navigation.ts, routes.ts
    types/                       # Enums, global type declarations
  modules/                       # Business modules (each self-contained)
    inventario/                  # Stock batches, movements, lifecycle tracking
    productos/                   # Products, categories, families catalog
    ventas/                      # Sales flow, receipts
    costos/                      # Cost entries, inventory valuation
    usuarios/                    # User management, RBAC (admin/supervisor/worker/viewer)
    ubicaciones/                 # Warehouses, locations, bins (Leaflet maps)
    empaquetado/                 # Packaging catalog (types, materials, colors)
    precios/                     # Price lists, inline editing, CSV bulk upload
    analytics/                   # Dashboard with KPIs, charts, CSV export
    fotos/          [DLC]        # Photo processing sessions, gallery, image comparison
    chatbot/        [DLC]        # AI chat with streaming, markdown, chart rendering
```

Each module follows the same internal structure:

```
modules/<name>/
  types/           # TypeScript interfaces + Zod validation schemas
  services/        # API service functions (axios calls)
  hooks/           # TanStack Query hooks (queries + mutations)
  components/      # Module-specific React components
  pages/           # Route-level page components
  routes.tsx       # Lazy-loaded route definitions
  index.ts         # Barrel export
```

## Multi-Tenancy

Multiple tenants within the same industry share a single GCP Cloud Run deployment. The frontend differentiates them at runtime — no rebuild required.

### Tenant Resolution

The template resolves the current tenant using a priority chain (`core/tenant/tenantResolver.ts`):

1. **Subdomain** — `gobar.demeter.app` (production)
2. **Path prefix** — `demeter.app/gobar/dashboard` (staging)
3. **JWT claim** — `token.tenant_id` (fallback)
4. **Environment variable** — `VITE_DEFAULT_TENANT_ID` (development)

Once resolved, `TenantProvider` fetches the tenant config from `GET /api/v1/tenants/:id/config` and makes it available app-wide via React context.

### Tenant Config Shape

The backend returns a `TenantConfig` object (`core/tenant/types.ts`) that drives all per-tenant behavior:

```typescript
interface TenantConfig {
  id: string                          // "go-bar"
  name: string                        // "Go Bar"
  industry: Industry                  // CULTIVOS | COMERCIANTES | VENDING | ...
  theme: TenantTheme                  // Visual branding (see below)
  enabledModules: string[]            // ["inventario", "productos", ..., "fotos"]
  settings: Record<string, unknown>   // Open bag for custom config per tenant
}

interface TenantTheme {
  primary: string       // "#FF6B35"
  secondary: string     // "#0F172A"
  accent: string        // "#E65100"
  background: string    // "#F8FAFC"
  logoUrl?: string      // "https://cdn.demeter.app/go-bar/logo.png"
  appName: string       // "Go Bar Stock"
}
```

### What Changes Per Tenant (runtime)

| Aspect | Mechanism | Source file |
|--------|-----------|-------------|
| **Brand colors** | 4 CSS custom properties (`--color-primary`, `--color-secondary`, `--color-accent`, `--color-background`) injected on `:root` | `core/tenant/TenantTheme.tsx` |
| **Logo** | `theme.logoUrl` rendered in the header; falls back to text `appName` | `core/layout/Header.tsx` |
| **App name** | `theme.appName` shown as header title when no logo is set | `core/layout/Header.tsx` |
| **Enabled modules** | `enabledModules[]` controls which modules (core and DLC) appear in sidebar navigation, mobile nav, and which routes are mounted. All 11 modules are conditional. | `core/config/modules.ts`, `core/config/navigation.ts`, `AppRoutes.tsx` |
| **Data isolation** | Every API request includes `X-Tenant-ID` header — the backend filters via PostgreSQL RLS | `core/api/apiClient.ts` |
| **Role-based access** | JWT roles (`ADMIN`, `SUPERVISOR`, `WORKER`, `VIEWER`) control UI permissions per user | `core/hooks/usePermissions.ts` |
| **Custom settings** | `settings: Record<string, unknown>` — open extension point for arbitrary per-tenant config | `core/tenant/types.ts` |

### Example: Two Tenants, Same Industry

```
Industria: Comerciantes (single Cloud Run service)

         Tenant A (Go Bar)              Tenant B (Central de Bebidas)
         ──────────────────             ─────────────────────────────
Logo:    go-bar.png                     central-bebidas.png
Name:    "Go Bar"                       "Central de Bebidas"
Primary: #FF6B35 (orange)              #2E86C1 (blue)
Accent:  #E65100                        #1565C0
Modules: inventario, productos,         inventario, productos,
         ventas, ubicaciones, fotos     ventas, costos, chatbot
Data:    X-Tenant-ID: go-bar            X-Tenant-ID: central-bebidas
Roles:   admin sees user mgmt           admin sees user mgmt
Font:    Inter (shared)                 Inter (shared)
Layout:  Sidebar + Header (shared)      Sidebar + Header (shared)
Texts:   Spanish (shared)               Spanish (shared)
```

### Module Registry

All 11 modules (9 core + 2 DLC) are defined in a single registry (`core/config/modules.ts`). Each entry maps a module key to its label, path, icon, and type (`core` | `dlc`). Navigation, routing, and local dev config all derive from this registry — no duplication.

Adding a new module means adding one entry to the registry, one lazy import in `AppRoutes.tsx`, and the module directory under `src/modules/`.

### Current Limitations

The following aspects are **not yet customizable** per tenant:

| Limitation | Detail |
|------------|--------|
| **Extended colors** | `surface`, `muted`, `border`, `destructive`, `warning`, `success` are hardcoded in `src/index.css` — `TenantTheme` only overrides 4 of the 10 theme colors |
| **Typography** | All tenants share the Inter font family — no font customization per tenant |
| **Favicon / page title** | Not set dynamically from tenant config |
| **Labels / i18n** | All UI text is hardcoded in Spanish — no per-tenant language or label overrides |
| **Layout variants** | Every tenant sees the same sidebar + header layout — no option for a custom landing dashboard or alternative navigation |
| **Custom fields usage** | The `settings` bag exists in `TenantConfig` but no component currently reads from it |

### Extension Points

To deepen per-tenant customization, the following changes would be needed:

1. **Full color theming** — Expand `TenantTheme` to include all 10 CSS variables (`surface`, `muted`, `border`, `destructive`, `warning`, `success`) and have `TenantTheme.tsx` override them all
2. **Typography** — Add a `fontFamily` field to `TenantTheme` and inject it as `--font-family` on `:root`
3. **Dynamic page title/favicon** — Read `appName` and a `faviconUrl` from tenant config in a `useEffect` that sets `document.title` and the favicon `<link>`
4. **i18n** — Integrate a library like `react-i18next` and load translations keyed by tenant locale
5. **Settings consumption** — Define typed keys within `settings` (currency, timezone, date format, visible columns, etc.) and create hooks like `useTenantSetting('currency')` to consume them
6. **Layout variants** — Use a `settings.layout` key to switch between layout components (sidebar vs. top-nav, custom dashboard landing, etc.)

## Conditional Modules

All 11 modules — both core and DLC — are conditional. A tenant's `enabledModules` array controls exactly which modules are visible and routable. The distinction between core and DLC is purely semantic (core = generally applicable, DLC = industry-specific), not mechanical — they use the same gating system.

```typescript
// All routes are data-driven from enabledModules (AppRoutes.tsx)
{enabledModules.map((key) => {
  const Component = routeComponents[key]
  const path = modulePathMap[key]
  if (!Component || !path) return null
  return <Route key={key} path={`${path}/*`} element={<Component />} />
})}

// Navigation also derived from enabledModules (navigation.ts)
export function getNavItems(enabledModules: string[]): NavItem[] {
  return getEnabledModules(enabledModules).map((m) => ({
    label: m.label, path: m.path, icon: m.icon,
  }))
}

// Default redirect goes to first enabled module, not hardcoded /inventario
const defaultPath = getFirstEnabledPath(enabledModules)
```

## Getting Started

### Quick Start (explore the UI without a backend)

This mode uses a local auth bypass and a fake tenant config with all 11 modules enabled. No Auth0 credentials or backend API needed.

```bash
# 1. Clone
git clone <repo-url> demeter-frontend-<industry>
cd demeter-frontend-<industry>

# 2. Install dependencies
npm ci          # use npm install if no package-lock.json exists yet

# 3. Configure environment for local bypass
cp .env.example .env
```

Edit `.env` with these values:

```env
VITE_API_URL=http://localhost:8080
VITE_AUTH0_DOMAIN=demeter.auth0.com
VITE_AUTH0_CLIENT_ID=placeholder
VITE_AUTH0_AUDIENCE=https://api.demeter.app
VITE_AUTH0_CALLBACK_URL=http://localhost:3000/callback
VITE_AUTH_BYPASS=true
VITE_DEFAULT_TENANT_ID=local
```

```bash
# 4. Start dev server (port 3000)
npm run dev
```

With `VITE_AUTH_BYPASS=true`, the app skips Auth0 entirely and creates a local dev user with all roles (`ADMIN`, `SUPERVISOR`, `WORKER`, `VIEWER`). The tenant resolver reads `VITE_DEFAULT_TENANT_ID` and loads a built-in `TenantConfig` with all modules enabled and default green theme.

API calls will fail (no backend), but the full UI — layout, sidebar, all 11 modules, navigation — is explorable.

### Full Setup (with Auth0 + backend)

For connecting to a real backend with Auth0 authentication:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8080
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.demeter.app
VITE_AUTH0_CALLBACK_URL=http://localhost:3000/callback
VITE_AUTH_BYPASS=false
```

In this mode:
- Auth0 handles login/logout and JWT issuance
- The tenant is resolved from the JWT `tenant_id` claim (or subdomain/path in production)
- `TenantProvider` fetches the real config from `GET /api/v1/tenants/{id}/config`
- API requests include `Authorization: Bearer <jwt>` and `X-Tenant-ID` headers

### Environment Variables

| Variable | Description | Quick Start | Full Setup |
|----------|-------------|-------------|------------|
| `VITE_API_URL` | Backend API base URL | Any value | Real backend URL |
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain | Any value | Real Auth0 domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID | Any value | Real client ID |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience identifier | Any value | Real audience |
| `VITE_AUTH0_CALLBACK_URL` | OAuth callback URL | `http://localhost:3000/callback` | Same |
| `VITE_AUTH_BYPASS` | Skip Auth0 and use local dev user | `true` | `false` |
| `VITE_DEFAULT_TENANT_ID` | Override tenant resolution | `local` | Not set (resolved from JWT/subdomain) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint 9 flat config |
| `npm run format` | Prettier formatting |
| `npm test` | Run Vitest test suites |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with coverage report |
| `npm run test:e2e` | Playwright E2E tests |

## Build & Deploy

### Docker (local)

```bash
docker-compose up --build
```

Multi-stage build: `node:22-alpine` (build) + `nginx:1.27-alpine` (serve). Nginx handles SPA routing and API proxy.

---

## GCP Cloud Run Deployment — Complete Guide

Esta sección documenta exhaustivamente la arquitectura de despliegue, las decisiones de diseño, y todos los pasos necesarios para desplegar en GCP Cloud Run.

### Arquitectura de Despliegue

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              GCP Cloud Platform                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐           │
│  │  Artifact        │    │   Cloud Build    │    │   Secret         │           │
│  │  Registry        │◄───│   (CI/CD)        │───►│   Manager        │           │
│  │                  │    │                  │    │   (credentials)  │           │
│  │  Docker images   │    │  cloudbuild.yaml │    │                  │           │
│  └────────┬─────────┘    └──────────────────┘    └──────────────────┘           │
│           │                                                                       │
│           ▼                                                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐       │
│  │                         Cloud Run                                      │       │
│  │  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────┐│       │
│  │  │ cultivos-frontend  │  │ vending-frontend   │  │ comercio-frontend││       │
│  │  │ (0-5 instances)    │  │ (0-5 instances)    │  │ (0-5 instances)  ││       │
│  │  │                    │  │                    │  │                  ││       │
│  │  │ ┌────────────────┐ │  │ ┌────────────────┐ │  │ ┌──────────────┐ ││       │
│  │  │ │ nginx:1.27     │ │  │ │ nginx:1.27     │ │  │ │ nginx:1.27   │ ││       │
│  │  │ │ + React SPA    │ │  │ │ + React SPA    │ │  │ │ + React SPA  │ ││       │
│  │  │ └────────────────┘ │  │ └────────────────┘ │  │ └──────────────┘ ││       │
│  │  └────────────────────┘  └────────────────────┘  └──────────────────┘│       │
│  └──────────────────────────────────────────────────────────────────────┘       │
│                                      │                                           │
└──────────────────────────────────────┼───────────────────────────────────────────┘
                                       │
                        HTTPS (*.demeter.app)
                                       │
                                       ▼
                              ┌────────────────┐
                              │    Usuarios    │
                              │    (Browser)   │
                              └────────────────┘
```

### Estructura de Archivos de Deploy

```
deploy/
├── README.md                       # Guía rápida de despliegue
├── setup-gcp.sh                    # Script de setup inicial (ejecutar una vez)
├── cloudbuild.yaml                 # Pipeline CI/CD completo
├── .env.production.example         # Template de variables de producción
├── cloudrun/
│   └── frontend-service.yaml       # Spec Knative (referencia)
└── terraform/
    ├── versions.tf                 # Provider y versiones requeridas
    ├── variables.tf                # Definición de variables de input
    ├── main.tf                     # Recursos: Artifact Registry + Cloud Run + Trigger
    ├── outputs.tf                  # Valores de salida (URLs, IDs)
    └── terraform.tfvars.example    # Template de valores de variables

# Archivos en raíz relacionados con deploy:
Dockerfile                          # Multi-stage build con configs condicionales
docker-compose.yml                  # Desarrollo local con backend simulado
docker-entrypoint.sh                # Inyección de config en runtime
nginx.conf                          # Config nginx para docker-compose (con proxy)
nginx.cloud-run.conf                # Config nginx para Cloud Run (sin proxy)
public/config.js                    # Runtime configuration override
```

---

### Decisiones de Arquitectura

#### 1. Multi-Stage Docker Build

**Decisión:** Usar build multi-stage con `node:22-alpine` → `nginx:1.27-alpine`

**Razón:**
- **Imagen final pequeña:** ~25MB vs ~1GB si incluyéramos Node
- **Seguridad:** Imagen de producción no tiene Node, npm, ni código fuente
- **Performance:** nginx sirve assets estáticos ~10x más rápido que Node

```dockerfile
# Stage 1: Build (descartado después)
FROM node:22-alpine AS builder
# ... npm ci, npm run build ...

# Stage 2: Producción (imagen final)
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

#### 2. Variables de Entorno en Build-Time vs Runtime

**Problema:** Vite inyecta `import.meta.env.VITE_*` en tiempo de compilación, no en runtime.

**Solución implementada:** Sistema híbrido con dos capas:

| Capa | Cuándo se aplica | Uso |
|------|------------------|-----|
| **Build-time** (`--build-arg`) | Durante `docker build` | Valores por defecto para el deployment |
| **Runtime** (`RUNTIME_*` env vars) | Al iniciar container | Override sin rebuild |

```dockerfile
# Build-time: Pasados como ARG → ENV durante npm run build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Runtime: Inyectados por docker-entrypoint.sh en public/config.js
# El código JS lee primero window.__RUNTIME_CONFIG__, luego cae a import.meta.env
```

**Código en `src/core/config/env.ts`:**
```typescript
function getConfig<T>(key: keyof RuntimeConfig, viteValue: T): T {
  const runtimeValue = window.__RUNTIME_CONFIG__?.[key]
  return runtimeValue !== undefined ? runtimeValue as T : viteValue
}

const env = {
  API_URL: getConfig('API_URL', import.meta.env.VITE_API_URL as string),
  // ... resto de variables
}
```

**Cuándo usar cada uno:**

| Escenario | Método |
|-----------|--------|
| Deploy nuevo tenant | Build-time (nuevo build con `--build-arg`) |
| Cambiar API URL sin rebuild | Runtime (`RUNTIME_API_URL` en Cloud Run) |
| Hotfix de credenciales | Runtime (cambio inmediato) |
| Cambio de Auth0 domain | Build-time (requiere rebuild por seguridad) |

#### 3. Dos Configuraciones de Nginx

**Problema:** En desarrollo local (docker-compose), el frontend hace proxy a `http://backend:8080`. En Cloud Run, frontend y backend son servicios separados.

**Solución:** Dos archivos nginx con selección por ARG:

| Archivo | Uso | Características |
|---------|-----|-----------------|
| `nginx.conf` | docker-compose local | Proxy `/api/` → `http://backend:8080` |
| `nginx.cloud-run.conf` | Cloud Run producción | Sin proxy, CSP headers, health check |

```dockerfile
ARG NGINX_CONFIG=cloud-run  # Default para producción

RUN if [ "$NGINX_CONFIG" = "local" ]; then \
      cp /etc/nginx/nginx-local.conf /etc/nginx/conf.d/default.conf; \
    else \
      cp /etc/nginx/nginx-cloud-run.conf /etc/nginx/conf.d/default.conf; \
    fi
```

**docker-compose.yml usa `NGINX_CONFIG=local`:**
```yaml
services:
  frontend:
    build:
      args:
        - NGINX_CONFIG=local
```

#### 4. Artifact Registry vs Container Registry (GCR)

**Decisión:** Usar Artifact Registry (`REGION-docker.pkg.dev`) en lugar de GCR (`gcr.io`)

**Razón:**
- GCR está en modo legacy, Google recomienda migrar
- Artifact Registry tiene mejor control de acceso (IAM granular)
- Soporta políticas de limpieza automática
- Mejor integración con Cloud Build

**Formato de imagen:**
```
# GCR (legacy)
gcr.io/PROJECT_ID/image:tag

# Artifact Registry (actual)
us-central1-docker.pkg.dev/PROJECT_ID/demeter-frontend/cultivos-frontend:tag
```

#### 5. Scale to Zero

**Decisión:** `min_instance_count = 0` en Cloud Run

**Razón:**
- **Costo:** Solo pagás por requests, no por tiempo idle
- **Cold start aceptable:** ~1-2 segundos para nginx con assets estáticos
- **Para tráfico constante:** Cambiar a `min_instance_count = 1`

```terraform
scaling {
  min_instance_count = 0   # Scale to zero cuando no hay tráfico
  max_instance_count = 5   # Máximo 5 instancias concurrentes
}
```

#### 6. Concurrencia y Recursos

**Configuración elegida:**

| Parámetro | Valor | Razón |
|-----------|-------|-------|
| CPU | 1 | Suficiente para nginx sirviendo estáticos |
| Memory | 256Mi | React SPA + assets < 50MB |
| Concurrency | 80 | nginx maneja fácil 80 conexiones simultáneas |
| Timeout | 300s | Permite conexiones WebSocket largas |

```yaml
resources:
  limits:
    cpu: "1"
    memory: 256Mi
  cpu_idle: true  # CPU solo se cobra durante requests
```

---

### Configuración de Nginx para Cloud Run

El archivo `nginx.cloud-run.conf` está optimizado para Cloud Run:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing - todas las rutas sirven index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check para Cloud Run (obligatorio)
    location /health {
        access_log off;
        return 200 'OK';
        add_header Content-Type text/plain;
    }

    # Cache agresivo para assets (Vite agrega hash al nombre)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Content Security Policy para Auth0
    add_header Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https:;
        connect-src 'self' https://*.auth0.com https://*.demeter.app wss://*.demeter.app;
        frame-ancestors 'self';
    " always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript
               image/svg+xml;
    gzip_min_length 1000;

    server_tokens off;  # No exponer versión de nginx
}
```

**Explicación de cada sección:**

| Sección | Propósito |
|---------|-----------|
| `try_files $uri /index.html` | SPA routing - React Router maneja las rutas |
| `/health` | Cloud Run hace health checks, responder 200 OK |
| `expires 1y` + `immutable` | Assets con hash pueden cachearse para siempre |
| `X-Frame-Options` | Prevenir clickjacking |
| `X-Content-Type-Options` | Prevenir MIME sniffing |
| `Content-Security-Policy` | Whitelist de dominios permitidos (Auth0, API) |
| `gzip_comp_level 6` | Balance entre compresión y CPU |
| `server_tokens off` | No revelar versión de nginx |

---

### Cloud Build Pipeline (cloudbuild.yaml)

El pipeline CI/CD tiene 3 pasos:

```yaml
steps:
  # Paso 1: Build Docker image con build args
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build'
    args:
      - 'build'
      - '--build-arg'
      - 'VITE_API_URL=${_VITE_API_URL}'
      - '--build-arg'
      - 'VITE_AUTH0_DOMAIN=${_VITE_AUTH0_DOMAIN}'
      # ... resto de args ...
      - '-t'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_INDUSTRY}-frontend:$SHORT_SHA'
      - '-t'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_INDUSTRY}-frontend:latest'
      - '.'

  # Paso 2: Push a Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    id: 'push'
    args: ['push', '--all-tags', '${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_INDUSTRY}-frontend']

  # Paso 3: Deploy a Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    id: 'deploy'
    args:
      - 'run'
      - 'deploy'
      - '${_INDUSTRY}-frontend'
      - '--image'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_INDUSTRY}-frontend:$SHORT_SHA'
      - '--region'
      - '${_REGION}'
      - '--allow-unauthenticated'
      - '--cpu'
      - '1'
      - '--memory'
      - '256Mi'
      - '--min-instances'
      - '0'
      - '--max-instances'
      - '5'
```

**Substitutions (variables del pipeline):**

```yaml
substitutions:
  _INDUSTRY: template                              # Nombre del tenant/industria
  _REGION: us-central1                             # Región de GCP
  _REPOSITORY: demeter-frontend                    # Nombre del repo en Artifact Registry
  _VITE_API_URL: https://api.demeter.app          # URL del backend
  _VITE_AUTH0_DOMAIN: demeter.auth0.com           # Dominio Auth0
  _VITE_AUTH0_CLIENT_ID: ''                       # Client ID (pasar en trigger)
  _VITE_AUTH0_AUDIENCE: https://api.demeter.app   # Audience de la API
  _VITE_AUTH0_CALLBACK_URL: https://${_INDUSTRY}.demeter.app/callback
  _VITE_AUTH_BYPASS: 'false'                      # Siempre false en producción
  _VITE_DEFAULT_TENANT_ID: ''                     # Vacío (resolver desde JWT/subdomain)
```

**Cómo ejecutar manualmente:**

```bash
gcloud builds submit \
  --config deploy/cloudbuild.yaml \
  --substitutions=\
_INDUSTRY=cultivos,\
_VITE_AUTH0_DOMAIN=demeter-prod.auth0.com,\
_VITE_AUTH0_CLIENT_ID=abc123xyz,\
_VITE_API_URL=https://api.cultivos.demeter.app
```

---

### Terraform Infrastructure

#### Recursos Creados

| Recurso | Propósito |
|---------|-----------|
| `google_artifact_registry_repository` | Repositorio Docker para imágenes |
| `google_cloud_run_v2_service` | Servicio Cloud Run |
| `google_cloud_run_v2_service_iam_member` | Acceso público (allUsers) |
| `google_cloudbuild_trigger` | Trigger automático desde GitHub (opcional) |

#### Variables de Input

```hcl
# terraform.tfvars
project_id      = "demeter-prod-12345"
region          = "us-central1"
industry        = "cultivos"
image           = "us-central1-docker.pkg.dev/demeter-prod-12345/demeter-frontend/cultivos-frontend:latest"

# Auth0
auth0_domain    = "demeter-prod.auth0.com"
auth0_client_id = "aBcDeFgHiJkLmNoPqRsTuVwXyZ"  # Sensible
auth0_audience  = "https://api.demeter.app"

# Backend
api_url         = "https://api.cultivos.demeter.app"

# GitHub (opcional, para trigger automático)
github_owner    = "demeter-ai"
github_repo     = "demeter-frontend"
github_branch   = "main"
```

#### Ejecutar Terraform

```bash
cd deploy/terraform

# 1. Copiar y editar variables
cp terraform.tfvars.example terraform.tfvars
# Editar terraform.tfvars con valores reales

# 2. Inicializar
terraform init

# 3. Revisar plan
terraform plan

# 4. Aplicar
terraform apply

# 5. Ver outputs
terraform output service_url
# → https://cultivos-frontend-abc123-uc.a.run.app
```

#### Configurar Backend Remoto (equipos)

Para trabajo en equipo, usar GCS como backend:

```hcl
# deploy/terraform/versions.tf
terraform {
  backend "gcs" {
    bucket = "demeter-terraform-state"
    prefix = "frontend/cultivos"
  }
}
```

Crear el bucket primero:
```bash
gsutil mb -l us-central1 gs://demeter-terraform-state
gsutil versioning set on gs://demeter-terraform-state
```

---

### Setup Inicial de GCP

El script `deploy/setup-gcp.sh` prepara el proyecto:

```bash
#!/bin/bash
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:?Set GCP_PROJECT_ID}"
REGION="${GCP_REGION:-us-central1}"
REPOSITORY="demeter-frontend"

# 1. Habilitar APIs necesarias
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  --project="$PROJECT_ID"

# 2. Crear repositorio en Artifact Registry
gcloud artifacts repositories create "$REPOSITORY" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Demeter frontend Docker images" \
  --project="$PROJECT_ID"

# 3. Dar permisos a Cloud Build para deployar
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/iam.serviceAccountUser"
```

**Ejecutar:**
```bash
export GCP_PROJECT_ID="tu-proyecto"
export GCP_REGION="us-central1"
./deploy/setup-gcp.sh
```

---

### Flujos de Deploy

#### Flujo 1: Deploy Manual (desarrollo/testing)

```bash
# 1. Build local
docker build \
  --build-arg VITE_API_URL="https://api-staging.demeter.app" \
  --build-arg VITE_AUTH0_DOMAIN="demeter-staging.auth0.com" \
  --build-arg VITE_AUTH0_CLIENT_ID="staging-client-id" \
  --build-arg VITE_AUTH0_AUDIENCE="https://api.demeter.app" \
  --build-arg VITE_AUTH0_CALLBACK_URL="https://staging.demeter.app/callback" \
  -t us-central1-docker.pkg.dev/demeter-staging/demeter-frontend/frontend:test \
  .

# 2. Push
docker push us-central1-docker.pkg.dev/demeter-staging/demeter-frontend/frontend:test

# 3. Deploy
gcloud run deploy frontend-staging \
  --image us-central1-docker.pkg.dev/demeter-staging/demeter-frontend/frontend:test \
  --region us-central1 \
  --allow-unauthenticated
```

#### Flujo 2: CI/CD con Cloud Build (producción)

```bash
# Opción A: Trigger manual
gcloud builds submit --config deploy/cloudbuild.yaml \
  --substitutions=_INDUSTRY=cultivos,_VITE_AUTH0_CLIENT_ID=prod-client-id

# Opción B: Trigger automático (configurado con Terraform)
# Push a main → Cloud Build ejecuta automáticamente
git push origin main
```

#### Flujo 3: Terraform (infraestructura completa)

```bash
cd deploy/terraform
terraform init
terraform apply -var="industry=cultivos" -var="auth0_client_id=xxx"
```

---

### Multi-Tenant: Un Servicio por Industria

Cada industria tiene su propio Cloud Run service:

```
cultivos.demeter.app    → cultivos-frontend (Cloud Run)
                           ├── Tenant: gobar (X-Tenant-ID: gobar)
                           ├── Tenant: campo-verde (X-Tenant-ID: campo-verde)
                           └── Tenant: agroindustrias (X-Tenant-ID: agroindustrias)

vending.demeter.app     → vending-frontend (Cloud Run)
                           ├── Tenant: snack-express
                           └── Tenant: vendify

comercio.demeter.app    → comercio-frontend (Cloud Run)
                           └── Tenant: central-bebidas
```

**Para agregar una nueva industria:**

```bash
# 1. Deploy con Cloud Build
gcloud builds submit --config deploy/cloudbuild.yaml \
  --substitutions=_INDUSTRY=nueva-industria,...

# 2. O con Terraform
terraform apply -var="industry=nueva-industria" ...

# 3. Configurar DNS
# Agregar CNAME: nueva-industria.demeter.app → ghs.googlehosted.com
```

---

### Configuración de Auth0

#### URLs a Configurar en Auth0 Dashboard

```
Application Settings → Allowed Callback URLs:
https://cultivos.demeter.app/callback,
https://vending.demeter.app/callback,
https://comercio.demeter.app/callback,
http://localhost:3000/callback

Application Settings → Allowed Logout URLs:
https://cultivos.demeter.app,
https://vending.demeter.app,
https://comercio.demeter.app,
http://localhost:3000

Application Settings → Allowed Web Origins:
https://cultivos.demeter.app,
https://vending.demeter.app,
https://comercio.demeter.app,
http://localhost:3000
```

#### Custom Claims para Multi-Tenant

En Auth0 → Actions → Flows → Login, agregar Action:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://demeter.app/';

  // tenant_id viene de user metadata o organization
  const tenantId = event.user.app_metadata?.tenant_id
    || event.organization?.name;

  if (tenantId) {
    api.idToken.setCustomClaim(namespace + 'tenant_id', tenantId);
    api.accessToken.setCustomClaim(namespace + 'tenant_id', tenantId);
  }

  // roles
  const roles = event.authorization?.roles || [];
  api.idToken.setCustomClaim(namespace + 'roles', roles);
  api.accessToken.setCustomClaim(namespace + 'roles', roles);
};
```

---

### Runtime Configuration Override

Para cambiar configuración sin rebuild:

```bash
# Cambiar API URL en runtime
gcloud run services update cultivos-frontend \
  --region us-central1 \
  --set-env-vars "RUNTIME_API_URL=https://new-api.demeter.app"

# Cambiar múltiples valores
gcloud run services update cultivos-frontend \
  --region us-central1 \
  --set-env-vars "\
RUNTIME_API_URL=https://new-api.demeter.app,\
RUNTIME_AUTH0_DOMAIN=new-tenant.auth0.com"
```

**Variables runtime disponibles:**

| Variable | Propósito |
|----------|-----------|
| `RUNTIME_API_URL` | Override de URL del backend |
| `RUNTIME_AUTH0_DOMAIN` | Override de dominio Auth0 |
| `RUNTIME_AUTH0_CLIENT_ID` | Override de client ID |
| `RUNTIME_AUTH0_AUDIENCE` | Override de audience |
| `RUNTIME_AUTH0_CALLBACK_URL` | Override de callback URL |
| `RUNTIME_AUTH_BYPASS` | Activar/desactivar bypass (solo dev) |
| `RUNTIME_DEFAULT_TENANT_ID` | Override de tenant por defecto |

---

### Troubleshooting

#### Container no pasa health check

```bash
# Ver logs
gcloud run services logs read cultivos-frontend --region us-central1

# Verificar que /health responde
curl https://cultivos-frontend-xxx.a.run.app/health
# Debe responder: OK
```

**Causa común:** nginx no tiene el location `/health` configurado.

#### Auth0 redirect loop infinito

**Síntomas:** Login → redirect → login → redirect...

**Causas y soluciones:**

| Causa | Solución |
|-------|----------|
| Callback URL no coincide | Verificar que `VITE_AUTH0_CALLBACK_URL` coincide exactamente con Auth0 Dashboard |
| Protocolo diferente | Usar `https://` en producción, `http://` en local |
| Dominio diferente | El dominio del callback debe coincidir con el de la app |

#### CORS errors al llamar API

**Síntomas:** `Access-Control-Allow-Origin` error en consola.

**Soluciones:**

1. **Backend debe permitir el dominio del frontend:**
   ```python
   # FastAPI
   origins = [
       "https://cultivos.demeter.app",
       "https://vending.demeter.app",
       "http://localhost:3000",
   ]
   app.add_middleware(CORSMiddleware, allow_origins=origins, ...)
   ```

2. **Verificar CSP en nginx:**
   ```nginx
   # connect-src debe incluir el dominio de la API
   connect-src 'self' https://*.auth0.com https://*.demeter.app;
   ```

#### Build falla por variables vacías

**Síntomas:** `VITE_AUTH0_CLIENT_ID` está vacío en el build.

**Solución:** Pasar todas las variables requeridas:
```bash
gcloud builds submit --config deploy/cloudbuild.yaml \
  --substitutions=\
_INDUSTRY=cultivos,\
_VITE_AUTH0_CLIENT_ID=tu-client-id,\  # No olvidar
_VITE_AUTH0_DOMAIN=tu-dominio.auth0.com
```

#### Cold start lento (>3 segundos)

**Causas:**
- Primera request después de scale-to-zero
- Imagen muy grande

**Soluciones:**
```bash
# 1. Mantener mínimo 1 instancia (costo adicional)
gcloud run services update cultivos-frontend \
  --min-instances 1

# 2. Verificar tamaño de imagen
docker images | grep cultivos-frontend
# Debe ser ~25MB para nginx + assets
```

---

### Checklist de Deploy

Antes de hacer deploy a producción:

- [ ] Variables de Auth0 configuradas correctamente
- [ ] Auth0 Dashboard tiene las URLs correctas
- [ ] Backend tiene CORS configurado para el dominio
- [ ] DNS apunta al servicio Cloud Run
- [ ] Secret Manager tiene los secrets (si aplica)
- [ ] Terraform state en GCS (para equipos)
- [ ] Cloud Build service account tiene permisos

Después del deploy:

- [ ] Health check responde 200
- [ ] Login con Auth0 funciona
- [ ] API calls funcionan (no CORS errors)
- [ ] Assets cargan correctamente (JS, CSS, imágenes)
- [ ] Tenant theming se aplica (colores, logo)

## Path Aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:

```typescript
import { apiClient } from '@core/api/apiClient'
import { useProducts } from '@modules/productos/hooks/useProducts'
```

## Vendor Chunking

Production builds split into optimized chunks:

- `vendor-react` — react, react-dom, react-router
- `vendor-query` — @tanstack/react-query
- `vendor-charts` — recharts
- `vendor-maps` — leaflet, react-leaflet

## Testing

- **Unit/Integration**: Vitest + React Testing Library + MSW (mock API handlers)
- **E2E**: Playwright (placeholder specs for auth, inventario, multi-tenant flows)
- **94 tests** across 10 suites covering auth, tenant, API client, feature flags, module registry, navigation filtering, products, and inventory

## Artifact Registry

Docker images are organized by **industry** in Google Artifact Registry:

```
us-central1-docker.pkg.dev/PROJECT/
└── cultivadores/               # Industry-specific repo
    ├── frontend:v1.0.0
    ├── frontend:latest
    └── ...
```

### Why per-industry repos?

- **Isolated permissions**: Grant access per industry
- **Independent versioning**: Each industry can be at different versions
- **Industry-specific builds**: Different Auth0 configs, API URLs per industry
- **Future-proof**: Add new industries without affecting existing ones

---

## Image Handling (Signed URLs)

The frontend receives **signed URLs** for images from the backend, not direct storage URLs:

```typescript
// API response includes signed URLs
interface ImageWithUrlsDTO {
  id: string
  sessionId: string
  originalFilename: string
  imageUrl: string | null      // Signed URL (expires in 60 min)
  thumbnailUrl: string | null  // Signed URL for thumbnail
  detections: Detection[]
}

// Fetch images with signed URLs
const images = await photoService.fetchSessionImages(sessionId)
// images[0].imageUrl = "https://storage.googleapis.com/...?X-Goog-Signature=..."
```

### Benefits

- **No public bucket access**: Storage bucket remains private
- **Time-limited access**: URLs expire after configurable time
- **Provider-agnostic**: Works with GCS, S3, or any provider
- **Secure**: Signed with service account credentials

---

## ML Processing Integration

The frontend integrates with the ML processing pipeline via Cloud Tasks:

### Production Flow (Async)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   Cloud Tasks       │────▶│  ML Worker  │
│  (upload)   │     │  (enqueue)  │     │  ml-processing-queue│     │  (process)  │
└─────────────┘     └─────────────┘     └─────────────────────┘     └─────────────┘
       │                                                                    │
       │                         Poll for status                            │
       └──────────────────────────────────────────────────────────────────▶│
                                GET /photo-sessions/{id}/status
```

### Development Flow (Sync)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  ML Worker  │
│  (upload)   │     │  (direct)   │     │  (process)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    Immediate response
```

### Frontend Code

```typescript
// Upload and process (async in prod, sync in dev)
const result = await mlService.processImages({
  images: [{ filename, contentType, imageBase64 }],
  pipeline: 'SEGMENT_DETECT'
})

// Poll for completion (production only)
const status = await photoService.fetchSessionStatus(result.sessionId)
// status.processedImages / status.totalImages
```

---

## Using as a Template

To create an industry-specific frontend:

1. Clone/fork this template
2. Configure tenant-specific branding via the backend tenant config API
3. Enable/disable DLC modules through feature flags
4. Add industry-specific components under the relevant modules
5. Deploy as a separate Cloud Run service per industry

The template ships with generic business logic. Industry customization happens at the **tenant config level** (branding, modules) and optionally by adding industry-specific components — never by forking core modules.
