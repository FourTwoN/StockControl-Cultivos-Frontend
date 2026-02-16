# Implementation Plan: Visual Overhaul (Stripe/Shadcn + Demeter)

## Requirements Restatement

Upgrade the visual quality of the Demeter AI 2.0 Frontend, combining:
- **Shadcn/Stripe aesthetic**: Polished data-dense design, consistent component system, dark mode
- **Demeter original branding**: Gradients, glassmorphism, hover lift effects, custom scrollbars, animations

**Constraints:**
- Must maintain multi-tenant theming system (`TenantTheme.tsx` + CSS vars)
- Must not break existing component APIs (props stay the same)
- Must not add new dependencies (pure CSS/Tailwind changes)
- Must keep all 89/94 tests passing

---

## Phase 1: Theme Foundation (`src/index.css`)

**Goal:** Expand the CSS foundation with dark mode, shadows, animations, and utility classes.

### 1.1 — Expand color system with dark mode
- Add `--color-surface-hover`, `--color-text-primary`, `--color-text-secondary` CSS vars
- Add `.dark` class scope with inverted colors (backgrounds dark, text light)
- Surface colors: light `#F8FAFC` / dark `#0F172A`
- Border colors: light `#E2E8F0` / dark `#1E293B`

### 1.2 — Shadow system (4 levels)
```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
--shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
--shadow-md: 0 4px 12px rgba(0,0,0,0.08);
--shadow-lg: 0 10px 30px rgba(0,0,0,0.12);
--shadow-glow-primary: 0 4px 14px rgba(var(--color-primary-rgb), 0.25);
```

### 1.3 — Keyframe animations
- `fadeIn` (opacity 0→1, 0.3s)
- `slideUp` (translateY 8px→0, 0.3s)
- `slideInRight` (translateX 100%→0, 0.3s)
- `zoomIn` (scale 0.95→1 + opacity, 0.4s)
- `scaleIn` (scale 0.9→1 + opacity, 0.2s)

### 1.4 — Utility classes
- `.glass` — `backdrop-filter: blur(12px); background: rgba(255,255,255,0.8)` (dark: `rgba(15,23,42,0.8)`)
- `.hover-lift` — `transition: transform 0.2s, box-shadow 0.2s; &:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) }`
- `.gradient-primary` — `background: linear-gradient(135deg, var(--color-primary), var(--color-accent))`
- Custom scrollbar styles using `--color-primary`

### 1.5 — Base body/element refinements
- Transition on `color-scheme` for dark mode
- Selection highlight using primary color
- Better focus-visible ring (ring + offset)

**Files changed:** `src/index.css`

---

## Phase 2: Design System Components (`src/core/components/ui/`)

**Goal:** Upgrade all 11 UI components with better visual quality. No API changes.

### 2.1 — Button.tsx
- Add `transition-all duration-200` (currently `transition-colors`)
- Primary variant: gradient background + shadow glow on hover
- All variants: `active:scale-[0.98]` press feedback
- Hover: subtle `translateY(-1px)` lift on primary/secondary/destructive
- Focus ring: `focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2`

### 2.2 — Card.tsx
- Default: `shadow-sm` → use `var(--shadow-sm)` from new system
- Clickable cards: `hover-lift` class (translateY -2px + shadow-md)
- Border: `border-border/50` for subtler borders
- Add subtle transition on all properties

### 2.3 — Input.tsx + Select.tsx
- Focus: `focus:ring-2 focus:ring-primary/20 focus:border-primary` (glow effect)
- Remove `focus:outline-*` pattern, use ring instead (more elegant)
- Error state: `ring-2 ring-destructive/20 border-destructive`
- Background on focus: subtle surface color shift

### 2.4 — Modal.tsx
- Backdrop: add `backdrop-blur-sm` (glassmorphism)
- Dialog: better shadow (`shadow-xl` → `var(--shadow-lg)`), border `border-border/50`
- Animate-in: smoother `duration-300` with `ease-out`
- Close button: rounded-full + hover background

### 2.5 — DataTable.tsx
- Header row: `bg-surface` with slightly stronger text
- Row hover: `hover:bg-primary/[0.03]` (very subtle primary tint)
- Active sort column: primary color indicator
- Pagination: better button styling with rounded borders
- Table wrapper: `var(--shadow-sm)` instead of no shadow

### 2.6 — Badge.tsx
- Slightly more padding: `px-3 py-1` instead of `px-2.5 py-0.5`
- Font weight: `font-semibold` for more punch
- Border: add `border border-{color}/20` for definition

### 2.7 — Toast.tsx
- Better shadow: `var(--shadow-lg)`
- Glass effect on toast container
- Smoother slide-in animation
- Progress bar for auto-dismiss timer

