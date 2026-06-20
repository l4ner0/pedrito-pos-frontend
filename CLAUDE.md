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
- **Tailwind CSS** — utility-first styling; design tokens live in `tailwind.config.ts`
- **shadcn/ui** — base components installed in `src/components/ui/` (do not modify these files directly; extend via wrapper components)
- **Zustand** — global state for cart and simulated session
- **lucide-react** — icon library
- **pnpm** as the package manager

## Path alias

`@/*` resolves to `./src/*` (configured in `tsconfig.json` and respected by Next.js).

## Architecture

```
src/
├── app/
│   ├── (auth)/login/       # Login page — no sidebar
│   └── (dashboard)/        # Protected routes — all share sidebar layout
│       ├── ventas/         # Main POS screen
│       ├── productos/
│       ├── inventario/
│       └── reportes/
├── components/
│   ├── ui/                 # shadcn/ui primitives — do not edit directly
│   ├── pos/                # POS-specific: Cart, ProductGrid, etc.
│   └── layout/             # Sidebar, Header, Nav
├── lib/
│   ├── utils.ts            # Helpers: currency formatting, dates
│   └── mock-data.ts        # Simulated data (no real backend)
├── hooks/                  # Custom hooks (useCart, etc.)
├── store/                  # Zustand stores (cart-store.ts)
└── types/                  # Shared TypeScript types (index.ts)
```

Route groups: `(auth)` renders without sidebar; `(dashboard)` wraps all protected routes in the shared shell layout (sidebar + header). No real backend — all data comes from `lib/mock-data.ts`.

## Constraints

- No database connections or ORMs.
- No real API endpoints with business logic unless explicitly requested.
- No new libraries outside the agreed stack without justification.
- No over-engineering — start simple, grow as needed.

## Product context

POS system for a minimarket, used internally by cashiers and administrators. Priority: operational speed, visual clarity, and reliable sales/inventory tracking.

**Target viewports:**
- Laptop: 1280–1440px — side-by-side panels, fixed lateral navigation
- Tablet: 768–1024px — same areas reorganized, collapsible nav (icon strip or hamburger), comfortable touch targets

When building UI, design for laptop first then adapt for tablet. No mobile (< 768px) support required.

## Design system

**Tone:** muted, desaturated, professional. High contrast only on primary actions, totals, and alerts — nothing vivid.

**Color tokens:**

| Role | Token name | Value |
|---|---|---|
| Brand accent / header bg | `--color-brand` | `#6B5B95` |
| Top bar / nav bg | `--color-nav` | `#3A3D5C` |
| Primary buttons / active states | `--color-primary` | `#4A9CA6` |
| Content bg (main) | `--color-bg` | `#FAFAFB` |
| Content bg (alt) | `--color-bg-alt` | `#EEF0F3` |
| Card / surface | `--color-surface` | `#FFFFFF` |
| Text primary | `--color-text` | `#2E2E38` |
| Text secondary | `--color-text-muted` | `#7A7F8A` |
| Borders / dividers | `--color-border` | `#E2E5EA` |
| Success | `--color-success` | `#5B9B7A` |
| Warning / low stock | `--color-warning` | `#C9A24B` |
| Error / delete | `--color-error` | `#C45B5B` |

Color tokens are registered in `tailwind.config.ts` under `theme.extend.colors` (mapped to CSS custom properties in `globals.css` so shadcn/ui can consume them). Use Tailwind utility classes — never hardcode hex values in JSX/TSX.

**Typography:** Inter (primary choice). Scale: titles 20–28px semibold, subtitles 16–18px medium, body 14px regular, labels 12px.

**Spacing:** 8px base grid — use multiples: 8 / 16 / 24 / 32px. Generous whitespace between blocks.

**Shape:** border-radius 8–12px on cards, buttons, and inputs. Shadows soft and low-elevation only — never hard/sharp.

**Buttons (four variants):**
- Primary: teal fill (`--color-primary`), white text
- Secondary: gray border (`--color-border`) + text
- Tertiary: text-only, no border/background
- Destructive: muted red (`--color-error`)
- All variants must define hover, active, and disabled states.

**Icons:** linear, minimalist, consistent stroke weight (e.g. Lucide or Phosphor).

**Navigation:** sidebar with circular icon + label below each item. Modules: Dashboard, Inventario, Ventas, Configuración. Fixed on laptop, collapsible (icon-only or hamburger) on tablet. The Ventas module has internal sub-navigation tabs: "Punto de Venta" and "Listado de Ventas".

**Components:**
- `src/components/ui/` — shadcn/ui primitives (Button, Input, Select, Dialog, Table, Badge, etc.). Do not edit these files directly.
- `src/components/` — app-specific components built on top of shadcn/ui primitives.
