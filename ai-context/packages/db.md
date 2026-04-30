# @acme/db — Prisma Database Package

## Quick Facts
| Key | Value |
|-----|-------|
| Package name | @acme/db |
| ORM | Prisma (PostgreSQL) |
| Workspace deps | none (leaf package) |
| Consumers | @acme/web (server), @acme/api |
| Schema | libs/db/prisma/schema.prisma |

## Exports
```typescript
import { db } from '@acme/db';           // Singleton PrismaClient
import type { User, Post } from '@acme/db'; // Prisma-generated types
```

## Models
- **User** — id, email (unique), name?, role (USER/ADMIN), posts[], timestamps
- **Post** — id, title, content?, published, author → User, timestamps
- **Role** — enum (USER, ADMIN)

## Schema Rules
- All models: `createdAt DateTime @default(now())` + `updatedAt DateTime @updatedAt`
- IDs: `id String @id @default(cuid())`
- Foreign keys: always use `@relation(fields: [...], references: [...])`
- No raw SQL — Prisma query builder only

## Client Pattern (singleton)
```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

## Schema Change Workflow
1. Edit `prisma/schema.prisma`
2. `pnpm --filter @acme/db db:migrate`
3. `pnpm --filter @acme/db db:generate`
4. Export new types from `src/index.ts`

## File Structure
```
src/
  index.ts         # Exports: db, types
  client.ts        # Singleton PrismaClient
prisma/
  schema.prisma    # Source of truth
  seed.ts          # Seed script
  migrations/
```

## Commands
```bash
pnpm --filter @acme/db db:generate
pnpm --filter @acme/db db:migrate
pnpm --filter @acme/db db:push
pnpm --filter @acme/db db:seed
```
