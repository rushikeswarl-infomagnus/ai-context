# Architecture

## System Design
Three apps share code through internal packages. Apps never import from each other.

```
Browser ──→ apps/web (Next.js SSR) ──→ libs/db ──→ PostgreSQL
                                                        ↑
Browser ──→ apps/admin (SPA) ──→ apps/api (Express) ──→ libs/db
```

## Application Roles

### apps/web — Customer-Facing Web App
- **Framework:** Next.js 15 with App Router
- **Rendering:** Server components by default, `'use client'` only for interactive UI
- **Routing:** File-based (`src/app/` directory)
- **Data access:** Server components → `@acme/db` directly. Client components → API routes.
- **Port:** 3000

### apps/api — REST API Server
- **Framework:** Express.js
- **Middleware stack (order matters):** helmet() → cors() → express.json() → routes
- **Validation:** Zod schemas on every request body
- **Error handling:** Result pattern — business logic never throws
- **Response format:** `{ success: boolean, data?: T, error?: string }`
- **Port:** 4000
- **Endpoints:** `/api/users`, `/api/posts`, `/health`

### apps/admin — Admin Dashboard
- **Framework:** React 19 SPA via Vite
- **Data access:** Calls apps/api REST endpoints (`http://localhost:4000/api/`)
- **No direct database access** — all reads/writes through the API
- **Port:** 3001

## Shared Code Roles

### packages/ui — Component Library
- Shared React components consumed by web and admin
- Client-agnostic — no `'use client'` directives in this package
- Barrel-exported from `src/index.ts`

### packages/config — Shared Configs
- ESLint, Prettier base configurations
- Extended by each app/package locally

### libs/db — Database Layer
- Prisma ORM singleton client (globalThis caching for dev hot-reload)
- PostgreSQL with User, Post models and Role enum
- Exports: `db` client + Prisma-generated types
- Consumed only by apps/web (server-side) and apps/api

### libs/utils — Utility Library
- Pure functions — no side effects, no I/O
- `Result<T, E>` type + `ok()` / `err()` helpers
- String utilities: `formatDate`, `slugify`, `truncate`

## Key Design Decisions
1. **Server components first** — apps/web minimizes client JS by defaulting to RSC
2. **Result pattern over exceptions** — business logic returns `Result<T, E>`, never throws
3. **Zod at the boundary** — every external input (API body, env vars) validated with Zod
4. **Prisma singleton** — globalThis caching prevents connection exhaustion in dev
5. **No cross-app imports** — shared code lives only in packages/ and libs/
6. **Admin doesn't touch DB** — apps/admin only communicates through the API layer
