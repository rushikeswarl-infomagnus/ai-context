# Dependency Graph

## Direction Rule
```
apps → packages → libs      ✅ allowed
libs → packages → apps      ❌ NEVER
```

## Visual Graph
```
┌──────────────────────────────────────────────────────┐
│                      APPS (consumers)                 │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │  @acme/web  │  │  @acme/api  │  │ @acme/admin  │ │
│  │  (Next.js)  │  │  (Express)  │  │ (React+Vite) │ │
│  └──┬──┬──┬────┘  └──┬──┬──────┘  └──┬──┬────────┘ │
│     │  │  │           │  │            │  │           │
└─────┼──┼──┼───────────┼──┼────────────┼──┼───────────┘
      │  │  │           │  │            │  │
      ▼  ▼  ▼           ▼  ▼            ▼  ▼
┌──────────────────────────────────────────────────────┐
│  PACKAGES                          (shared)           │
│  ┌─────────────────────┐  ┌──────────────┐           │
│  │  @acme/ui           │  │ @acme/config │           │
│  │  (React components) │  │ (ESLint etc) │           │
│  └─────────────────────┘  └──────────────┘           │
└──────────────────────────────────────────────────────┘
      │     │       │
      ▼     ▼       ▼
┌──────────────────────────────────────────────────────┐
│  LIBS                              (foundation)       │
│  ┌───────────────────┐  ┌──────────────────────────┐ │
│  │  @acme/db         │  │  @acme/utils             │ │
│  │  (Prisma client)  │  │  (Result type, helpers)  │ │
│  └───────────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## Per-Package Dependencies
```
@acme/web   ──→ @acme/ui, @acme/db, @acme/utils
@acme/api   ──→ @acme/db, @acme/utils
@acme/admin ──→ @acme/ui, @acme/utils
@acme/ui    ──→ (none)
@acme/config──→ (none)
@acme/db    ──→ (none)
@acme/utils ──→ (none)
```

## Import Permission Matrix

| From ↓ \ To →  | web | api | admin | ui | config | db | utils |
|-----------------|-----|-----|-------|----|--------|----|-------|
| **@acme/web**   | —   | ❌  | ❌    | ✅ | ✅     | ✅ | ✅    |
| **@acme/api**   | ❌  | —   | ❌    | ❌ | ✅     | ✅ | ✅    |
| **@acme/admin** | ❌  | ❌  | —     | ✅ | ✅     | ❌ | ✅    |
| **@acme/ui**    | ❌  | ❌  | ❌    | —  | ✅     | ❌ | ❌    |
| **@acme/config**| ❌  | ❌  | ❌    | ❌ | —      | ❌ | ❌    |
| **@acme/db**    | ❌  | ❌  | ❌    | ❌ | ❌     | —  | ❌    |
| **@acme/utils** | ❌  | ❌  | ❌    | ❌ | ❌     | ❌ | —     |

## Key Constraints
- **apps/admin does NOT import @acme/db** — communicates through the API only
- **@acme/api does NOT import @acme/ui** — backend has no React dependency
- **packages/ui has ZERO workspace deps** — leaf node, consumed by web + admin
- **libs/* never import from packages/* or apps/***
