# GitHub Copilot Instructions — ACME Monorepo

## About This Repository
ACME Platform monorepo — a pnpm + Turborepo workspace with 3 apps, 2 shared packages, and 2 foundation libs. Always identify which workspace package you're editing before generating code.

## Repo Map
```
acme-monorepo/
├── apps/
│   ├── web/          @acme/web     Next.js 15 (App Router) — port 3000
│   ├── api/          @acme/api     Express.js REST API — port 4000
│   └── admin/        @acme/admin   React SPA (Vite) — port 3001
├── packages/
│   ├── ui/           @acme/ui      Shared React component library
│   └── config/       @acme/config  Shared ESLint, Prettier, TS configs
├── libs/
│   ├── db/           @acme/db      Prisma client, schema & migrations
│   └── utils/        @acme/utils   Shared utility functions & Result type
├── package.json                    Root workspace config
├── pnpm-workspace.yaml            Workspace definitions
├── turbo.json                     Turborepo pipeline config
└── tsconfig.json                  Base TypeScript config
```

## Dependency Graph (NEVER reverse these)
```
apps/web ──→ @acme/ui, @acme/db, @acme/utils
apps/api ──→ @acme/db, @acme/utils
apps/admin → @acme/ui, @acme/utils
packages/ui → (no workspace deps)
libs/db ───→ (no workspace deps)
libs/utils → (no workspace deps)
```
Direction: `apps → packages → libs`. Packages and libs NEVER import from apps.

## Tech Stack
- **Runtime:** Node.js 20+ | **Package Manager:** pnpm 9
- **Build:** Turborepo | **Language:** TypeScript 5.4+ strict
- **Frontend:** React 19, Next.js 15 (App Router), Tailwind CSS 4
- **Backend:** Express.js, Zod validation, Helmet, CORS
- **Database:** PostgreSQL via Prisma ORM
- **Testing:** Vitest (unit/integration), Playwright (e2e)

## Code Style — Apply Everywhere
- TypeScript strict mode. No `any` — use `unknown` and narrow.
- Named exports only. No default exports.
- All functions must have explicit return types.
- File naming: `kebab-case.ts` for modules, `PascalCase.tsx` for React components.
- Use `type` keyword for type-only imports: `import type { Foo } from 'bar'`.
- Cross-package imports use workspace names: `import { Button } from '@acme/ui'`.
- Prefer `const` arrow functions for React components.

## Error Handling — Result Pattern
Use the `Result<T, E>` type from `@acme/utils`. Never throw in business logic.
```typescript
import { ok, err } from '@acme/utils';
import type { Result } from '@acme/utils';

// Success: ok(data)   →  { ok: true, data: T }
// Failure: err(msg)   →  { ok: false, error: E }
```

## API Response Shape
All API endpoints return: `{ success: boolean, data?: T, error?: string }`

## Database Access
- Only via `@acme/db`: `import { db } from '@acme/db'`
- No raw SQL. Prisma ORM only.
- Models: User (id, email, name, role, posts), Post (id, title, content, published, author)
- All models have `createdAt` + `updatedAt` timestamps.

## Environment Variables
Validated with Zod at app startup. Schema in each app's `src/env.ts`.
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — Server port (API: 4000)
- `NODE_ENV` — development | production | test

## Testing
- Vitest for unit/integration. Co-locate tests: `foo.test.ts` next to `foo.ts`.
- Playwright for e2e in `apps/*/e2e/`.
- Mock external deps — never hit real services in unit tests.

## Commands
```
pnpm dev                            # Start all apps
pnpm build                          # Build everything
pnpm test                           # Run all tests
pnpm --filter @acme/web dev         # Dev single app
pnpm --filter @acme/db db:migrate   # Run Prisma migration
pnpm --filter @acme/db db:generate  # Regenerate Prisma client
```

## Commit Convention
Format: `type(scope): description`
Types: feat, fix, chore, docs, refactor, test, perf
Scope: package name (e.g., `feat(web): add login page`)

## Deep Context
For detailed architecture, patterns, database schema, API reference, and per-package context, see the `ai-context/` folder:
- `ai-context/overview.md` — project summary, tech stack, repo map
- `ai-context/architecture.md` — system design, data flow
- `ai-context/dependency-graph.md` — import rules matrix
- `ai-context/patterns.md` — Result, Zod, component, route patterns
- `ai-context/conventions.md` — naming, file structure, import order
- `ai-context/database-schema.md` — Prisma models, queries
- `ai-context/api-reference.md` — REST endpoints, validation
- `ai-context/commands.md` — all build/dev/test commands
- `ai-context/packages/*.md` — per-package deep context
