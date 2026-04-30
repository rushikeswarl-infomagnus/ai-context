---
applyTo: "libs/utils/**"
---

# @acme/utils — Shared Utility Library

## Package Context
- **Name:** @acme/utils
- **Consumers:** All apps (@acme/web, @acme/api, @acme/admin)
- **No workspace dependencies** — this is a leaf package

## Rules
- **Pure functions only** — no side effects, no state, no I/O, no database calls.
- Every function must have explicit parameter types and return type.
- Named exports only. Barrel-export everything from `src/index.ts`.
- Co-locate tests: `string-helpers.test.ts` next to `string-helpers.ts`.

## Result Pattern (the most important export)
```typescript
export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const err = <E = string>(error: E): Result<never, E> => ({ ok: false, error });
```

This is used across the entire monorepo for error handling instead of try/catch.

## Available Exports
- `Result<T, E>` — discriminated union type for success/failure
- `ok(data)` — create success result
- `err(error)` — create failure result
- `formatDate(date, locale?)` — format Date to localized string
- `slugify(text)` — convert text to URL slug
- `truncate(text, maxLength)` — truncate with ellipsis

## File Structure
```
src/
  index.ts             # Barrel exports
  result.ts            # Result type + ok/err helpers
  string-helpers.ts    # String utility functions
```

## Commands
```
pnpm --filter @acme/utils build   # Build (tsup)
pnpm --filter @acme/utils test    # Run tests
```
