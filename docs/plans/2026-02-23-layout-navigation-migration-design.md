# Layout & Navigation Migration Design

**Date**: 2026-02-23
**Status**: Approved
**Goal**: Migrate Demeter 1.0's visual identity to Demeter 2.0 while preserving multi-tenant capability

---

## Overview

This design covers the Layout/Navigation module migration - the foundation for all other modules. The Cultivos tenant will visually match Demeter 1.0 exactly, while the multi-tenant system remains flexible for other tenants.

---

## 1. Theme & Color System

### Cultivos Tenant Theme

```typescript
{
  primary: '#40a04a',      // Main green (sidebar active, buttons)
  secondary: '#17cf17',    // Bright green (accents, gradients)
  accent: '#22c55e',       // Soft green (hover states)
  background: '#f5f7fb',   // Light gray-blue background
  appName: 'DemeterIA',
  logoUrl: null,           // Uses emoji-based logo component
}
```

### Additional CSS Tokens (index.css)

```css
:root {
  --text-primary: #1f2933;
  --text-secondary: #55637a;
  --text-soft: #7b889e;
  --border: #d9e2ec;
  --border-demeter: #dee3de;
  --surface-muted: #f0f4ff;
  --shadow-soft: 0 10px 30px rgba(15, 23, 42, 0.12);
  --radius-lg: 16px;
}
```

### TenantTheme.tsx Enhancement

- Add `--color-secondary` CSS variable
- Add `--secondary-rgb` for opacity-based effects (e.g., `rgba(23, 207, 23, 0.1)`)

---

## 2. Icon System (Material Symbols)

### Font Import (index.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

### MaterialIcon Component

**File**: `src/core/components/ui/MaterialIcon.tsx`

```typescript
interface MaterialIconProps {
  name: string
  size?: number
  className?: string
}

export function MaterialIcon({ name, size = 20, className }: MaterialIconProps) {
  return (
    <span
      className={cn('material-symbols-outlined', className)}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  )
}
```

### Icon Mapping (modules.ts)

| Module | Current (Lucide) | New (Material Symbol) |
|--------|------------------|----------------------|
| Mapa/Dashboard | Package | `map` |
| Cultivo | - | `grass` |
| Precios | Tag | `price_change` |
| Fotos | Camera | `photo_library` |
| Analytics | BarChart3 | `bar_chart` |
| Chatbot | MessageSquare | `chat` |
| Usuarios | Users | `account_circle` |
| Ubicaciones | MapPin | `location_on` |
| Inventario | Package | `inventory_2` |
| Productos | ShoppingCart | `shopping_cart` |
| Ventas | DollarSign | `payments` |
| Costos | BarChart3 | `analytics` |
| Empaquetado | Box | `package_2` |

---

## 3. Logo Component

**File**: `src/core/components/ui/DemeterLogo.tsx`

```typescript
interface DemeterLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  collapsed?: boolean
}

export function DemeterLogo({ size = 'md', showText = true, collapsed = false }: DemeterLogoProps)
```

### Sizes

| Size | Icon | Title Font | Subtitle Font |
|------|------|------------|---------------|
| sm | 32px | 16px | 11px |
| md | 40px | 16px | 14px |
| lg | 48px | 20px | 14px |

### Structure

- Green circle (`bg-primary`) with 🌱 emoji
- "DemeterIA" title in `--text-primary`
- "Panel Admin" subtitle in `--text-soft`
- Text hidden when `collapsed=true`

### Tenant Flexibility

```typescript
if (tenantConfig.theme.logoUrl) {
  return <img src={logoUrl} />
} else if (tenantConfig.industry === Industry.CULTIVOS) {
  return <DemeterLogo />
} else {
  return <span className="gradient-text">{appName}</span>
}
```

---

## 4. Sidebar Component

### Dimensions

- Collapsed: `72px`
- Expanded: `256px`
- Behavior: Expand on hover (remove manual toggle button)

### Styling

```css
/* Container */
background: #ffffff;
border-right: 1px solid #dee3de;

/* Nav items */
padding: 12px;
border-radius: 8px;
font-size: 14px;
font-weight: 500;
gap: 12px; /* icon to text */

/* Active state */
background: rgba(64, 160, 74, 0.2);
font-weight: bold;

/* Hover state */
background: rgba(64, 160, 74, 0.1);

/* Transitions */
width: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
opacity (text): 0.15s cubic-bezier(0.4, 0, 1, 1);
```

### Structure

1. Logo at top (with collapse animation)
2. Main navigation items
3. User profile link at bottom ("Mi Perfil" with `account_circle`)

---

## 5. Header Component

### Simplified Structure (Logo in Sidebar)

```
[Mobile Menu Button] [Spacer] [Theme Toggle] [Notifications] [User Avatar]
```

### Styling

```css
background: rgba(246, 248, 246, 0.95);
backdrop-filter: blur(10px);
border-bottom: 1px solid rgba(229, 231, 235, 0.5);
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
height: 64px;
```

### Changes from Current

- Remove logo (now in sidebar)
- Remove breadcrumb
- Green hover on notification: `rgba(23, 207, 23, 0.1)`
- User avatar green gradient ring

### Mobile Header

- Fixed at top
- Small logo (32px) + "DemeterIA" + "Panel Admin"
- Hamburger menu button

---

## 6. Mobile Navigation

### Bottom Nav Bar (Keep & Adapt)

```css
background: #ffffff;
border-top: 1px solid #dee3de;
box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
```

### Nav Items

- Active: green bar indicator + `#40a04a` text
- Inactive: `#6b806d` text
- Icons: Material Symbols, 24px

### Priority Items (4 visible)

1. Mapa (`map`)
2. Cultivo (`grass`)
3. Precios (`price_change`)
4. Analytics (`bar_chart`)

### Overflow ("More" sheet)

Fotos, Chatbot, Usuarios, Ubicaciones, etc.

---

## Files to Create/Modify

### New Files

- `src/core/components/ui/MaterialIcon.tsx`
- `src/core/components/ui/DemeterLogo.tsx`

### Modified Files

- `src/index.css` - Add Material Symbols font, Demeter tokens
- `src/core/tenant/TenantTheme.tsx` - Add secondary color variable
- `src/core/tenant/TenantProvider.tsx` - Update Cultivos theme values
- `src/core/config/modules.ts` - Replace Lucide with Material Symbols
- `src/core/layout/Sidebar.tsx` - Demeter 1.0 styling, add logo
- `src/core/layout/Header.tsx` - Simplify, remove logo
- `src/core/layout/MobileNav.tsx` - Demeter 1.0 styling

---

## Implementation Order

1. **Theme/CSS** - Add tokens and font imports
2. **MaterialIcon** - Create component
3. **DemeterLogo** - Create component
4. **TenantProvider** - Update Cultivos theme values
5. **modules.ts** - Switch to Material Symbols icons
6. **Sidebar** - Apply Demeter styling, integrate logo
7. **Header** - Simplify, apply styling
8. **MobileNav** - Apply styling
9. **Testing** - Visual verification

---

## Success Criteria

- [ ] Cultivos tenant visually matches Demeter 1.0
- [ ] Other tenants can still use custom themes
- [ ] Sidebar expand/collapse works smoothly
- [ ] Mobile navigation is intuitive
- [ ] No regressions in existing functionality