### 2.8 — Skeleton.tsx
- Better pulse: gradient shimmer effect instead of plain pulse
- Use `bg-border/40` for lighter skeleton

### 2.9 — EmptyState.tsx
- Icon container: gradient background (`bg-gradient-to-br from-primary/10 to-accent/10`)
- Subtle fade-in animation on mount

### 2.10 — ConfirmDialog.tsx
- Inherits Modal improvements (no direct changes needed)
- Destructive variant: red tint on icon area

**Files changed:** All 11 files in `src/core/components/ui/`

---

## Phase 3: Layout Components

**Goal:** Transform layout from "flat corporate" to "polished app".

### 3.1 — Header.tsx
- Apply `glass` class: `backdrop-blur-12` + semi-transparent background
- Bottom border: `border-border/50` for subtlety
- Subtle shadow: `var(--shadow-xs)`
- App name: gradient text using `--color-primary` → `--color-accent`
- User avatar: gradient border ring
- Notification bell: hover with primary tint background
- Dropdown: `var(--shadow-lg)` + `border-border/50` + glass

### 3.2 — Sidebar.tsx
- Background: glass effect (slight transparency)
- Active nav item: left border accent (`border-l-2 border-primary`) + `bg-primary/8`
- Hover: `bg-primary/5` with smooth transition
- Icons: primary color on active, muted on inactive
- Collapse transition: smoother cubic-bezier
- Section dividers between nav groups

### 3.3 — MobileNav.tsx
- Glass background (backdrop-blur)
- Active indicator: dot or bar above active icon using primary color
- Better spacing and icon sizing
- Subtle top shadow (inset)

### 3.4 — AppLayout.tsx
- Background: `bg-background` with subtle pattern/gradient (optional)
- Content area: subtle fade-in on route change

### 3.5 — ErrorBoundary.tsx
- Better error card styling with gradient accent
- Improved button styling (uses upgraded Button)

**Files changed:** `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`, `AppLayout.tsx`, `ErrorBoundary.tsx`

---

## Phase 4: Dark Mode

**Goal:** Add system-aware dark mode with manual toggle.

### 4.1 — Dark mode CSS variables in `index.css`
- Define all colors under `.dark` scope
- Background: `#0B1120`, Surface: `#111827`, Border: `#1F2937`
- Text: primary `#F1F5F9`, secondary `#94A3B8`, muted `#64748B`
- Glass: `rgba(17,24,39,0.8)` with blur

### 4.2 — Dark mode hook (`useThemeMode.ts`)
- New file: `src/core/hooks/useThemeMode.ts`
- Read system preference via `matchMedia('prefers-color-scheme: dark')`
- Persist user choice in `localStorage`
- Toggle adds/removes `.dark` class on `<html>`

### 4.3 — Theme toggle in Header
- Sun/Moon icon button next to notification bell
- Smooth icon transition

**Files changed:** `src/index.css`, new `src/core/hooks/useThemeMode.ts`, `Header.tsx`

---

## Phase 5: TenantTheme Enhancement

**Goal:** Expand tenant theming to derive more colors from primary.

### 5.1 — Expand `TenantTheme.tsx`
- From primary color, derive: `--color-primary-rgb` (for rgba usage)
- Override `--shadow-glow-primary` based on tenant primary
- Apply glass tint based on primary
- Set `--color-surface-hover` derived from primary at very low opacity

### 5.2 — No changes to `TenantConfig` type
- All derivations are CSS-side, no backend changes needed

**Files changed:** `TenantTheme.tsx`

---

## Risks

| Risk | Level | Mitigation |
|------|-------|------------|
| Breaking existing tests | MEDIUM | Only CSS/class changes, no API changes. Run `npm test` after each phase. |
| Dark mode + tenant colors conflict | LOW | Tenant colors override CSS vars regardless of mode. Test both modes. |
| Performance of glassmorphism | LOW | `backdrop-filter` is GPU-accelerated. Only on fixed elements (header, mobile nav). |
| Tailwind v4 `@theme` compatibility | LOW | Custom CSS vars work alongside @theme. Already proven in current setup. |

---

## Execution Order

1. **Phase 1** (Foundation) — Must come first, everything depends on it
2. **Phase 2** (Components) — Can parallelize individual component updates
3. **Phase 3** (Layout) — Depends on Phase 1 utilities
4. **Phase 4** (Dark mode) — Depends on Phase 1 CSS vars
5. **Phase 5** (Tenant theme) — Last, builds on everything

## Verification After Each Phase

```bash
npx tsc --noEmit    # 0 errors
npm test            # 89/94 passing
npm run build       # Succeeds
npm run dev         # Visual inspection
```
