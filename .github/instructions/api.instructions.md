---
applyTo: "apps/api/**"
---

# @acme/api — Express.js REST API

## Package Context
- **Name:** @acme/api | **Port:** 4000
- **Framework:** Express.js with Helmet, CORS, JSON middleware
- **Dependencies:** @acme/db, @acme/utils

## Route Handler Rules
- All route handlers must be **async**.
- Validate every request body with a **Zod schema** defined in the same file.
- Use `safeParse()` (not `parse()`) so validation errors don't throw.
- Return early on validation failure with 400 status.

## Error Handling
- Use the Result pattern from `@acme/utils` — never throw in business logic.
- Wrap database calls: `.then(data => ok(data)).catch(e => err(e.message))`
- Return consistent JSON: `{ success: boolean, data?: T, error?: string }`
- HTTP status codes: 200 (ok), 201 (created), 400 (validation), 404 (not found), 500 (server error)

## Route Pattern Template
```typescript
import { Router } from 'express';
import { z } from 'zod';
import { db } from '@acme/db';
import { ok, err } from '@acme/utils';
import type { Result } from '@acme/utils';

export const resourceRouter = Router();

const createSchema = z.object({ /* fields */ });

resourceRouter.get('/', async (_req, res) => {
  const items = await db.resource.findMany();
  res.json({ success: true, data: items });
});

resourceRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }
  // ... create with Result pattern
});
```

## REST Conventions
- Routes: `/api/{resource}` (plural nouns)
- `GET /api/users` — list all
- `GET /api/users/:id` — get one
- `POST /api/users` — create
- `PATCH /api/users/:id` — partial update
- `DELETE /api/users/:id` — delete

## Environment Variables
Validated at startup in `src/env.ts` with Zod:
- `PORT` — defaults to 4000
- `DATABASE_URL` — PostgreSQL connection string
- `NODE_ENV` — development | production | test

## File Structure
```
src/
  server.ts        # Express app setup & startup
  env.ts           # Zod environment validation
  routes/          # One file per resource
    users.ts
    posts.ts
  middleware/       # Custom Express middleware
  services/        # Business logic (uses Result pattern)
```

## Middleware Stack (applied in order)
1. `helmet()` — security headers
2. `cors()` — cross-origin requests
3. `express.json()` — parse JSON bodies

## Commands
```
pnpm --filter @acme/api dev    # Dev server with hot reload (tsx watch)
pnpm --filter @acme/api build  # Production build (tsup)
pnpm --filter @acme/api test   # Run tests (Vitest)
```
