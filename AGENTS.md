# AGENTS.md — Kinclong (car wash SaaS)

Mobile-first car wash management app: Next.js 16 / React 19 / Tailwind v4 / Drizzle + Postgres, shadcn-style UI kit on **@base-ui/react** (not Radix). Roles: admin / staff / customer.

## First: this Next.js is not a version you may know

<!-- BEGIN:nextjs-agent-rules -->
### This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands (Windows environment!)

- `npm` is **blocked in PowerShell** (execution policy on `npm.ps1`). Use `cmd /c "npm run build"` and `cmd /c "npm run dev"`. `npx` works fine in PowerShell.
- `cmd /c "npm run build"` is also the **typecheck** (next build runs tsc). Treat it as the only verification gate — there is no test suite.
- `npm run lint` reports **~100 pre-existing** `@typescript-eslint/no-explicit-any` errors (API routes + client pages) and some `<img>` warnings. Don't mass-fix them, but don't add new ones either.
- DB: `npx drizzle-kit push` (fast) or `npx drizzle-kit generate` + `drizzle-kit migrate` (migrations in `lib/db/migrations/`).
- `npm run db:seed` **deletes every row in every table** before reseeding — never run against real data.
- `DATABASE_URL` lives in `.env` (checked in). Next loads it automatically; the seed script loads dotenv itself.

## Dev-loop tip

- Auth is a plain cookie: `kinclong_session_id` contains the raw `users.id` (integer, serial PK). Send it with any HTTP client to render authenticated pages server-side. Seeded logins (password `pass-123` for all): admin `admin@mail.com`; staff `ali@mail.com` / `omar@mail.com`; customer `fatima@mail.com` / `ahmed@mail.com`.

## Architecture

- **All DB/business logic lives in `services/*.ts`.** UI never touches `db`. Only `services/auth.ts` is `"use server"` (actions use a session cookie; there is no NextAuth).
- Every `app/dashboard/<module>/` follows the same split: `page.tsx` = server component (calls `requireAuth()`, redirects on wrong role, fetches data, passes props) → `client-page.tsx` = client component that mutates via `fetch("/api/<module>")` then calls `router.refresh()`. Follow this pattern.
- Role guards are duplicated inside each server `page.tsx` via `redirect()`. They are the only route protection — don't remove them when editing pages.
- File uploads: `POST /api/upload` → `public/uploads/`, referenced by string URL. Rendered with plain `<img>` (not `next/image`) everywhere except the landing hero.

## Design system (built deliberately — do not drift)

- All palette/typography tokens live in `app/globals.css` (`:root` + `.dark`): primary orange `#E25C1C`, cream background `#F8F5F0`, charcoal foreground `#201914`. Always use tokens (`bg-primary`, `text-muted-foreground`, `shadow-card`, `--chart-1..5`); never raw hexes in components.
- Font is Inter, wired via `--font-inter` in `app/layout.tsx` and `--font-sans` in `globals.css`.
- Charts are hand-built SVG in `components/charts.tsx` (`DonutChart`, `BarChart`, `RingProgress`). This is intentional (zero deps) — don't add a charting library.
- Shared primitives: `PageHeader` (`components/page-header.tsx`), `StatCard`, `EmptyState`, `StatusBadge`, plus `components/ui/*` (shadcn v4/@base-ui: state attrs are `data-open` / `data-active`, not `data-state`).
- **RSC gotcha:** sidebar nav icons cross the server→client boundary as string names, resolved through a registry in `components/sidebar-nav.tsx`. Passing lucide components as props from a server component to a client component throws "Functions cannot be passed directly to Client Components" at runtime (build passes; pages 500).

## Known quirks (pre-existing — preserve unless deliberately fixing)

- `getPendingTasks()` in `services/washes.ts` actually returns **contract** rows: its `id` is `contractsTable.id` and its `type` is the package *name* (not inside/outside). The tasks UI passes that `id` to `submitWashEvidence` → `completeWashTask`, which looks it up as `washes.id`. Ids only line up because of seed ordering — don't "clean this up" casually.
- Wash evidence with `imageUrl === "x"` is a legacy placeholder; `my-contracts` guards `wash.imageUrl && wash.imageUrl !== "x"`.
- Staff created by `services/staff.ts` get the default password `pass-123` (bcrypt-hashed) unless `password` is supplied (the column is NOT NULL — insert breaks without it).
- Root `ts_errors.txt`, `tsc-output.txt`, `tsconfig.tsbuildinfo` are stale scratch outputs — ignore them.
- `mhz/` is the owner's session log + notes + a DB backup — not app code; don't refactor inside it.
- `README.md` and `mhz/ai.md` describe an older green-themed PRD (Dhs-era pricing); `lib/db/seed.ts` also seeds `settings.others.primaryColor` as the old green `#2ED573`. The current design system in `app/globals.css` wins on conflict — don't restore the green theme from those sources.

## Owner's agent rules (`/.agent/`)

`.agent/rules`, `.agent/workflows`, `.agent/skills` contain the owner's own standing instructions (always_on): strict TypeScript, server components by default, confirmation dialog on every destructive action, sonner toast on every action feedback, table row actions in a `...` dropdown, one active contract per car, and a contract completes *only* when every one of its washes is acknowledged (acknowledgment increments `completedWashes`, not the wash upload itself). Read the relevant workflows before touching contract/wash flows.
