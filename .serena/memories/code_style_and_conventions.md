# Code Style & Conventions

## TypeScript
- Strict mode enabled (noUnusedLocals, noUnusedParameters, verbatimModuleSyntax, erasableSyntaxOnly)
- Target: ES2022
- Module: ESNext with bundler resolution
- `type` keyword required for type-only imports (`import type { ... }`)

## Formatting (Prettier)
- No semicolons (`"semi": false`)
- Single quotes (`'singleQuote': true`)
- Trailing commas everywhere (`"trailingComma": "all"`)
- Print width: 100
- Tab width: 2
- Arrow parens: always

## Naming Conventions
- **Files**: camelCase for utilities (e.g., `apiClient.ts`, `tenantResolver.ts`)
- **Components**: PascalCase (e.g., `AuthProvider.tsx`, `DataTable.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useTenant.ts`)
- **Types**: PascalCase (e.g., `TenantConfig`, `ApiError`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `AUTH_TOKEN_KEY`, `ICON_SIZE`)
- **Enums**: PascalCase object const pattern (e.g., `ModuleType = { CORE: 'core', DLC: 'dlc' } as const`)

## Patterns Used
- **Barrel exports**: Every module has `index.ts` re-exporting public API
- **Immutability**: `readonly` arrays, `as const` assertions, no mutation
- **React.lazy**: All module route components are lazy-loaded
- **Zod schemas**: For form validation, paired with react-hook-form via @hookform/resolvers
- **TanStack Query**: For all server state (queries + mutations)
- **Zustand**: For client state (e.g., Toast store)
- **Axios interceptors**: Auth token + tenant ID injection, error handling
- **createElement for icons**: `createElement(Icon, { size })` instead of JSX in non-JSX files

## Component Patterns
- `forwardRef` for form components (Input, Select)
- Design system components accept `className` prop for extension
- Modal uses React portal
- DataTable is generic with sorting + pagination
- Forms use react-hook-form Controller via FormField wrapper

## Error Handling
- API errors mapped to `ApiError` type (`{ status, message, timestamp }`)
- 401 → clear token + redirect to login
- 403 → logged + rejected
- 500+ → logged + rejected
- ErrorBoundary wraps entire app

## Testing Conventions
- Vitest with jsdom environment
- MSW for API mocking
- Testing Library for component tests
- Test files: `*.test.{ts,tsx}` in `src/` or `tests/`
- Custom render with providers in `tests/test-utils.tsx`
