# @acme/api — Express.js REST API

## Quick Facts
| Key | Value |
|-----|-------|
| Package name | @acme/api |
| Framework | Express.js |
| Port | 4000 |
| Workspace deps | @acme/db, @acme/utils |
| Entry | src/server.ts |

## Middleware Stack (order matters)
1. `helmet()` — security headers
2. `cors()` — cross-origin requests
3. `express.json()` — JSON body parser
4. Route handlers

## Route Handler Pattern
Every route handler:
1. Is `async`
2. Validates request body with Zod `safeParse()` (never `parse()`)
3. Uses Result pattern for business logic (never throws)
4. Returns `{ success: boolean, data?: T, error?: string }`

```typescript
export const resourceRouter = Router();

resourceRouter.post('/', async (req, res) => {
  // 1. Validate
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.message });
    return;  // return, don't else
  }

  // 2. Business logic with Result
  const result = await createResource(parsed.data);

  // 3. Respond
  if (!result.ok) {
    res.status(500).json({ success: false, error: result.error });
    return;
  }
  res.status(201).json({ success: true, data: result.data });
});
```

## Current Endpoints
- `GET /health` → `{ status: "ok" }`
- `GET /api/users` → list all users
- `POST /api/users` → create user (body: `{ email, name? }`)
- `GET /api/posts` → list all posts with author
- `POST /api/posts` → create post (body: `{ title, content?, authorId }`)

## REST Conventions
- `/api/{resource}` (plural nouns)
- GET list, GET :id, POST create, PATCH :id update, DELETE :id

## Environment Variables (src/env.ts)
Validated with Zod at startup:
- `PORT` — defaults to 4000
- `DATABASE_URL` — PostgreSQL connection string
- `NODE_ENV` — development | production | test

## File Structure
```
src/
  server.ts        # Express app setup & startup
  env.ts           # Zod env validation
  routes/
    users.ts       # /api/users handlers
    posts.ts       # /api/posts handlers
  middleware/       # Custom middleware
  services/        # Business logic layer
```

## Commands
```bash
pnpm --filter @acme/api dev    # hot reload via tsx watch
pnpm --filter @acme/api build  # tsup
pnpm --filter @acme/api test   # Vitest
```
