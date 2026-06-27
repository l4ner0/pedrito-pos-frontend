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
pnpm test -- Badge   # run tests matching a pattern (filter by filename or test name)
```

Tests use **Vitest** + **@testing-library/react** + jsdom. Config in `vitest.config.ts`. Setup file at `src/test/setup.ts` (imports `@testing-library/jest-dom`). Test files are co-located next to the component as `ComponentName.test.tsx`. Existing tests: `Badge`, `ProductAvatar`, `KPICard`, `StatusAlert`, `PeriodFilter`.

## Stack

- **Next.js 16** with the App Router (`src/app/`)
- **React 19**
- **TypeScript** — strict mode enabled
- **Tailwind CSS v4** — CSS-first configuration; no `tailwind.config.ts`. All design tokens are defined in `src/app/globals.css` via `@theme inline`.
- **shadcn/ui** — primitives (`button.tsx`, `input.tsx`, etc.) installed in `src/components/ui/`. Do not modify shadcn files directly; extend via wrapper components. Custom atomic components also live in the same folder alongside the shadcn primitives. Integrated via `@import "shadcn/tailwind.css"` in `globals.css`.
- **@base-ui/react** — installed as an alternative primitive library if needed
- **Zustand** — global state; stores at `src/store/` (`authStore.ts` for auth, `cartStore.ts` for cart)
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
│   │   ├── inventario/         # /inventario — product table with CRUD modals
│   │   ├── ventas/             # /ventas — POS and sales history (two tabs)
│   │   └── configuracion/      # /configuracion — user/business settings form
│   ├── layout.tsx              # Root layout — loads Inter font, globals.css
│   ├── page.tsx                # Redirects → /login
│   └── globals.css             # Tailwind v4 @theme tokens + shadcn CSS vars
├── components/
│   ├── ui/                     # Atomic components — shadcn primitives + custom
│   ├── auth/                   # LoginForm
│   ├── layout/                 # DashboardShell, Sidebar, Topbar, UserMenu
│   ├── dashboard/              # DashboardFilters, SalesChart, RecentTransactions
│   ├── inventory/              # InventoryContent, ProductTable, ProductFormModal, etc.
│   ├── ventas/                 # VentasContent, PuntoDeVenta, OrderPanel, etc.
│   └── configuracion/          # ConfiguracionContent
├── store/
│   ├── authStore.ts            # Zustand auth store (in-memory: accessToken + user)
│   └── cartStore.ts            # Zustand cart store
├── services/
│   ├── authService.ts          # loginApi / refreshApi / logoutApi (call BFF route handlers)
│   ├── categoryService.ts      # fetchCategories / createCategory (call backend directly)
│   └── productService.ts       # fetchProducts / createProduct / updateProduct / deleteProduct
└── lib/
    ├── api.ts                  # fetchWithAuth — attaches Bearer token, handles 401 refresh+retry
    ├── utils.ts                # cn() helper (clsx + tailwind-merge)
    └── mock-data.ts            # Mock data + types (products, sales, dashboard)
```

Route groups: `(public)` renders without sidebar; `(protected)` wraps all protected routes in `DashboardShell` via `AuthGuard`.

### Authentication (BFF pattern)

The backend runs at `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`). Auth uses a BFF pattern — Next.js route handlers in `src/app/api/auth/` proxy login/refresh/logout to the backend and manage the `refreshToken` httpOnly cookie (never exposed to JS). The `accessToken` lives only in Zustand memory (`authStore`).

- **User roles**: `UserRole = "ADMIN" | "CASHIER"` (exported from `authStore.ts`). Available in `useAuthStore().user.role` after login.
- **Login flow**: `LoginForm` → `loginApi(username, password)` → `/api/auth/login` (route handler) → backend → sets httpOnly cookie, returns `accessToken + user` to client → `authStore.setAuth()`
- **Session restore on reload**: `AuthGuard` calls `refreshApi()` on mount; if the httpOnly cookie is valid, the backend returns a new token pair
- **Authenticated requests**: use `fetchWithAuth(url, options)` from `src/lib/api.ts`. It attaches `Authorization: Bearer {token}`, and on 401 automatically refreshes (mutex prevents concurrent refresh calls) and retries the original request
- **Route handlers vs direct calls**: route handlers are only for auth (need to touch httpOnly cookies). All other backend calls go direct from the client using `fetchWithAuth` with `NEXT_PUBLIC_API_URL`

