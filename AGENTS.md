# AGENTS.md

## Setup

```bash
cp .env.example .env   # fill in Supabase keys + AUTH_SECRET
npm install             # activates husky pre-commit hook
npx supabase login      # once, before first db:types run
```

Node 20.19+ or 22.12+ required (Vite 8).

## Commands

| Command                | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Dev server                                                |
| `npm run check`        | Type-check + Svelte-check (runs sync first)               |
| `npm run format`       | Prettier write all                                        |
| `npm run format:check` | Prettier check (CI-style)                                 |
| `npm run build`        | Production build via adapter-node                         |
| `npm run db:types`     | Generate `src/lib/server/database.types.ts` from Supabase |

There is no `lint` or `test` script. Formatting is the only code-quality check (pre-commit runs `prettier --write` on staged files via lint-staged).

## Architecture

SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS 4 + Supabase. Single package, adapter-node.

- `src/routes/` — public front page (`/`) and admin area (`/admin`, `/admin/login`)
- `src/lib/server/` — all server-side logic: Supabase clients, auth, catalog, songs, requests, rate-limiting, form schemas, Netease API integration
- `src/lib/components/` — shared Svelte components (admin/, public/, ui/)
- `src/lib/types.ts` — shared TypeScript interfaces and enums
- `supabase/schema.sql` — database schema (run in Supabase SQL Editor to initialize)

### Auth model

Admin auth is cookie-based (HMAC-SHA256 signed, not Supabase session). `hooks.server.ts` verifies the cookie on every request. Login validates credentials against Supabase Auth, then sets the local session cookie. **Any Supabase Auth user can log in as admin** — there is no role check.

### Supabase clients

Two clients created in `src/lib/server/supabase.ts`:

- `supabasePublic` — uses publishable key, for read-only public catalog queries
- `supabaseAdmin` — uses secret key, for all write operations and admin reads

Type generation writes to `src/lib/server/database.types.ts` and uses the schema `public` only.

### Pagination

Queries expecting many rows use `fetchSupabasePages` (`src/lib/server/pagination.ts`) which automatically paginates through Supabase's 1000-row limit using `range()`.

## Style

- Prettier: single quotes, no trailing commas, 120 print width, 2-space indent
- Prefer Zod v4's `.parse()` (throws) over `.safeParse()` for server-side validation unless catching is needed
- Svelte 5 runes syntax (`.svelte.ts` files, `$state`, `$derived`, `$effect`)
- Server-only modules under `$lib/server/` are automatically protected by SvelteKit from client-side import
