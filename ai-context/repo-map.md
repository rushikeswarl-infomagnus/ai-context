# Repo Map

## Purpose
This file gives AI tools a **navigable map** of the entire repository — what lives where, who owns it, and how to find key files quickly.

---

## Directory Tree (Annotated)

```
acme-monorepo/
│
├── .github/
│   ├── copilot-instructions.md       # Global Copilot rules (always loaded)
│   └── instructions/
│       ├── api.instructions.md        # Scoped: apps/api/**
│       ├── nextjs.instructions.md     # Scoped: apps/web/**
│       ├── admin.instructions.md      # Scoped: apps/admin/**
│       ├── database.instructions.md   # Scoped: libs/db/**
│       ├── prisma.instructions.md     # Scoped: **/*.prisma
│       ├── testing.instructions.md    # Scoped: **/*.test.{ts,tsx}
│       ├── ui.instructions.md         # Scoped: packages/ui/**
│       ├── utils.instructions.md      # Scoped: libs/utils/**
│       └── config.instructions.md     # Scoped: packages/config/**
│
├── ai-context/                        # Deep AI reference docs
│   ├── README.md                      # Index of this folder
│   ├── overview.md                    # Project summary & tech stack
│   ├── architecture.md                # System design & data flow
│   ├── dependency-graph.md            # Import rules & permission matrix
│   ├── patterns.md                    # Code patterns (Result, Zod, components)
│   ├── conventions.md                 # Naming, file structure, commit rules
│   ├── database-schema.md             # Prisma models & query examples
│   ├── api-reference.md               # REST endpoints & validation
│   ├── commands.md                    # Build, dev, test, deploy commands
│   ├── repo-map.md                    # ← This file
│   ├── cross-repo-context.md          # Cross-repo integration & team boundaries
│   └── packages/                      # Per-package deep context
│       ├── web.md                     # @acme/web deep dive
│       ├── api.md                     # @acme/api deep dive
│       ├── admin.md                   # @acme/admin deep dive
│       ├── ui.md                      # @acme/ui deep dive
│       ├── config.md                  # @acme/config deep dive
│       ├── db.md                      # @acme/db deep dive
│       └── utils.md                   # @acme/utils deep dive
│
├── apps/
│   ├── web/                           # @acme/web — Next.js 15 (App Router)
│   │   ├── package.json
│   │   └── src/
│   │       └── app/
│   │           ├── layout.tsx         # Root layout (server component)
│   │           ├── page.tsx           # Home page
│   │           └── globals.css        # Tailwind CSS entry
│   │
│   ├── api/                           # @acme/api — Express.js REST API
│   │   ├── package.json
│   │   └── src/
│   │       ├── server.ts              # Express app setup & middleware
│   │       ├── env.ts                 # Zod env validation
│   │       └── routes/
│   │           ├── users.ts           # /api/users CRUD
│   │           └── posts.ts           # /api/posts CRUD
│   │
│   └── admin/                         # @acme/admin — React SPA (Vite)
│       ├── package.json
│       └── src/
│           └── App.tsx                # Root component
│
├── packages/
│   ├── ui/                            # @acme/ui — Shared component library
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts               # Barrel exports
│   │       └── components/
│   │           └── Button.tsx         # Example component
│   │
│   └── config/                        # @acme/config — Shared configs
│       ├── package.json
│       └── src/
│           ├── index.ts               # Barrel exports
│           ├── eslint.ts              # Base ESLint config
│           └── prettier.ts            # Base Prettier config
│
├── libs/
│   ├── db/                            # @acme/db — Prisma database layer
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   └── schema.prisma         # Database schema definition
│   │   └── src/
│   │       ├── index.ts               # Barrel exports
│   │       └── client.ts             # Prisma singleton client
│   │
│   └── utils/                         # @acme/utils — Pure utility functions
│       ├── package.json
│       └── src/
│           ├── index.ts               # Barrel exports
│           ├── result.ts              # Result<T,E> type + ok/err helpers
│           └── string-helpers.ts      # formatDate, slugify, truncate
│
├── docs/
│   └── translate_to_telugu.py         # Utility script
│
├── package.json                       # Root workspace config
├── pnpm-workspace.yaml               # Workspace package paths
├── turbo.json                         # Turborepo pipeline (build/dev/test)
└── tsconfig.json                      # Base TypeScript config (extended by all)
```

---

## Quick Lookup: Key Files by Concern

| Concern | File(s) |
|---------|---------|
| Database schema | `libs/db/prisma/schema.prisma` |
| DB client singleton | `libs/db/src/client.ts` |
| Error handling type | `libs/utils/src/result.ts` |
| API routes | `apps/api/src/routes/*.ts` |
| API server setup | `apps/api/src/server.ts` |
| Env validation | `apps/api/src/env.ts` |
| Web app entry | `apps/web/src/app/page.tsx` |
| Global styles | `apps/web/src/app/globals.css` |
| Shared components | `packages/ui/src/components/*.tsx` |
| ESLint config | `packages/config/src/eslint.ts` |
| Workspace config | `pnpm-workspace.yaml` |
| Build pipelines | `turbo.json` |
| AI global rules | `.github/copilot-instructions.md` |

---

## Package Ownership & Team Mapping

| Package | Team | Responsibility |
|---------|------|----------------|
| @acme/web | Frontend | Customer-facing UI, SSR, routing |
| @acme/api | Backend | REST endpoints, validation, business logic |
| @acme/admin | Internal Tools | Admin dashboard, internal operations |
| @acme/ui | Frontend (shared) | Design system, reusable components |
| @acme/config | Platform/DevOps | Lint, format, TS configurations |
| @acme/db | Backend/Platform | Schema, migrations, DB access |
| @acme/utils | Platform | Shared types, helpers, Result pattern |

---

## Entry Points per App

| App | Dev Command | Port | Entry File |
|-----|-------------|------|------------|
| web | `pnpm --filter @acme/web dev` | 3000 | `apps/web/src/app/page.tsx` |
| api | `pnpm --filter @acme/api dev` | 4000 | `apps/api/src/server.ts` |
| admin | `pnpm --filter @acme/admin dev` | 3001 | `apps/admin/src/App.tsx` |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` (root) | Base strict TS config, extended by all packages |
| `turbo.json` | Defines `build`, `dev`, `test`, `lint` pipelines |
| `pnpm-workspace.yaml` | Declares `apps/*`, `packages/*`, `libs/*` as workspaces |
| `package.json` (root) | Workspace scripts, devDependencies, engines |
