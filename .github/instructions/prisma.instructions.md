---
applyTo: "**/*.prisma"
---

# Prisma Schema Rules

## Schema Location
`libs/db/prisma/schema.prisma`

## Model Conventions
- Every model MUST have these timestamp fields:
  ```prisma
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ```
- Use `cuid()` for IDs: `id String @id @default(cuid())`
- Use `@unique` for natural keys (email, slug, etc.)
- Use `@relation` with explicit `fields` and `references` for every foreign key
- Define enums in the schema, not in TypeScript code

## Adding a New Model
```prisma
model NewModel {
  id        String   @id @default(cuid())
  // ... fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

After editing schema:
1. `pnpm --filter @acme/db db:migrate` — create migration
2. `pnpm --filter @acme/db db:generate` — regenerate client
3. Export new types from `libs/db/src/index.ts`
