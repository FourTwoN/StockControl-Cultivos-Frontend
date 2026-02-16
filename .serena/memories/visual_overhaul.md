# Visual Overhaul — Changes Made

## Summary
Applied "Stripe/Shadcn + Demeter" visual overhaul in 5 phases. No new dependencies added. All changes are CSS/Tailwind class modifications.

## Phase 1: Theme Foundation (index.css)
- Expanded color system: added `surface-hover`, `text-primary`, `text-secondary`
- 5-level shadow system: `--shadow-xs` through `--shadow-xl` + `--shadow-glow-primary`
- Dark mode: `.dark` class with inverted colors, darker shadows
- 6 keyframe animations: fade-in, slide-up, slide-in-right, zoom-in, scale-in, shimmer
- Utility classes: `.glass` (glassmorphism), `.hover-lift`, `.gradient-text`, `.gradient-primary`
- Custom scrollbars using primary colors
- Text selection highlight with primary color

## Phase 2: Design System Components (11 files)
- **Button**: gradient-primary background, glow shadow on hover, press feedback (scale 0.98), ring focus
- **Card**: rounded-xl, subtle border (border/50), hover lift (-1px) with shadow-md
- **Input/Select**: ring-based focus glow instead of outline, surface bg
- **Modal**: backdrop-blur-sm, zoom-in animation, rounded-xl, close button rounded-full
- **Badge**: border added for definition, font-semibold
- **DataTable**: surface-hover header, primary tint on row hover, tracking-wider headers
- **Toast**: slide-in-right animation, shadow-lg, rounded-xl
- **Skeleton**: shimmer gradient animation instead of pulse
- **EmptyState**: gradient icon background, fade-in animation
- **ConfirmDialog**: inherits Modal improvements

## Phase 3: Layout Components (5 files)
- **Header**: glassmorphism (.glass), gradient text for app name, glow avatar ring, scale-in dropdown
- **Sidebar**: left border accent on active items, subtle primary tint hovers, smoother transition
- **MobileNav**: glassmorphism, active bar indicator, shadow
- **ErrorBoundary**: gradient icon bg, zoom-in animation, gradient button

## Phase 4: Dark Mode
- New hook: `src/core/hooks/useThemeMode.ts`
- System preference detection with `matchMedia`
- User choice persisted in `localStorage` (key: `demeter-theme-mode`)
- Toggle button (Sun/Moon) in Header
- Exported from `src/core/hooks/index.ts`

## Phase 5: TenantTheme Enhancement
- `hexToRgb()` helper derives RGB from tenant primary hex
- `--shadow-glow-primary` dynamically set per tenant color
- No changes to TenantConfig type (backward compatible)

## Test Impact
- Button test updated: `bg-primary` → `gradient-primary` assertion
- 94/94 tests passing (improved from 89/94 pre-overhaul)

## Files Changed
- `src/index.css` (complete rewrite)
- `src/core/components/ui/` — all 11 component files
- `src/core/layout/` — Header, Sidebar, MobileNav, ErrorBoundary
- `src/core/tenant/TenantTheme.tsx`
- `src/core/hooks/useThemeMode.ts` (new)
- `src/core/hooks/index.ts` (barrel export updated)
- `src/core/components/ui/__tests__/Button.test.tsx` (assertion updated)
