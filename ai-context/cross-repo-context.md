# Cross-Repo Context

## Purpose
This document defines how **multiple teams** interact within this monorepo, how services communicate, and how AI tools should respect boundaries when generating code across packages.

---

## Team Boundaries

### Team A — Frontend (apps/web)
- **Owns:** `apps/web/`, contributes to `packages/ui/`
- **Can import from:** `@acme/ui`, `@acme/db` (server components only), `@acme/utils`
- **Cannot import from:** `@acme/api` source (calls API via HTTP if needed)
- **Framework:** Next.js 15, App Router, server components first
- **Data access:** Direct Prisma calls in server components, no client-side DB access

### Team B — Backend (apps/api)
- **Owns:** `apps/api/`, contributes to `libs/db/`
- **Can import from:** `@acme/db`, `@acme/utils`
- **Cannot import from:** `@acme/ui`, `@acme/web`, `@acme/admin`
- **Framework:** Express.js with Zod validation
- **Data access:** Prisma via `@acme/db`

### Team C — Internal Tools (apps/admin)
- **Owns:** `apps/admin/`
- **Can import from:** `@acme/ui`, `@acme/utils`
- **Cannot import from:** `@acme/db` (NO direct DB access)
- **Framework:** React 19 SPA (Vite)
- **Data access:** REST calls to `apps/api` (`http://localhost:4000/api/`)

### Platform Team — Shared Infrastructure
- **Owns:** `libs/db/`, `libs/utils/`, `packages/config/`
- **Responsibility:** Schema migrations, shared types, build tooling
- **Rule:** Changes here affect everyone — require cross-team review

---

## Service Communication Map

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   apps/web      │         │   apps/admin    │
│   (Next.js)     │         │   (React SPA)   │
│                 │         │                 │
└───────┬─────────┘         └───────┬─────────┘
        │                           │
        │ Server components         │ HTTP REST calls
        │ → direct Prisma           │ → apps/api
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   libs/db       │◄────────│   apps/api      │
│   (Prisma)      │         │   (Express)     │
│                 │         │                 │
└───────┬─────────┘         └─────────────────┘
        │
        ▼
┌─────────────────┐
│   PostgreSQL    │
└─────────────────┘
```

---

## Cross-Package Rules for AI Code Generation

### Rule 1: Never Mix Data Access Patterns

| App | Data Access Method | Example |
|-----|-------------------|---------|
| web (server component) | Direct Prisma | `const users = await db.user.findMany()` |
| web (client component) | API route or server action | `fetch('/api/users')` |
| api | Direct Prisma | `const user = await db.user.create(...)` |
| admin | HTTP to api | `fetch('http://localhost:4000/api/users')` |

**AI must never:**
- Generate Prisma calls in `apps/admin` code
- Generate `fetch()` calls in `apps/web` server components (use Prisma directly)
- Import `@acme/db` in client-side bundles

### Rule 2: Shared Types Live in Shared Packages

When multiple teams need the same type:
```typescript
// ✅ Define in libs/utils or libs/db (shared)
// libs/utils/src/types.ts
export type ApiResponse<T> = { success: boolean; data?: T; error?: string };

// ✅ Each app imports from the shared package
import type { ApiResponse } from '@acme/utils';
```

```typescript
// ❌ Never duplicate types across apps
// apps/api/src/types.ts ← NO
// apps/admin/src/types.ts ← NO (same type defined twice)
```

### Rule 3: Schema Changes Require Migration Awareness

When modifying `libs/db/prisma/schema.prisma`:
1. The change affects **all consumers** (web, api)
2. Must run `pnpm --filter @acme/db db:migrate` after schema changes
3. Must run `pnpm --filter @acme/db db:generate` to regenerate client types
4. All apps using the changed model need testing

### Rule 4: UI Components Are Framework-Agnostic

`packages/ui` components must work in **both** `apps/web` and `apps/admin`:
- No `'use client'` directive in `packages/ui` (apps add it as needed)
- No Next.js-specific imports (like `next/link`)
- No Vite-specific features
- Props-driven, no internal data fetching

---

## Cross-Team Integration Points

### Shared Models (via @acme/db)

```
User ←──── apps/web (display profile)
  │  ←──── apps/api (CRUD operations)
  │  ←──── apps/admin (user management via API)
  │
Post ←──── apps/web (blog display)
     ←──── apps/api (CRUD operations)
     ←──── apps/admin (content moderation via API)
```

### Shared Components (via @acme/ui)

```
Button ←── apps/web (customer UI)
       ←── apps/admin (admin UI)

(apps/api does NOT use @acme/ui — no React)
```

### Shared Utilities (via @acme/utils)

```
Result<T,E> ←── apps/web (server actions)
            ←── apps/api (route handlers)
            ←── apps/admin (API response handling)

formatDate  ←── all apps
slugify     ←── apps/web, apps/api
truncate    ←── apps/web, apps/admin
```

---

## Conflict Prevention Guidelines

### When Team A and Team B Both Touch a Model

1. **Schema changes** (Team B / Platform): PR to `libs/db/prisma/schema.prisma`
2. **API endpoint changes** (Team B): Update `apps/api/src/routes/`
3. **UI consumption** (Team A): Update `apps/web/` after API is deployed
4. **Admin consumption** (Team C): Update `apps/admin/` after API is deployed

### When Adding a New Shared Component

1. Create in `packages/ui/src/components/NewComponent.tsx`
2. Export from `packages/ui/src/index.ts`
3. Both `apps/web` and `apps/admin` can immediately import

### When Adding a New API Endpoint

1. Create route in `apps/api/src/routes/resource.ts`
2. Register in `apps/api/src/server.ts`
3. Document request/response types
4. `apps/admin` can consume immediately
5. `apps/web` can use it for client components (server components use Prisma directly)

---

## Environment Boundaries

| Environment | apps/web | apps/api | apps/admin |
|-------------|----------|----------|------------|
| DATABASE_URL | ✅ (server only) | ✅ | ❌ |
| PORT | ❌ | ✅ (4000) | ❌ |
| NODE_ENV | ✅ | ✅ | ✅ |
| NEXT_PUBLIC_API_URL | ✅ | ❌ | ❌ |
| VITE_API_URL | ❌ | ❌ | ✅ |

**AI must never:**
- Generate `DATABASE_URL` usage in `apps/admin`
- Use `NEXT_PUBLIC_*` vars in `apps/api`
- Use `VITE_*` vars outside `apps/admin`

---

## Multi-Team PR Workflow

```
Feature branch → PR → Required reviews based on CODEOWNERS:

apps/web/**        → Frontend team approval
apps/api/**        → Backend team approval
apps/admin/**      → Internal tools team approval
packages/ui/**     → Frontend team + 1 other team
libs/db/**         → Backend + Platform team
libs/utils/**      → Platform team
.github/**         → Platform team
ai-context/**      → Any team (knowledge contributions welcome)
```

---

## AI Context Loading Strategy

When Copilot is editing a file, it loads context in layers:

```
Layer 1 (always):    .github/copilot-instructions.md
Layer 2 (scoped):    .github/instructions/{matching}.instructions.md
Layer 3 (on demand): ai-context/*.md (referenced by instructions)
```

This ensures:
- **Team A** editing `apps/web/` gets Next.js + RSC rules automatically
- **Team B** editing `apps/api/` gets Express + Zod rules automatically
- **Team C** editing `apps/admin/` gets SPA + HTTP-only rules automatically
- **Nobody** gets conflicting rules from another team's context
