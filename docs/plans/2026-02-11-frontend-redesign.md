# Frontend Redesign — StockControl-Frontend

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform StockControl-Frontend into a polished, fluid SaaS template with shadcn/ui components, CSS + Framer Motion animations, and all features from DemeterAI-front integrated into the existing modular architecture.

**Architecture:** Improve existing `core/` + `modules/` structure. Replace 12 custom UI components with shadcn/ui equivalents. Add Framer Motion for complex animations (modals, lists, page transitions). Enrich DLC modules (analytics, chatbot, fotos) with features from DemeterAI-front. Keep all tenant theming via CSS variables.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4.1, shadcn/ui (Radix + CVA), Framer Motion 12, Recharts, Leaflet, Auth0, TanStack Query 5, Zustand 5, Zod 3

---

## Phase 1: Foundation (shadcn/ui + Framer Motion setup)

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`
- Create: `src/lib/utils.ts`

**Step 1: Install shadcn/ui dependencies**

```bash
cd /home/francobertoldi/Documents/StockControl/StockControl-Frontend
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tooltip @radix-ui/react-popover @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-slot @radix-ui/react-separator @radix-ui/react-switch @radix-ui/react-checkbox @radix-ui/react-avatar @radix-ui/react-scroll-area @radix-ui/react-collapsible @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-progress @radix-ui/react-label
npm install class-variance-authority clsx tailwind-merge
```

**Step 2: Install Framer Motion**

```bash
npm install framer-motion
```

**Step 3: Install chatbot/analytics enrichment deps**

```bash
npm install react-markdown remark-gfm rehype-raw rehype-sanitize react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

**Step 4: Create utility file `src/lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

**Step 5: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/utils.ts
git commit -m "feat: add shadcn/ui, framer-motion, and markdown dependencies"
```

---

### Task 2: Configure shadcn/ui theme tokens

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.ts` (if exists, otherwise `vite.config.ts`)

The current `index.css` already has a solid CSS variable system. We need to add shadcn/ui-compatible tokens that map to our existing variables so shadcn components work with our tenant theming.

**Step 1: Add shadcn-compatible CSS variables to `src/index.css`**

Add after the existing `@theme` block:

```css
/* shadcn/ui compatibility layer — maps to our tenant-overridable vars */
:root {
  /* ... keep all existing vars ... */

  /* shadcn tokens (mapped to our system) */
  --radius: 0.625rem;

  /* RGB versions for opacity support */
  --primary-rgb: 27, 79, 114;
  --destructive-rgb: 239, 68, 68;
  --success-rgb: 16, 185, 129;
  --warning-rgb: 245, 158, 11;
}
```

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add shadcn/ui compatible CSS tokens mapped to tenant theme"
```

---

### Task 3: Create animation utilities

**Files:**
- Create: `src/core/components/motion/AnimatedPage.tsx`
- Create: `src/core/components/motion/AnimatedList.tsx`
- Create: `src/core/components/motion/FadeIn.tsx`
- Create: `src/core/components/motion/index.ts`

**Step 1: Create `src/core/components/motion/AnimatedPage.tsx`**

```tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedPageProps {
  readonly children: ReactNode
  readonly className?: string
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

**Step 2: Create `src/core/components/motion/AnimatedList.tsx`**

```tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedListProps {
  readonly children: ReactNode
  readonly className?: string
  readonly staggerDelay?: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] } },
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedListItem({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
```

**Step 3: Create `src/core/components/motion/FadeIn.tsx`**

```tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInProps {
  readonly children: ReactNode
  readonly className?: string
  readonly delay?: number
  readonly direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

const directionMap = {
  up: { y: 16 },
  down: { y: -16 },
  left: { x: 16 },
  right: { x: -16 },
  none: {},
}

export function FadeIn({ children, className, delay = 0, direction = 'up' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

**Step 4: Create barrel export `src/core/components/motion/index.ts`**

```typescript
export { AnimatedPage } from './AnimatedPage'
export { AnimatedList, AnimatedListItem } from './AnimatedList'
export { FadeIn } from './FadeIn'
```

**Step 5: Verify build**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add src/core/components/motion/
git commit -m "feat: add Framer Motion animation primitives (AnimatedPage, AnimatedList, FadeIn)"
```

---

## Phase 2: Replace Core UI Components with shadcn/ui

### Task 4: Replace Button component

**Files:**
- Modify: `src/core/components/ui/Button.tsx`

**Step 1: Rewrite Button with CVA + Radix Slot**

Replace the entire file with:

```tsx
import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'gradient-primary text-white shadow-sm hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-px',
        secondary: 'bg-secondary text-white shadow-sm hover:bg-secondary/90 hover:-translate-y-px',
        outline: 'border border-border bg-transparent text-text-primary hover:bg-surface-hover hover:border-primary/30',
        ghost: 'text-text-primary hover:bg-surface-hover',
        destructive: 'bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:-translate-y-px',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean
  readonly isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={asChild ? undefined : 'button'}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
```

**Step 2: Verify no broken imports**

```bash
npm run build
```

**Step 3: Run existing tests**

```bash
npm test
```

**Step 4: Commit**

```bash
git add src/core/components/ui/Button.tsx
git commit -m "refactor: replace Button with shadcn/ui CVA-based component"
```

---

### Task 5: Replace Modal with Radix Dialog

**Files:**
- Modify: `src/core/components/ui/Modal.tsx`

**Step 1: Rewrite Modal using Radix Dialog + Framer Motion**

```tsx
import { forwardRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={cn('fixed inset-0 z-50 bg-black/40 backdrop-blur-sm', className)}
    />
  </DialogPrimitive.Overlay>
))
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  }
>(({ className, children, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} asChild {...props}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full rounded-xl border border-border bg-surface p-6 shadow-xl',
            'focus:outline-none',
            sizeClasses[size],
            className,
          )}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 flex flex-col gap-1.5', className)} {...props} />
)

const DialogTitle = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-text-primary', className)}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
)

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

// Backwards-compatible Modal wrapper
interface ModalProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly description?: string
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  readonly children: React.ReactNode
}

