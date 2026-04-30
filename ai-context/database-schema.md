# Database Schema

## Schema Location
`libs/db/prisma/schema.prisma`

## Models

### User
| Field     | Type     | Attributes                    |
|-----------|----------|-------------------------------|
| id        | String   | @id @default(cuid())          |
| email     | String   | @unique                       |
| name      | String?  | optional                      |
| role      | Role     | @default(USER)                |
| posts     | Post[]   | one-to-many relation          |
| createdAt | DateTime | @default(now())               |
| updatedAt | DateTime | @updatedAt                    |

### Post
| Field     | Type     | Attributes                              |
|-----------|----------|-----------------------------------------|
| id        | String   | @id @default(cuid())                    |
| title     | String   | required                                |
| content   | String?  | optional                                |
| published | Boolean  | @default(false)                         |
| author    | User     | @relation(fields: [authorId], ref: [id])|
| authorId  | String   | foreign key                             |
| createdAt | DateTime | @default(now())                         |
| updatedAt | DateTime | @updatedAt                              |

### Role (enum)
- `USER` — default
- `ADMIN` — administrative access

## Relationships
```
User 1──→ N Post    (via authorId foreign key)
```

## Common Queries
```typescript
import { db } from '@acme/db';

// List
await db.user.findMany();
await db.post.findMany({ where: { published: true }, include: { author: true } });

// Single
await db.user.findUnique({ where: { id } });
await db.user.findUnique({ where: { email } });

// With relations
await db.user.findUnique({ where: { id }, include: { posts: true } });

// Create
await db.user.create({ data: { email, name } });
await db.post.create({ data: { title, content, authorId } });

// Update
await db.user.update({ where: { id }, data: { name: 'New Name' } });
await db.post.update({ where: { id }, data: { published: true } });

// Delete
await db.user.delete({ where: { id } });
```

## Schema Change Workflow
1. Edit `libs/db/prisma/schema.prisma`
2. `pnpm --filter @acme/db db:migrate` — create + apply migration
3. `pnpm --filter @acme/db db:generate` — regenerate Prisma client
4. Export new types from `libs/db/src/index.ts`
5. Update `ai-context/database-schema.md` if models changed