### Sidebar collapse

`DashboardShell` initializes `collapsed` from `window.innerWidth < 1024` and syncs it with a `matchMedia` listener (no SSR). Width is set via inline style: `4rem` collapsed, `13rem` expanded — `<main>` matches with a `marginLeft` transition. No static Tailwind breakpoint classes are used; this is entirely JS-driven.

Custom dropdowns (`UserMenu`, `PeriodFilter`) follow the same pattern: local `open` state + `useEffect` to close on outside click.

### Inventory CRUD pattern

`inventario/page.tsx` is a thin Server Component that wraps `InventoryContent` (client) in `<Suspense>`. All state, fetching, and modal logic lives in `InventoryContent`.

**URL-driven state:** `q`, `categoria`, `page` (1-based, default 1), and `size` (default 10) are read from search params via `useSearchParams`. `updateParams()` calls `router.replace()` to update them. Filters reset `page` to null (= 1) on change.

**Data flow:**
- Categories fetched once on mount from `GET /v1/categories`, stored in state, and memoized into `categoryMap: Record<id, name>` and `categoryOptions` for the filter dropdown.
- Products fetched from `GET /v1/product?page=&size=` (1-based) on `[page, pageSize, refreshKey]`. Uses `AbortController` to cancel in-flight requests on re-render.
- Client-side filtering (`q` and `categoria`) is applied over the current page's data after fetch.
- `refreshKey` (incremented in `handleFormSuccess` and `handleDelete`) triggers a re-fetch after any mutation.

**`ProductFormModal`** receives `product: ApiProduct | null` and `categoryMap`. On open it fetches fresh categories from the backend. For create: validates `stock >= lowStockThreshold`, resolves `categoryId` from the categories list, calls `POST /v1/product`. For edit: skips the stock validation, calls `PATCH /v1/product/:id`. Inline category creation calls `POST /v1/categories` and adds the result to local state.

**`productService.ts`** exports `ApiProduct`, `ProductPage`, `CreateProductInput`, `UpdateProductInput` and: `fetchProducts(page, size, signal?)`, `createProduct(input)`, `updateProduct(id, input)`, `deleteProduct(id)`. All use `fetchWithAuth`.

**Toast state** in `InventoryContent` uses `toast: { message: string; variant: "success" | "error" } | null` (not a plain string) to support error toasts on failed deletes.

### Ventas / POS architecture

`ventas/page.tsx` is a Server Component that passes the full `products` array to `VentasContent` (client). `VentasContent` toggles between two tabs:

- **Punto de Venta**: two-panel layout — `OrderPanel` (fixed 420px left) + `ProductCatalog` (flex-1 right). Adding a product calls `useCartStore().addItem()`.
- **Listado de ventas**: `ListadoDeVentas` shows sales from `salesData` with a `SaleDetailModal` for per-row detail.

Cart state lives in `src/store/cartStore.ts` (`useCartStore`): items, discountAmount, and actions (addItem / removeItem / updateQuantity / clearCart / setDiscount). `OrderPanel` owns the `CheckoutModal` and the post-payment `SaleSuccessModal`.

`CheckoutModal` supports two payment methods: **Efectivo** (shows received amount + change) and **Yape** (shows QR placeholder). It resets its own state on open via `useEffect([open])`. On successful payment it passes a `SaleSuccessData` object to `SaleSuccessModal`, which renders a full ticket receipt (items, totals, ticket ID, datetime) with a print button (`window.print()`).

### Configuracion

