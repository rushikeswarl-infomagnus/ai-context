---
applyTo: "**/*.test.{ts,tsx}"
---

# Testing Conventions

## Framework
- **Unit/Integration:** Vitest
- **E2E:** Playwright (in `apps/*/e2e/`)

## File Placement
- Co-locate tests next to source: `Button.tsx` → `Button.test.tsx`
- Name pattern: `{source-file}.test.{ts,tsx}`
- E2E tests in `apps/*/e2e/*.spec.ts`

## Test Structure
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('functionName', () => {
  it('should return ok result for valid input', () => {
    const result = functionName(validInput);
    expect(result.ok).toBe(true);
    expect(result.data).toEqual(expected);
  });

  it('should return error for invalid input', () => {
    const result = functionName(invalidInput);
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## Mocking
- Mock external dependencies — never hit real databases or APIs in unit tests.
- Use `vi.mock()` for module mocking.
- Mock `@acme/db` when testing API routes:
  ```typescript
  vi.mock('@acme/db', () => ({
    db: {
      user: {
        findMany: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue({ id: '1', email: 'test@test.com' }),
      },
    },
  }));
  ```

## Naming Conventions
- Use descriptive names: `it('should return 400 when email is missing')`
- Group by function/component with `describe()`
- Test both success and failure paths

## Commands
```
pnpm test                           # All tests across monorepo
pnpm --filter @acme/api test        # Tests for one package
pnpm --filter @acme/web test:e2e    # E2E tests for web app
```
