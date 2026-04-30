---
applyTo: "packages/ui/**"
---

# @acme/ui — Shared React Component Library

## Package Context
- **Name:** @acme/ui
- **Consumers:** @acme/web, @acme/admin
- **No workspace dependencies** — this is a leaf package

## Component Rules
- Every component is a `const` arrow function with explicit `: JSX.Element` return type.
- Define a `Props` type directly above the component (not inline).
- Components must be **client-agnostic** — no `'use client'` directives in this package.
- Tailwind CSS classes only — no inline styles, CSS modules, or styled-components.
- Named exports only: `export const Button = ...`

## Component Template
```tsx
import type { ReactNode } from 'react';

type CardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export const Card = ({ title, children, className = '' }: CardProps): JSX.Element => {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
};
```

## Adding a New Component
1. Create `src/components/MyComponent.tsx`
2. Write the component with Props type
3. Add `export { MyComponent } from './components/MyComponent';` to `src/index.ts`
4. Add `export type { MyComponentProps } from './components/MyComponent';` to `src/index.ts`
5. Create `src/components/MyComponent.test.tsx` with co-located tests

## Barrel Exports
All public components and types must be exported from `src/index.ts`:
```typescript
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
```

## File Structure
```
src/
  index.ts                 # Barrel exports (public API)
  components/
    Button.tsx             # Component
    Button.test.tsx        # Co-located test
```

## Commands
```
pnpm --filter @acme/ui build      # Build (tsup)
pnpm --filter @acme/ui dev        # Build in watch mode
pnpm --filter @acme/ui test       # Run tests
```
