# AI Context — ACME Monorepo

This folder is the **single source of truth** for AI-facing project context. All AI tools, agents, and instruction files reference the documentation here.

## Folder Structure

```
ai-context/
├── README.md                  ← You are here
├── overview.md                ← Project summary, tech stack, repo map
├── architecture.md            ← System design, data flow, app roles
├── dependency-graph.md        ← Import rules, package relationships
├── patterns.md                ← Code patterns (Result, Zod, components, routes)
├── conventions.md             ← Naming, file structure, commit rules
├── database-schema.md         ← Prisma models, queries, migration workflow
├── api-reference.md           ← REST endpoints, validation, response shape
├── commands.md                ← Build, dev, test, deploy commands
└── packages/                  ← Per-package deep context
    ├── web.md                 ← @acme/web (Next.js)
    ├── api.md                 ← @acme/api (Express)
    ├── admin.md               ← @acme/admin (React SPA)
    ├── ui.md                  ← @acme/ui (component library)
    ├── config.md              ← @acme/config (shared configs)
    ├── db.md                  ← @acme/db (Prisma)
    └── utils.md               ← @acme/utils (utilities)
```

## How This Connects to Copilot

The `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md` files are lightweight wrappers that Copilot reads. They import context from this folder:

```
.github/copilot-instructions.md  →  references ai-context/overview.md, conventions.md
.github/instructions/nextjs.*    →  references ai-context/packages/web.md
.github/instructions/api.*       →  references ai-context/packages/api.md
...
```

## Maintenance Rule
When you change project conventions, **update the files here first**, then propagate to `.github/` instruction files.
