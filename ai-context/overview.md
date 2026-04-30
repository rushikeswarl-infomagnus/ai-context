# Project Overview

## What Is This?
ACME Platform — a production-ready monorepo with 3 apps, 2 shared packages, and 2 foundation libs, managed by pnpm workspaces and Turborepo.

## Tech Stack
| Layer        | Technology                                         |
|--------------|----------------------------------------------------|
| Runtime      | Node.js 20+                                        |
| Package Mgr  | pnpm 9 with workspaces                             |
| Build        | Turborepo (task orchestration, caching)             |
| Language     | TypeScript 5.4+ (strict mode everywhere)            |
| Frontend     | React 19, Next.js 15 (App Router), Tailwind CSS 4  |
| Backend      | Express.js, Zod validation, Helmet, CORS            |
| Database     | PostgreSQL via Prisma ORM                            |
| Testing      | Vitest (unit/integration), Playwright (e2e)          |

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
├── ai-context/                     AI context files (this folder)
├── .github/                        Copilot instruction files
├── package.json                    Root workspace config
├── pnpm-workspace.yaml            Workspace definitions
├── turbo.json                     Turborepo pipeline config
└── tsconfig.json                  Base TypeScript config
```

## Package Summary

| Package | Type | Port | Workspace Deps | Role |
|---------|------|------|----------------|------|
| @acme/web | Next.js 15 App | 3000 | ui, db, utils | Customer-facing web app |
| @acme/api | Express.js API | 4000 | db, utils | REST API server |
| @acme/admin | React SPA (Vite) | 3001 | ui, utils | Admin dashboard |
| @acme/ui | Component lib | — | none | Shared React components |
| @acme/config | Config package | — | none | ESLint, Prettier, TS configs |
| @acme/db | Prisma client | — | none | Database access layer |
| @acme/utils | Utility lib | — | none | Result type, string helpers |

## Environment Variables
Validated with Zod at each app's startup (`src/env.ts`):

| Variable | Required | Default | Used By |
|----------|----------|---------|---------|
| DATABASE_URL | yes | — | web, api |
| PORT | no | 4000 | api |
| NODE_ENV | no | development | all |