export function Modal({ open, onClose, title, description, size, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <AnimatePresence>
        {open && (
          <DialogContent size={size}>
            {(title || description) && (
              <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
            )}
            {children}
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
```

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/core/components/ui/Modal.tsx
git commit -m "refactor: replace Modal with Radix Dialog + Framer Motion animations"
```

---

### Task 6: Replace Select with Radix Select

**Files:**
- Modify: `src/core/components/ui/Select.tsx`

Replace with Radix Select primitive that supports search, groups, and tenant theming. Follow shadcn/ui Select pattern with `cn()` utility.

---

### Task 7: Replace Toast with Radix Toast

**Files:**
- Modify: `src/core/components/ui/Toast.tsx`

Replace with Radix Toast primitive. Add slide-in animation via Framer Motion. Keep existing `useToast` hook API.

---

### Task 8: Add new shadcn/ui components

**Files (create all):**
- `src/core/components/ui/Tabs.tsx` - Radix Tabs with animated indicator
- `src/core/components/ui/Tooltip.tsx` - Radix Tooltip
- `src/core/components/ui/DropdownMenu.tsx` - Radix Dropdown Menu
- `src/core/components/ui/Popover.tsx` - Radix Popover
- `src/core/components/ui/ScrollArea.tsx` - Radix Scroll Area
- `src/core/components/ui/Separator.tsx` - Radix Separator
- `src/core/components/ui/Switch.tsx` - Radix Switch
- `src/core/components/ui/Checkbox.tsx` - Radix Checkbox
- `src/core/components/ui/Avatar.tsx` - Radix Avatar
- `src/core/components/ui/Progress.tsx` - Radix Progress with animation
- `src/core/components/ui/Accordion.tsx` - Radix Accordion
- `src/core/components/ui/AlertDialog.tsx` - Radix Alert Dialog (replace ConfirmDialog)
- `src/core/components/ui/Sheet.tsx` - Slide-out panel (mobile detail views)

Each component follows the pattern:
1. Wrap Radix primitive
2. Style with `cn()` + Tailwind + our CSS variables
3. Add Framer Motion for enter/exit animations where appropriate
4. Export from `src/core/components/ui/index.ts`

---

### Task 9: Update barrel exports

**Files:**
- Modify: `src/core/components/ui/index.ts`

Export all new components. Keep backwards compatibility with existing imports.

---

## Phase 3: Layout & Navigation Improvements

### Task 10: Improve Sidebar with animations

**Files:**
- Modify: `src/core/layout/Sidebar.tsx`

**Changes:**
- Add hover expand (like DemeterAI-front's Navbar) - sidebar auto-expands on hover when collapsed
- Add tooltip on collapsed icons
- Add smooth icon-to-label transition
- Add active indicator animation (sliding pill effect)
- Keep existing Lucide icons
- Add user avatar section at bottom

---

### Task 11: Improve Header

**Files:**
- Modify: `src/core/layout/Header.tsx`

**Changes:**
- Add glassmorphism background (`backdrop-filter: blur`)
- Add notification bell with badge
- Add user dropdown menu (Radix DropdownMenu)
- Add breadcrumb navigation
- Add tenant logo/name from TenantTheme
- Smooth scroll shadow on scroll

---

### Task 12: Add page transition wrapper

**Files:**
- Modify: `src/AppRoutes.tsx`

Wrap route outlet with `AnimatePresence` + `AnimatedPage` for smooth page transitions. Use `useLocation` as key for exit/enter animations.

---

### Task 13: Improve MobileNav

**Files:**
- Modify: `src/core/layout/MobileNav.tsx`

**Changes:**
- Bottom tab bar with icons (like iOS)
- Active tab indicator animation
- Haptic-style press animation (scale on active)
- Show only top 5 modules, overflow into "More" sheet

---

## Phase 4: Module Enrichment

### Task 14: Enrich Analytics module

**Files (create/modify in `src/modules/analytics/`):**

This is the biggest enrichment. DemeterAI-front has 4 sections with 30+ components. StockControl-Frontend has 7 components.

**New components to add:**
- `components/sections/ExecutiveSummary.tsx` - KPI overview cards with animated counters
- `components/sections/WarehouseScorecard.tsx` - Per-warehouse health metrics
- `components/sections/WarehouseHeatmap.tsx` - Color-coded warehouse occupancy
- `components/sections/TopProductsChart.tsx` - Horizontal bar chart
- `components/sections/ValuationDonutChart.tsx` - Donut with center label
- `components/sections/ProductDistributionTable.tsx` - Sortable data table
- `components/widgets/WidgetContainer.tsx` - Draggable widget wrapper
- `components/widgets/KPIWidget.tsx` - Configurable KPI card
- `components/widgets/BarChartWidget.tsx` - Bar chart in widget
- `components/widgets/PieChartWidget.tsx` - Pie/donut in widget
- `components/widgets/TableWidget.tsx` - Data table in widget
- `components/ExportButton.tsx` - CSV export (already exists, enhance)

**New hooks:**
- `hooks/useWarehouseScorecard.ts`
- `hooks/useGlobalProductAnalytics.ts`
- `hooks/useSalesAnalytics.ts`
- `hooks/useProductionForecast.ts`

**New utils:**
- `utils/csvExport.ts` - CSV generation and download
- `utils/colorCalculator.ts` - Dynamic color schemes for charts

**Modify:**
- `pages/AnalyticsPage.tsx` - Add section tabs, widget grid
- `services/analyticsService.ts` - Add new endpoints

All charts use Recharts (already installed). Add animated transitions on data change via Framer Motion `layoutId`.

---

### Task 15: Enrich Chatbot module

**Files (create/modify in `src/modules/chatbot/`):**

DemeterAI-front has 14 chatbot components. StockControl-Frontend has 4.

**New components to add:**
- `components/MessageList.tsx` - Virtualized message list with auto-scroll
- `components/MessageInput.tsx` - Input with send button, file attach
- `components/ChatHeader.tsx` - Session info, new session button
- `components/SessionList.tsx` - Session sidebar with search
- `components/TypingIndicator.tsx` - Animated dots indicator
- `components/MarkdownRenderer.tsx` - react-markdown with syntax highlighting
- `components/TableRenderer.tsx` - Render data tables in chat
- `components/ChartRenderer.tsx` - Already exists, enhance with more chart types
- `components/MetricCard.tsx` - KPI cards in chat responses
- `components/ToolResultCard.tsx` - Already exists, enhance styling

**New hooks:**
- `hooks/useAutoScroll.ts` - Auto-scroll to latest message
- `hooks/useStreamingResponse.ts` - SSE streaming support

**New styles:**
- `styles/chatbot.css` - Chat-specific animations (typing dots, message slide-in)

**Modify:**
- `pages/ChatPage.tsx` - Full layout with session sidebar + chat area
- `components/ChatWindow.tsx` - Integrate all new sub-components
- `services/chatService.ts` - Add streaming, statistics endpoints

---

### Task 16: Enrich Fotos module

**Files (create/modify in `src/modules/fotos/`):**

DemeterAI-front has desktop + mobile views, session filters, image comparison toggle.

**New components to add:**
- `components/SessionFilters.tsx` - Search, date range, status filter
- `components/SessionDetailSheet.tsx` - Mobile bottom sheet for details
- `components/ImageCompareToggle.tsx` - Side-by-side comparison mode

**New hooks:**
- `hooks/useSessionsPolling.ts` - Auto-refresh processing sessions
- `hooks/useCachedImage.ts` - IndexedDB image caching

**Modify:**
- `pages/PhotosPage.tsx` - Add desktop/mobile detection, filters
- `pages/SessionDetailPage.tsx` - Add image comparison view
- `components/SessionCard.tsx` - Add processing status animation
- `components/ProcessingProgress.tsx` - Animated progress bar

---

### Task 17: Enrich Ubicaciones module (CultivationPanel features)

**Files (create/modify in `src/modules/ubicaciones/`):**

DemeterAI-front's CultivationPanel has 5 tabs with rich functionality.

**New components to add:**
- `components/tabs/ConfigurationTab.tsx` - Batch & location config
- `components/tabs/MovementsTab.tsx` - Stock movement operations
- `components/tabs/ManualIntakeTab.tsx` - Manual data entry
- `components/tabs/AdministrationTab.tsx` - Admin operations
- `components/BatchCard.tsx` - Batch info display
- `components/BatchSelector.tsx` - Batch dropdown with search

**Modify:**
- `pages/CultivationPage.tsx` - Add tabbed interface (Radix Tabs)
- `components/WarehouseMap.tsx` - Add health status indicators
- `components/LocationGrid.tsx` - Add selection, batch display

---

### Task 18: Enrich Inventario module

**Modify existing components with animations and better UX:**
- `components/StockBatchList.tsx` - Add AnimatedList, better filtering
- `components/StockBatchCard.tsx` - Hover lift, status color coding
- `components/MovementForm.tsx` - Stepped form with validation animations
- `components/MovementHistory.tsx` - Timeline view with animations
- `pages/InventarioPage.tsx` - Add KPI summary cards at top

---

### Task 19: Enrich Productos module

**Modify existing components:**
- `components/ProductList.tsx` - Grid/list toggle, animated transitions
- `components/ProductForm.tsx` - Better form layout with Radix components
- `components/CategoryTree.tsx` - Accordion with expand animations
- `components/FamilyGrid.tsx` - Card grid with hover effects
- `pages/ProductsPage.tsx` - Add search + filter bar

---

### Task 20: Enrich Ventas module

**Modify existing components:**
- `components/SaleList.tsx` - DataTable with sorting, status badges
- `components/SaleForm.tsx` - Multi-step form
- `components/SaleReceipt.tsx` - Print-ready receipt with animations
- `pages/VentasPage.tsx` - Add sales summary KPIs

---

### Task 21: Enrich Precios module

**Modify existing components:**
- `components/PriceTable.tsx` - Inline editing, bulk actions
- `components/PriceUploadModal.tsx` - Drag & drop upload with progress
- `components/PriceListCard.tsx` - Status indicators, hover effects
- `pages/PriceListPage.tsx` - Add filters + stats summary

---

### Task 22: Enrich Costos module

**Modify existing components:**
- `components/CostTable.tsx` - Sortable columns, export
- `components/CostTrendChart.tsx` - Animated line chart
- `components/ValuationSummary.tsx` - Animated counter cards
- `pages/CostosPage.tsx` - Add period selector, comparison view

---

### Task 23: Enrich Empaquetado module

**Modify existing components:**
- `components/PackagingCatalogList.tsx` - Grid view with images
- `components/PackagingFilterBar.tsx` - Better filters with Radix Select
- `components/PackagingForm.tsx` - Material + color pickers

---

### Task 24: Enrich Usuarios module

**Modify existing components:**
- `components/UserTable.tsx` - Avatar, role badges, actions dropdown
- `components/UserForm.tsx` - Role assignment with Radix Checkbox
- `components/RoleBadge.tsx` - Color-coded role pills
- `pages/UserProfilePage.tsx` - Profile card with avatar

---

## Phase 5: Polish & Testing

### Task 25: Add loading states across all pages

**Files:** All page components in `src/modules/*/pages/*.tsx`

Replace any raw loading indicators with Skeleton components. Use AnimatedPage wrapper on every page. Add error boundaries per module.

---

### Task 26: Add responsive breakpoints review

**Files:** All component files

Audit every component for mobile responsiveness. Use Sheet component for mobile detail views. Ensure touch-friendly tap targets (min 44px).

---

### Task 27: Add micro-interactions

**Files:** Various components

- Button press: `active:scale-[0.98]` (already on Button)
- Card hover: `hover-lift` class
- Badge appear: `animate-scale-in`
- Toast slide-in: Framer Motion
- Tab switch: Animated underline
- Toggle: Spring animation on Switch
- Number changes: Animated counter (Framer Motion `useSpring`)

---

### Task 28: Run full test suite

```bash
npm run lint
npm run build
npm test
```

Fix any failures. Ensure 80%+ coverage on new components.

---

### Task 29: Final commit and cleanup

```bash
git add -A
git commit -m "feat: complete frontend redesign with shadcn/ui, animations, and enriched modules"
```

---

## Dependency Graph

```
Phase 1 (Tasks 1-3): Foundation
    ↓
Phase 2 (Tasks 4-9): Core UI Components
    ↓
Phase 3 (Tasks 10-13): Layout & Navigation
    ↓
Phase 4 (Tasks 14-24): Module Enrichment (can be parallelized)
    ↓
Phase 5 (Tasks 25-29): Polish & Testing
```

Tasks 14-24 are independent of each other and CAN be executed in parallel by multiple agents.

---

## Files Summary

| Phase | New Files | Modified Files |
|-------|-----------|---------------|
| 1. Foundation | 5 | 2 |
| 2. Core UI | 13 | 5 |
| 3. Layout | 0 | 4 |
| 4. Modules | ~30 | ~40 |
| 5. Polish | 0 | ~20 |
| **Total** | **~48** | **~71** |
