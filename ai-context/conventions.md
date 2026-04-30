# Conventions

## TypeScript
- Strict mode enabled everywhere. No `any` — use `unknown` and narrow.
- All functions must have explicit return types.
- Use `import type { Foo }` for type-only imports.
- Use `unknown` instead of `any` for catching errors.

## Naming
| What | Convention | Example |
|------|-----------|---------|
| TypeScript modules | kebab-case.ts | `string-helpers.ts` |
| React components | PascalCase.tsx | `Button.tsx` |
| Test files | *.test.ts / *.test.tsx | `button.test.tsx` |
| Folders | kebab-case | `route-handlers/` |
| Types/Interfaces | PascalCase | `UserProfile` |
| Functions/variables | camelCase | `formatDate` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Env variables | UPPER_SNAKE_CASE | `DATABASE_URL` |

## Exports
- Named exports only. **Never use `export default`.**
- Every public API must be barrel-exported from the package's `src/index.ts`.
- Use `export type` for re-exporting types.

## File Structure per Package
```
src/
  index.ts          # Barrel exports (public API)
  *.ts / *.tsx      # Source files
  *.test.ts         # Co-located tests
```

## Component Rules (React)
1. Use `const` arrow function (not `function` declaration)
2. Define `Props` type directly above the component
3. Explicit `: JSX.Element` return type
4. Tailwind CSS classes — no inline styles, CSS modules, or styled-components
5. In `packages/ui`: no `'use client'` directive (client-agnostic)
6. In `apps/web`: server component by default, `'use client'` only when needed

## API Rules (Express)
1. All route handlers are `async`
2. Validate every request body with Zod (`safeParse`, not `parse`)
3. Return `{ success: boolean, data?: T, error?: string }` always
4. Use Result pattern — never throw in business logic
5. HTTP status: 200 (success), 201 (created), 400 (validation), 404 (not found), 500 (server)

## Database Rules (Prisma)
1. Prisma ORM only — no raw SQL ever
2. All models must have `createdAt` + `updatedAt` timestamps
3. Use `@relation` with explicit fields/references for foreign keys
4. Use `cuid()` for IDs
5. Import only via `@acme/db` — never import `@prisma/client` directly in apps

## Testing Rules
1. Vitest for unit/integration, Playwright for e2e
2. Co-locate tests: `foo.test.ts` next to `foo.ts`
3. Mock external deps — never hit real databases or services
4. Descriptive test names: `it('should return 400 when email is missing')`

## Commit Convention
```
type(scope): description

Types: feat, fix, chore, docs, refactor, test, perf
Scope: package name

Examples:
  feat(web): add user profile page
  fix(api): handle duplicate email error
  chore(db): add seed data for testing
```

## Import Order
```typescript
// 1. Node built-ins
import path from 'node:path';

// 2. External packages
import express from 'express';
import { z } from 'zod';

// 3. Workspace packages
import { db } from '@acme/db';
import { Button } from '@acme/ui';

// 4. Type imports
import type { Result } from '@acme/utils';
import type { User } from '@acme/db';

// 5. Relative imports
import { helper } from './utils';
```
