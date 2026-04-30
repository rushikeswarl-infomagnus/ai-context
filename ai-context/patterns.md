# Code Patterns

## 1. Result Pattern (Error Handling)

**Source:** `libs/utils/src/result.ts`  
**Used by:** All apps — especially `apps/api` route handlers

```typescript
import { ok, err } from '@acme/utils';
import type { Result } from '@acme/utils';

type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

// Returning success
const getUser = async (id: string): Promise<Result<User>> => {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return err('User not found');
  return ok(user);
};

// Consuming in a route
const result = await getUser(id);
if (!result.ok) {
  res.status(404).json({ success: false, error: result.error });
  return;
}
res.json({ success: true, data: result.data });
```

**Rule:** Never throw in business logic. Always return `Result<T, E>`.

---

## 2. Zod Validation Pattern

**Used in:** `apps/api/src/routes/*.ts`, `apps/*/src/env.ts`

```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
});

// Use safeParse (not parse) — doesn't throw
const parsed = createUserSchema.safeParse(req.body);
if (!parsed.success) {
  res.status(400).json({ success: false, error: parsed.error.message });
  return;
}
// parsed.data is now fully typed
```

---

## 3. Environment Validation Pattern

**Used in:** Each app's `src/env.ts`

```typescript
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

// Called once at startup
const env = envSchema.parse(process.env);
```

---

## 4. React Component Pattern

**Used in:** `packages/ui/src/components/*.tsx`, `apps/web/`, `apps/admin/`

```tsx
import type { ReactNode } from 'react';

type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

export const Button = ({ label, variant = 'primary', disabled = false, onClick }: ButtonProps): JSX.Element => {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
};
```

**Rules:**
- `const` arrow function (not `function` declaration)
- Props type defined directly above the component
- Explicit `: JSX.Element` return type
- Named export (never `export default`)
- Tailwind CSS classes only

---

## 5. API Route Handler Pattern

**Used in:** `apps/api/src/routes/*.ts`

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { db } from '@acme/db';
import { ok, err } from '@acme/utils';
import type { Result } from '@acme/utils';

export const resourceRouter = Router();

const createSchema = z.object({ /* fields */ });

// GET list
resourceRouter.get('/', async (_req, res) => {
  const items = await db.resource.findMany();
  res.json({ success: true, data: items });
});

// POST create
resourceRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }

  const result: Result<Resource> = await db.resource
    .create({ data: parsed.data })
    .then((item) => ok(item))
    .catch((e: unknown) => err(e instanceof Error ? e.message : 'Unknown error'));

  if (!result.ok) {
    res.status(500).json({ success: false, error: result.error });
    return;
  }

  res.status(201).json({ success: true, data: result.data });
});
```

---

## 6. Prisma Singleton Pattern

**Source:** `libs/db/src/client.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
```

Prevents connection pool exhaustion during Next.js/tsx hot-reload.

---

## 7. Import Conventions

```typescript
// ✅ Correct — workspace package name
import { Button } from '@acme/ui';
import { db } from '@acme/db';
import { ok, err } from '@acme/utils';

// ✅ Correct — type-only import
import type { Result } from '@acme/utils';
import type { User, Post } from '@acme/db';

// ❌ Wrong — relative path across packages
import { Button } from '../../packages/ui/src/components/Button';

// ❌ Wrong — default export
export default function MyComponent() {}
```
