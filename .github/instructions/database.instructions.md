---
applyTo: "libs/db/**"
---

# @acme/db — Prisma Database Package

## Package Context
- **Name:** @acme/db
- **ORM:** Prisma with PostgreSQL
- **Consumers:** @acme/web (server components), @acme/api (route handlers)

## Schema Rules
- All models must have `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`.
- Use `@relation` decorators for every foreign key relationship.
- Use `cuid()` for ID generation: `id String @id @default(cuid())`.
- Define enums in the schema file, not in TypeScript.

## Current Models
- **User:** id, email (unique), name?, role (USER|ADMIN), posts[], timestamps
- **Post:** id, title, content?, published (default false), author → User, timestamps
- **Role:** enum (USER, ADMIN)

## Client Usage
```typescript
import { db } from '@acme/db';
import type { User, Post } from '@acme/db';

// The `db` export is a singleton PrismaClient
await db.user.findMany();
await db.post.create({ data: { title, authorId } });
```

## File Structure
```
src/
  index.ts         # Barrel exports: db client + Prisma types
  client.ts        # Singleton PrismaClient (globalThis caching)
prisma/
  schema.prisma    # Database schema (source of truth)
  seed.ts          # Seed script
  migrations/      # Generated migration files
```

## Schema Change Workflow
1. Edit `prisma/schema.prisma`
2. Run `pnpm --filter @acme/db db:migrate` — creates migration + applies it
3. Run `pnpm --filter @acme/db db:generate` — regenerates the Prisma client
4. Update `src/index.ts` exports if you added new models

## Commands
```
pnpm --filter @acme/db db:generate  # Regenerate Prisma client types
pnpm --filter @acme/db db:migrate   # Create and apply migration
pnpm --filter @acme/db db:push      # Push schema without migration file
pnpm --filter @acme/db db:seed      # Run seed script
```

## Important: No Raw SQL
All queries must use Prisma's type-safe query builder. Never use `$queryRaw` or `$executeRaw`.