`ConfiguracionContent` is a pure client-side form with local state (no Zustand, no persistence). Sections: user profile (with avatar file upload), business info, payment methods (Yape number + QR image upload), and print settings.

### Mock data

`lib/mock-data.ts` exports:
- `Product` interface + `ProductCategory` union type + `products` array (12 items) + `LOW_STOCK_THRESHOLD = 8`
- `getDashboardData(period)` — returns `DashboardData` keyed by `"today" | "yesterday" | "week"`
- `Sale` interface + `SaleItem` + `SaleMethod` union (`"Efectivo" | "Tarjeta" | "Yape"`)
- `salesData` — `Record<"today" | "week" | "month", Sale[]>` (cumulative: week includes today, month includes week)

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

When implementing new features, always extract reusable UI elements as atomic components under `src/components/ui/`. A component is atomic if it can be used in more than one context (badges, avatars, inputs, specialized buttons, etc.). Section-specific components live in their own folder (`inventory/`, `ventas/`, etc.).

**`DataTable<T>`** (`src/components/ui/DataTable.tsx`) — generic paginated table. Define columns via `Column<T>[]` (each with `header`, `cell`, optional `skeleton`, optional `cellClassName` as string or `(row: T) => string`). Props include `page` (1-based), `pageSize`, `pageSizeOptions`, `totalPages`, `totalElements`, `itemLabel`, `footerExtra`, `isLoading`, `skeletonRows`. Use `ProductTable` as a reference wrapper. The trailing comma in `DataTable<T,>` is required to disambiguate from JSX.

**`Combobox`** (`src/components/ui/Combobox.tsx`) — searchable select with optional inline creation. Pass `onCreateNew` to enable a "create new" row when no option matches the typed text; `createNewLabel` customizes the label. Uses the same outside-click-to-close pattern as other custom dropdowns.

**`Toast`** (`src/components/ui/Toast.tsx`) — fixed top-right notification. Props: `open`, `variant` (`"success" | "warning" | "error"`), `message`, `duration` (default 3000 ms), `onClose`. Auto-dismisses via a `setTimeout`. When multiple variants are needed, drive with `toast: { message, variant } | null` and pass `open={toast !== null}`.

**`ConfirmModal`** (`src/components/ui/ConfirmModal.tsx`) — centered dialog for destructive actions. Props: `open`, `variant` (`"success" | "warning" | "error"`), `title`, `description?`, `confirmLabel?`, `cancelLabel?`, `icon?`, `persistent?` (default `true` — blocks backdrop click), `onConfirm`, `onClose`. Each variant ships a default icon; pass `icon` to override.

**`ProductAvatar`** (`src/components/ui/ProductAvatar.tsx`) — product image with a `Package` icon fallback. Sizes: `"sm" | "md" | "lg"`.

**`ProductCard`** (`src/components/ui/ProductCard.tsx`) — POS catalog tile. Disabled (`opacity-50`, non-clickable) when `stock === 0`. Shows warning color and "Stock bajo" label when `0 < stock < LOW_STOCK_THRESHOLD`.

**`Badge`** (`src/components/ui/Badge.tsx`) — pill label. `variant`: `"success" | "warning" | "danger" | "purple" | "blue" | "teal" | "lime" | "amber" | "emerald" | "default"`. Used for category tags, payment method labels, stock status.

**`StatusAlert`** (`src/components/ui/status-alert.tsx`) — inline banner with icon. Props: `variant` (`"success" | "warning" | "error"`), `message: React.ReactNode`. Renders with `role="alert"`. Use for form-level errors and inline feedback (not floating notifications — use `Toast` for those).

## Language

All console communication and responses to the user must be in **Spanish**.

## Constraints

- No database connections or ORMs.
- Next.js route handlers (`src/app/api/`) are only for auth (BFF/httpOnly cookie management). Other API calls go direct to the backend using `fetchWithAuth`.
- No real API endpoints with business logic unless explicitly requested.
- No new libraries outside the agreed stack without justification.
- No over-engineering — start simple, grow as needed.
