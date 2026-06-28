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
- **Zustand** — global state; stores at `src/store/` (`authStore.ts` for auth, `cartStore.ts` for cart, `businessStore.ts` for business data + settings)
- **lucide-react** — icon library
- **pnpm** as the package manager

## Environment

Create `.env.local` in the project root with:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

No `.env.local` is checked into the repo. The default fallback in service files is `http://localhost:8080`.

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
│   ├── cartStore.ts            # Zustand cart store
│   └── businessStore.ts        # Zustand store: business (BusinessData) + settings (BusinessSettings)
├── services/
│   ├── authService.ts          # loginApi / refreshApi / logoutApi (call BFF route handlers)
│   ├── categoryService.ts      # fetchCategories / createCategory (call backend directly)
│   ├── productService.ts       # fetchProducts / createProduct / updateProduct / deleteProduct
│   ├── saleService.ts          # fetchSales / fetchTopProducts / createSale
│   └── businessService.ts      # fetchBusiness / fetchBusinessSettings / updateBusiness / updateBusinessSettings
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
- **Session restore on reload**: `AuthGuard` calls `refreshApi()` on mount; if the httpOnly cookie is valid, the backend returns a new token pair. After auth is confirmed, `AuthGuard` always fetches `GET /v1/business` and `GET /v1/business/settings` in parallel and stores them in `businessStore`. This runs on every page load/refresh (Zustand is in-memory, so state is wiped on reload). Children are not rendered until both requests resolve.
- **Authenticated requests**: use `fetchWithAuth(url, options)` from `src/lib/api.ts`. It attaches `Authorization: Bearer {token}`, and on 401 automatically refreshes (mutex prevents concurrent refresh calls) and retries the original request. When `options.body` is a `FormData` instance, `Content-Type` is omitted so the browser sets `multipart/form-data` with the correct boundary automatically.
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

`ventas/page.tsx` is a thin Server Component that renders `VentasContent` (client). `VentasContent` toggles between two tabs:

- **Punto de Venta**: two-panel layout — `OrderPanel` (fixed 420px left) + `ProductCatalog` (flex-1 right).
- **Listado de ventas**: `ListadoDeVentas` — paginated table of real sales from `GET /v1/sale`.

**`ProductCatalog`** fetches products from the backend with load-more pagination (12 per page, appends on "Ver más"). When no filters are active it uses `GET /v1/sale/top-products` (most-sold products); with any search/category filter active it switches to `GET /v1/product`. Both endpoints return `ProductPage`. The top-products endpoint may return a flat `ApiProduct[]` — `fetchTopProducts` normalizes this into a `ProductPage` object. The fetch effect accumulates results: `page === 1` replaces, higher pages append. Debounce and category chip clicks only reset `page` to 1 — they never clear `products[]` directly; the fetch effect handles replacement via the `page === 1` check to avoid race conditions.

**`OrderPanel`** → on checkout calls `createSale` (`POST /v1/sale`) with `{ discountAmount, paymentMethod, amountReceived, items: [{ productId, quantity }] }`. On success, passes `SaleResponse` to `SaleSuccessModal` and clears the cart.

Cart state lives in `src/store/cartStore.ts` (`useCartStore`): items (`CartItem[]` where `product: ApiProduct`), `discountAmount`, and actions (`addItem` / `removeItem` / `updateQuantity` / `clearCart` / `setDiscount`).

`CheckoutModal` supports two payment methods: **Efectivo** (shows received amount + change) and **Yape** (shows QR image, phone number, and account holder from `useBusinessStore().settings`; falls back to a placeholder if `yapeQrUrl` is null). It resets its own state on open via `useEffect([open])`. On successful payment `OrderPanel` passes `SaleResponse` to `SaleSuccessModal`, which renders a full ticket receipt (items, totals, ticket ID, datetime) with a print button (`window.print()`).

**`ListadoDeVentas`** fetches from `GET /v1/sale` with filters: `ticketCode`, `paymentMethod`, `status`, and a time period (`from` / `to`). Period dates are computed in Lima timezone (America/Lima, UTC-5) and sent as full UTC datetime strings **without** a timezone suffix (e.g. `"2026-06-27T05:00:00.000"` for midnight Lima). This is required because the backend stores timestamps in UTC with no DST offset.

### Configuracion

`ConfiguracionContent` has three tabs, each independent:

- **Perfil** — avatar + nombre completo + rol (read from `useAuthStore`). No backend endpoint yet; local state only.
- **Información del negocio** — nombre, RUC, teléfono, dirección. Initialized from `useBusinessStore().business`. Save calls `PATCH /v1/business` via `updateBusiness()` and updates the store with the response.
- **Configuración** — Yape (número, titular, QR image) + impresión. Initialized from `useBusinessStore().settings`. Save calls `PATCH /v1/business/settings` via `updateBusinessSettings()` as `multipart/form-data` and updates the store. The QR image file is tracked as a `File` object in local state (`qrFile`); a `blob:` URL is kept separately for preview only. If no new file was selected, `file` is `null` and the backend preserves the existing QR.

**`businessService.ts`** exports: `BusinessData`, `BusinessSettings`, `UpdateBusinessInput`, `UpdateBusinessSettingsInput`, `fetchBusiness()`, `fetchBusinessSettings()`, `updateBusiness(input)`, `updateBusinessSettings(input)`. `updateBusiness` uses JSON; `updateBusinessSettings` uses `FormData` (field `file` for the QR image, remaining fields as strings). All use `fetchWithAuth`.

**`businessStore.ts`** (`useBusinessStore`): `business: BusinessData | null`, `settings: BusinessSettings | null`, `setBusiness`, `setSettings`, `clearBusiness` (clears both). Populated by `AuthGuard` on every page load.

### Mock data

`lib/mock-data.ts` exports:
- `Product` interface + `ProductCategory` union type + `products` array (12 items) + `LOW_STOCK_THRESHOLD = 8`
- `getDashboardData(period)` — returns `DashboardData` keyed by `"today" | "yesterday" | "week"` (used by the Dashboard page)
- `Sale` / `SaleItem` / `SaleMethod` types + `salesData` are defined here but are **not used** by Ventas — Ventas fetches real data from the backend

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

**`DataTable<T>`** (`src/components/ui/DataTable.tsx`) — generic paginated table. Define columns via `Column<T>[]` (each with `header`, `cell`, optional `headerClassName`, optional `skeleton`, optional `cellClassName` as string or `(row: T) => string`). Required props: `data`, `keyExtractor: (row: T) => string`, `page` (1-based), `pageSize`, `pageSizeOptions`, `totalPages`, `totalElements`, `onPageChange`, `onPageSizeChange`. Optional: `itemLabel` (`{ singular, plural }`), `footerExtra`, `isLoading`, `skeletonRows`, `emptyMessage`. Use `ProductTable` as a reference wrapper. The trailing comma in `DataTable<T,>` is required to disambiguate from JSX.

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
