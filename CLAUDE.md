# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (uses webpack: next dev --webpack)
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm format       # Prettier format all JS/TS/TSX/HTML/CSS files
```

## Architecture

This is a **Next.js 16 (App Router)** wedding invitation website with a visual admin panel.

### Core Data Flow

1. **Config storage**: All templates are stored as JSON in `configs/app-config_with_versions.json`. Each template has an `id`, `title`, `isActive` flag, and `content: IConfigApp`.
2. **API layer**: `app/api/layouts/route.ts` reads/writes that JSON file. `GET ?active=true` returns the active template (public); all other operations require admin access.
3. **Page render**: `app/page.tsx` fetches the active template and passes its `content` to `<InviteBuilder>`.
4. **InviteBuilder** (`components/shared/InviteBuilder.tsx`): Renders the page by iterating `config.layout[]` and switching on `contentType` to render the appropriate section component.

### Config Shape (`IConfigApp`)

```
{
  shared: { date, wifeName, husbandName, textDate, backgroundImage? }
  header?: { pattern: "stacked" | "minimal" | "initials" | "fullnames", decorations? }
  layout: ILayout[]   // ordered array of sections
  footer: IFooter
}
```

Each `ILayout` has:
- `contentType`: `"PLACE" | "TIMINGS" | "DETAILS" | "DRESSCODE" | "FORM" | "CALENDAR" | "FRAME"`
- `content`: type-specific data (see `types/blocks/`)
- `decorations?` / `mobileDecorations?`: array of `ISectionDecorations` for overlay images

### Section Components

Each section lives in `components/<SectionName>/`:
- `PLACE` → `components/Place/` — supports `MAP` and `CENTERED` types, uses Leaflet
- `TIMINGS` → `components/EventPlan/` — supports `TIME_LINE`, `CARD`, `ROAD` layouts
- `DETAILS` → `components/shared/Details.tsx`
- `DRESSCODE` → `components/shared/DressCode.tsx`
- `FORM` → `components/shared/Form.tsx` — submits to `/api/sheets` (Google Sheets integration)
- `CALENDAR` → `components/shared/Calendar.tsx`
- `FRAME` → `components/shared/PhotoFrame.tsx`

### Decorations System

`SectionWrapper` (`components/ui/SectionWrapper.tsx`) renders decorative overlay images via React portal onto `document.body`. It scales images relative to a 1920px reference width and picks the right decoration set based on breakpoints:
- `> 1280px` → `decorations`
- `540–1280px` → `laptopDecorations` (fallback to `decorations`)
- `< 540px` → `mobileDecorations`

Desktop mode applies overlap-correction to keep decorations outside the section content area.

### Admin Panel

`/admin` → `components/AdminPanel/` — disabled when `DISABLE_ADMIN=true` env var is set.

The admin is a drag-and-drop canvas (dnd-kit) where blocks can be dragged from the palette onto the canvas, reordered, and edited via a right-side drawer. Saves to `/api/layouts` via POST.

### Environment Variables

- `DISABLE_ADMIN=true` — hides `/admin` page and blocks admin API endpoints
- `SPREAD_SHEET_ID` — Google Sheets ID for form responses
- `GOOGLE_SERVICE_ACCOUNT_*` fields — service account credentials for Sheets API
- `NEXT_PUBLIC_API_URL` — API base URL (defaults to `/api`)

### Key Conventions

- UI primitives are in `components/ui/` (shadcn-style, built on Radix UI)
- All types for block configs live in `types/blocks/`
- Images/assets go in `public/`; decoration images are in `public/decorations/`
- `lib/api.ts` exports a singleton `api` (ApiClient) for fetch calls
- `lib/auth.ts` exports `checkAdminAccess()` used by all admin API routes
