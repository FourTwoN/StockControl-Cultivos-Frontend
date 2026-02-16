# Task Completion Checklist

When a coding task is completed, run these checks:

## 1. TypeScript Check
```bash
npx tsc --noEmit
```
Must produce 0 errors.

## 2. Lint
```bash
npm run lint
```

## 3. Format
```bash
npm run format
```

## 4. Tests
```bash
npm test
```
Expected: 89/94 passing (5 pre-existing jsdom CORS failures are known).
New tests must pass.

## 5. Build
```bash
npm run build
```
Must succeed (includes tsc check).

## 6. Code Quality
- [ ] No `console.log` (use proper logging if needed)
- [ ] No hardcoded secrets
- [ ] No mutation (use immutable patterns)
- [ ] Type annotations present
- [ ] Functions < 50 lines
- [ ] Files < 800 lines
- [ ] Proper error handling
- [ ] No unused imports/variables (enforced by TS strict)
- [ ] `import type` for type-only imports (enforced by verbatimModuleSyntax)

## 7. Follow Existing Patterns
- New modules follow `types/ → services/ → hooks/ → components/ → pages/ → routes.tsx → index.ts`
- New components follow design system conventions (variants, sizes, className prop)
- New hooks follow TanStack Query patterns
- New services use `apiClient` from `@core/api`
- Register new modules in `core/config/modules.ts`
