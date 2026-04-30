# Monorepo AI Context — GitHub Copilot Strategy

This repository demonstrates **how to structure GitHub Copilot context files in a monorepo** so Copilot generates code that follows your per-package conventions.

---

## The Problem

In a monorepo, different packages have different tech stacks, conventions, and rules. A single global instruction file can't cover everything:
- Your **Next.js app** uses server components, but your **admin SPA** doesn't.
- Your **API** needs Zod validation, but your **UI library** doesn't care about that.
- Your **database package** has Prisma-specific workflows.

**Without scoped context, Copilot generates code that violates your package-specific conventions.**

---

## The Strategy: Two-Layer Copilot Context

Copilot supports **two mechanisms** for providing context in a monorepo:

```
┌──────────────────────────────────────────────────────┐
│  Layer 1: REPO-WIDE (always loaded)                  │
│  .github/copilot-instructions.md                     │
│  • Architecture rules, dependency graph              │
│  • Code style, naming conventions                    │
│  • Monorepo-wide patterns                            │
└──────────────────────┬───────────────────────────────┘
                       │
      ┌────────────────┼──────────────────┐
      │                │                  │
┌─────▼──────┐  ┌─────▼──────┐  ┌────────▼────────┐
│ apps/web/**│  │ apps/api/**│  │ libs/db/**       │
│            │  │            │  │                  │
│ nextjs.    │  │ api.       │  │ database.        │
│ instructions│ │ instructions│ │ instructions     │
│ .md        │  │ .md        │  │ .md              │
│            │  │            │  │                  │
│ (server    │  │ (Zod,      │  │ (Prisma,         │
│  components│  │  Result    │  │  migrations)     │
│  App Router│  │  pattern)  │  │                  │
└────────────┘  └────────────┘  └──────────────────┘
```

**Layer 1** — `.github/copilot-instructions.md`: Always loaded for every file. Contains universal monorepo rules.  
**Layer 2** — `.github/instructions/*.instructions.md`: Loaded only when editing files matching the `applyTo` glob. Contains package-specific rules.

---

## Copilot Context Files in This Repo

| File | Scope | What It Covers |
|------|-------|----------------|
| `.github/copilot-instructions.md` | All files (always) | Repo map, architecture, code style, dependency graph, commands |
| `.github/instructions/nextjs.instructions.md` | `apps/web/**` | Server components, App Router, data fetching, file conventions |
| `.github/instructions/api.instructions.md` | `apps/api/**` | Zod validation, Result pattern, REST conventions, middleware |
| `.github/instructions/admin.instructions.md` | `apps/admin/**` | React SPA rules, API data fetching, no direct DB access |
| `.github/instructions/ui.instructions.md` | `packages/ui/**` | Component patterns, Props types, barrel exports |
| `.github/instructions/config.instructions.md` | `packages/config/**` | ESLint/Prettier shared configs |
| `.github/instructions/database.instructions.md` | `libs/db/**` | Prisma ORM, schema rules, migration workflow |
| `.github/instructions/utils.instructions.md` | `libs/utils/**` | Result pattern, pure functions, utility exports |
| `.github/instructions/prisma.instructions.md` | `**/*.prisma` | Prisma schema conventions, model requirements |
| `.github/instructions/testing.instructions.md` | `**/*.test.{ts,tsx}` | Vitest, mocking patterns, test structure |

---

## How It Works

### 1. Repo-Wide Instructions (`.github/copilot-instructions.md`)

This file is **always injected into Copilot's context**, regardless of which file you're editing. Use it for rules that apply everywhere:

```markdown
# GitHub Copilot Instructions — ACME Monorepo

## Code Style
- TypeScript strict mode. No `any` — use `unknown` and narrow.
- Named exports only. No default exports.
...
```

### 2. Glob-Scoped Instructions (`.github/instructions/*.instructions.md`)

Each file uses an `applyTo` frontmatter field to scope it to specific file patterns. Copilot **only loads these when you're editing a matching file**:

```markdown
---
applyTo: "apps/web/**"
---

# Next.js Web App Instructions
- Use React server components by default in the App Router.
- Only add `'use client'` when the component needs state, effects, or browser APIs.
...
```

This means when you edit a file in `apps/web/`, Copilot sees both:
1. The global `copilot-instructions.md` rules
2. The `nextjs.instructions.md` rules scoped to the web app

But when you edit a file in `apps/api/`, it sees the global rules plus the **API-specific** rules instead.

---

## This Repo's Structure

