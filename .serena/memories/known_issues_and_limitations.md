# Known Issues & Limitations

## Known Test Failures
5 pre-existing jsdom CORS failures in hook tests. These are environment limitations (jsdom doesn't handle CORS properly), not bugs.

## Current Limitations (Not Yet Customizable Per Tenant)
1. **Extended colors**: `surface`, `muted`, `border`, `destructive`, `warning`, `success` are hardcoded in `src/index.css` — TenantTheme only overrides 4 of 10 theme colors
2. **Typography**: All tenants share Inter font — no font customization
3. **Favicon / page title**: Not set dynamically from tenant config
4. **Labels / i18n**: All UI text hardcoded in Spanish — no per-tenant language overrides
5. **Layout variants**: Same sidebar + header for every tenant
6. **Custom fields usage**: `settings` bag exists in TenantConfig but nothing reads from it

## Extension Points (Future)
1. Full color theming — Expand TenantTheme to all 10 CSS variables
2. Typography — Add `fontFamily` field to TenantTheme
3. Dynamic page title/favicon — Read from tenant config
4. i18n — Integrate react-i18next
5. Settings consumption — Typed keys in `settings` with hooks like `useTenantSetting('currency')`
6. Layout variants — Use `settings.layout` to switch layout components

## Bugs Fixed During Build (B1-B17)
Documented in PROGRESS.md. Key learnings:
- ToastProvider is a sibling, not a wrapper (B1)
- Zod `.default()` doesn't work with zodResolver — set defaults in `useForm({ defaultValues })` (B3, B4)
- Auth0 callback detection needed to prevent premature login redirect (B17)
- `*.localhost` subdomain requires special handling (2 parts instead of 3) (B15)
- Auth0 error responses (`?error=...`) must be caught to prevent infinite redirect loop (B16)
