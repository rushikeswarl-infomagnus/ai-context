# @acme/utils — Shared Utility Library

## Quick Facts
| Key | Value |
|-----|-------|
| Package name | @acme/utils |
| Type | Utility library |
| Workspace deps | none (leaf package) |
| Consumers | all apps |
| Build | tsup |

## Rules
- **Pure functions only** — no side effects, no state, no I/O
- Explicit return types on all functions
- Named exports, barrel-exported from `src/index.ts`
- Co-locate tests next to source

## Exports

### Result Pattern
```typescript
type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });
const err = <E = string>(error: E): Result<never, E> => ({ ok: false, error });
```

### String Helpers
```typescript
formatDate(date: Date, locale?: string): string   // → "March 31, 2026"
slugify(text: string): string                      // → "my-blog-post"
truncate(text: string, maxLength: number): string  // → "Long text..."
```

## File Structure
```
src/
  index.ts             # Barrel exports
  result.ts            # Result<T, E>, ok(), err()
  string-helpers.ts    # formatDate, slugify, truncate
```

## Commands
```bash
pnpm --filter @acme/utils build
pnpm --filter @acme/utils test
```