```
acme-monorepo/
│
├── ai-context/                                # Centralized AI context (source of truth)
│   ├── README.md                              # Index & maintenance guide
│   ├── overview.md                            # Project summary, tech stack, repo map
│   ├── architecture.md                        # System design, data flow, app roles
│   ├── dependency-graph.md                    # Import rules, permission matrix
│   ├── patterns.md                            # Result, Zod, component, route patterns
│   ├── conventions.md                         # Naming, exports, commit, import order
│   ├── database-schema.md                     # Prisma models, queries, migrations
│   ├── api-reference.md                       # REST endpoints, validation, responses
│   ├── commands.md                            # All build/dev/test/db commands
│   └── packages/                              # Per-package deep context
│       ├── web.md                             #   @acme/web — Next.js
│       ├── api.md                             #   @acme/api — Express
│       ├── admin.md                           #   @acme/admin — React SPA
│       ├── ui.md                              #   @acme/ui — component library
│       ├── config.md                          #   @acme/config — shared configs
│       ├── db.md                              #   @acme/db — Prisma
│       └── utils.md                           #   @acme/utils — utilities
│
├── .github/                                   # Copilot instruction files
│   ├── copilot-instructions.md                # Repo-wide (always loaded)
│   └── instructions/                          # Glob-scoped
│       ├── nextjs.instructions.md             #   applyTo: apps/web/**
│       ├── api.instructions.md                #   applyTo: apps/api/**
│       ├── admin.instructions.md              #   applyTo: apps/admin/**
│       ├── ui.instructions.md                 #   applyTo: packages/ui/**
│       ├── config.instructions.md             #   applyTo: packages/config/**
│       ├── database.instructions.md           #   applyTo: libs/db/**
│       ├── utils.instructions.md              #   applyTo: libs/utils/**
│       ├── prisma.instructions.md             #   applyTo: **/*.prisma
│       └── testing.instructions.md            #   applyTo: **/*.test.*
│
├── apps/
│   ├── web/                                   # Next.js 15 (App Router) — port 3000
│   ├── api/                                   # Express.js REST API — port 4000
│   └── admin/                                 # React SPA (Vite) — port 3001
│
├── packages/
│   ├── ui/                                    # Shared React component library
│   └── config/                                # Shared ESLint/Prettier/TS configs
│
├── libs/
│   ├── db/                                    # Prisma database client & schema
│   └── utils/                                 # Shared utilities & Result type
│
├── package.json                               # Root workspace config
├── pnpm-workspace.yaml                        # pnpm workspaces
└── turbo.json                                 # Turborepo pipeline
```

---

## The `ai-context/` Folder Strategy

The `ai-context/` folder is the **centralized source of truth** for all project knowledge that AI tools need. Instead of scattering documentation across `docs/`, READMEs, and wikis, everything AI-relevant lives in one place.

### What goes in `ai-context/`?
| File | Purpose |
|------|---------|
| `overview.md` | Project summary, tech stack table, repo map, env vars |
| `architecture.md` | System design, app roles, data flow diagrams |
| `dependency-graph.md` | Visual graph, import permission matrix, constraints |
| `patterns.md` | Every code pattern with copy-paste templates |
| `conventions.md` | Naming, exports, commit, import order rules |
| `database-schema.md` | Models, relationships, common queries, migration steps |
| `api-reference.md` | Every endpoint, validation schemas, error responses |
| `commands.md` | Every build/dev/test/db command per package |
| `packages/*.md` | Deep context for each workspace package |

### How does it connect to Copilot?
The `.github/` instruction files are **lightweight wrappers**. The `ai-context/` folder has the detailed reference:

```
.github/copilot-instructions.md       ← summary rules (always loaded)
  └── references ai-context/overview.md, conventions.md, patterns.md

.github/instructions/nextjs.*         ← Next.js rules (loaded for apps/web/**)
  └── references ai-context/packages/web.md

.github/instructions/api.*            ← API rules (loaded for apps/api/**)
  └── references ai-context/packages/api.md
```

### Why a dedicated folder?
1. **Single source of truth** — update conventions in one place, not 10 files
2. **Tool-agnostic** — works for Copilot, Claude, Cursor, Cline, or any future tool
3. **Discoverable** — new team members find all AI context in one obvious location
4. **Versionable** — changes tracked in git alongside the code they describe
5. **Referenceable** — Copilot instruction files can point to detailed docs

---

## Best Practices

### 1. Keep Repo-Wide Instructions Focused
The global file has context limits. Put only universal rules here: architecture, code style, dependency graph, and naming conventions.

### 2. Use `applyTo` Globs for Package-Specific Rules
Don't clutter the global file with Next.js rules that don't apply to the API. Use scoped instruction files so Copilot gets the right context per package.

### 3. Document the Dependency Graph
The #1 monorepo mistake Copilot makes is importing the wrong direction. Make it explicit:
```
apps → packages → libs   (OK)
libs → packages → apps   (NEVER)
```

### 4. Include Commands in Scoped Files
When Copilot generates code that needs building or testing, it helps to know the scoped commands:
```
pnpm --filter @acme/web dev
pnpm --filter @acme/db db:migrate
```

### 5. Be Directive, Not Descriptive
Write rules as commands: *"Use server components by default"*, not *"This project prefers server components when possible."*

### 6. Add Scoped Files as Your Monorepo Grows
When you add a new package with distinct conventions, create a new `.github/instructions/<name>.instructions.md` with the appropriate `applyTo` glob.

---

## Adding a New Scoped Instruction File

1. Create `.github/instructions/<name>.instructions.md`
2. Add `applyTo` frontmatter with the glob pattern:
   ```markdown
   ---
   applyTo: "packages/ui/**"
   ---

   # UI Component Library Instructions
   - Use `const` arrow functions for components.
   - Define Props type above the component.
   - Export from `src/index.ts`.
   ```
3. Copilot will automatically load these rules when editing matching files.

---

## Quick Start

1. **Clone this repo** as a template for your monorepo Copilot setup.
2. **Edit `.github/copilot-instructions.md`** with your universal monorepo rules.
3. **Edit/add `.github/instructions/*.instructions.md`** files scoped to your packages.
4. **Copilot now generates code** that follows your per-package conventions.
