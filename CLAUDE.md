# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server on http://localhost:3000
pnpm build      # production build
pnpm start      # run production build
pnpm lint       # run ESLint
pnpm test       # run Vitest (unit tests)
pnpm test:ui    # run Vitest with browser UI
```

Tests use **Vitest** + **@testing-library/react** + jsdom. Config in `vitest.config.ts`. Setup file at `src/test/setup.ts` (imports `@testing-library/jest-dom`). Test files are co-located next to the component as `ComponentName.test.tsx`.

## Stack

- **Next.js 16** with the App Router (`src/app/`)
- **React 19**
- **TypeScript** — strict mode enabled
- **Tailwind CSS v4** — CSS-first configuration; no `tailwind.config.ts`. All design tokens are defined in `src/app/globals.css` via `@theme inline`.
- **shadcn/ui** — base components installed in `src/components/ui/` (do not modify these files directly; extend via wrapper components). Integrated via `@import "shadcn/tailwind.css"` in `globals.css`.
- **@base-ui/react** — installed as an alternative primitive library if needed
- **Zustand** — global state (planned for cart and session; not yet implemented)
- **lucide-react** — icon library
- **pnpm** as the package manager

## Path alias

`@/*` resolves to `./src/*` (configured in `tsconfig.json`).

## Architecture

```
src/
├── app/
│   ├── (public)/login/         # Login page — no sidebar
│   ├── (protected)/            # Protected routes — all share DashboardShell
│   │   ├── dashboard/          # /dashboard — KPI cards, chart, transactions
│   │   └── inventario/         # /inventario — product table with CRUD modals
│   ├── layout.tsx              # Root layout — loads Inter font, globals.css
│   ├── page.tsx                # Redirects → /login
│   └── globals.css             # Tailwind v4 @theme tokens + shadcn CSS vars
├── components/
│   ├── ui/                     # Atomic components — shadcn primitives + custom
│   │   ├── Badge.tsx           # Status/category badge
│   │   ├── KPICard.tsx         # Dashboard metric card
│   │   ├── PeriodFilter.tsx    # Period dropdown (Hoy / Ayer / Hace una semana)
│   │   ├── ProductAvatar.tsx   # Product image or category-icon fallback
│   │   ├── ConfirmModal.tsx    # Reusable destructive-action dialog
│   │   ├── Toast.tsx           # Temporary success/error notification
│   │   └── status-alert.tsx    # Custom alert (not shadcn)
│   ├── auth/                   # Auth-specific components (LoginForm)
│   ├── layout/
│   │   ├── DashboardShell.tsx  # Owns sidebar collapse state; wraps Sidebar + Topbar + <main>
│   │   ├── Sidebar.tsx         # Fixed sidebar with collapsible nav
│   │   ├── Topbar.tsx          # Top header with page title + UserMenu + bell icon
│   │   └── UserMenu.tsx        # Avatar dropdown (Perfil / Configuración / Cerrar sesión)
│   ├── dashboard/
│   │   ├── DashboardFilters.tsx
│   │   ├── SalesChart.tsx
│   │   └── RecentTransactions.tsx
│   └── inventory/
│       ├── InventoryContent.tsx  # Client orchestrator — owns modal + toast state
│       ├── InventoryFilters.tsx  # Search input + category tabs + "Agregar" button
│       ├── ProductTable.tsx      # Product rows with edit/delete actions
│       ├── ProductFormModal.tsx  # Add/edit product form in a dialog
│       └── RowActions.tsx        # Per-row edit and delete icon buttons
└── lib/
    ├── utils.ts                # cn() helper (clsx + tailwind-merge)
    └── mock-data.ts            # All mock data + types (Product, KpiData, etc.)
```

**Still planned:** `hooks/`, `store/` (Zustand), `types/`, and routes for `ventas/`, `configuracion/`.

Route groups: `(public)` renders without sidebar; `(protected)` wraps all protected routes in `DashboardShell`. No real backend — all data comes from `lib/mock-data.ts`.

### Sidebar collapse

`DashboardShell` initializes `collapsed` from `window.innerWidth < 1024` and syncs it with a `matchMedia` listener (no SSR). Width is set via inline style: `4rem` collapsed, `13rem` expanded — `<main>` matches with a `marginLeft` transition. No static Tailwind breakpoint classes are used; this is entirely JS-driven.

Custom dropdowns (`UserMenu`, `PeriodFilter`) follow the same pattern: local `open` state + `useEffect` to close on outside click.

### Inventory CRUD pattern

The inventory page is split into a Server Component (`inventario/page.tsx`) that filters `products` from `mock-data.ts` via URL search params, and a Client Component (`InventoryContent`) that owns all modal/toast state. When Zustand or a real API is added, `InventoryContent` is the integration point.

### Mock data

`lib/mock-data.ts` exports:
- `Product` interface + `ProductCategory` union type
- `products` array (12 items) + `LOW_STOCK_THRESHOLD = 8`
- `getDashboardData(period)` — returns `DashboardData` keyed by `"today" | "yesterday" | "week"`

## Design system

**Tailwind v4 token approach:** All CSS custom properties are declared inside `:root {}` in `globals.css`, then mapped to Tailwind color utilities inside `@theme inline {}`. Use Tailwind utility classes — never hardcode hex values in JSX/TSX.

**Color tokens:**

| Role | CSS var | Value |
|---|---|---|
| Brand accent / logo bg | `--brand` → `bg-brand` | `#6B5B95` |
| Sidebar bg | `--nav` → `bg-nav` | `#3A3D5C` |
| Primary buttons / active states | `--primary` → `bg-primary` | `#4A9CA6` |
| Page background | `--background` → `bg-background` | `#FAFAFB` |
| Alt background | `--secondary` → `bg-secondary` | `#EEF0F3` |
| Card / surface | `--card` → `bg-card` | `#FFFFFF` |
| Text primary | `--foreground` → `text-foreground` | `#2E2E38` |
| Text secondary | `--muted-foreground` → `text-muted-foreground` | `#7A7F8A` |
| Borders | `--border` → `border-border` | `#E2E5EA` |
| Success | `--success` → `text-success` / `bg-success` | `#5B9B7A` |
| Warning / low stock | `--warning` → `text-warning` / `bg-warning` | `#C9A24B` |
| Error / delete | `--danger` → `text-danger` / `bg-danger` | `#C45B5B` |

Note: `--destructive` (shadcn) and `--danger` (custom) both map to `#C45B5B`. Use `destructive` for shadcn component variants; use `danger` for custom components.

**Typography:** Inter (loaded in root layout). Scale: titles 20–28px semibold, subtitles 16–18px medium, body 14px regular, labels 12px.

**Spacing:** 8px base grid — use multiples: 8 / 16 / 24 / 32px.

**Shape:** border-radius 8–12px on cards, buttons, inputs (`rounded-lg` / `rounded-xl`). Soft, low-elevation shadows only.

**Tone:** Muted and desaturated. High contrast only on primary actions, totals, and alerts.

**Navigation items:** Dashboard, Inventario, Ventas, Configuración.

**Target viewports:** Laptop 1280–1440px (primary), Tablet 768–1024px. No mobile support.

## Atomic components

When implementing new features, always extract reusable UI elements as atomic components under `src/components/ui/`. A component is atomic if it can be used in more than one context (badges, avatars, inputs, specialized buttons, etc.). Section-specific components live in their own folder (`inventory/`, `dashboard/`, etc.).

## Language

All console communication and responses to the user must be in **Spanish**.

## Constraints

- No database connections or ORMs.
- No real API endpoints with business logic unless explicitly requested.
- No new libraries outside the agreed stack without justification.
- No over-engineering — start simple, grow as needed.
