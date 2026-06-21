# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server on http://localhost:3000
pnpm build      # production build
pnpm start      # run production build
pnpm lint       # run ESLint
```

No test runner is configured yet.

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
│   ├── (auth)/login/       # Login page — no sidebar
│   ├── (dashboard)/        # Protected routes — all share sidebar layout
│   │   ├── ventas/         # Main POS screen (planned)
│   │   ├── productos/      # Products (planned)
│   │   ├── inventario/     # Inventory (planned)
│   │   └── reportes/       # Reports (planned)
│   ├── layout.tsx          # Root layout — loads Inter font, globals.css
│   ├── page.tsx            # Redirects → /login
│   └── globals.css         # Tailwind v4 @theme tokens + shadcn CSS vars
├── components/
│   ├── ui/                 # shadcn/ui primitives — do not edit directly
│   ├── auth/               # Auth-specific components (LoginForm)
│   └── layout/             # Sidebar
└── lib/
    └── utils.ts            # cn() helper (clsx + tailwind-merge)
```

**Planned but not yet created:** `hooks/`, `store/` (Zustand), `lib/mock-data.ts`, `types/`.

Route groups: `(auth)` renders without sidebar; `(dashboard)` wraps all protected routes in the shared shell (sidebar fixed at left edge). No real backend — all data will come from `lib/mock-data.ts`.

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

**Navigation:** Icon-only sidebar at `w-14`; expands to `w-20` with labels at `xl:` breakpoint. Nav items: Ventas, Productos, Inventario, Reportes. The `(dashboard)/layout.tsx` offsets `<main>` with `ml-14 xl:ml-20`.

**Target viewports:** Laptop 1280–1440px (primary), Tablet 768–1024px. No mobile support.

## Constraints

- No database connections or ORMs.
- No real API endpoints with business logic unless explicitly requested.
- No new libraries outside the agreed stack without justification.
- No over-engineering — start simple, grow as needed.
