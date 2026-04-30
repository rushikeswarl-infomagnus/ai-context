# @acme/ui — Shared React Component Library

## Quick Facts
| Key | Value |
|-----|-------|
| Package name | @acme/ui |
| Type | React component library |
| Workspace deps | none (leaf package) |
| Consumers | @acme/web, @acme/admin |
| Build | tsup |

## Component Rules
1. `const` arrow function with explicit `: JSX.Element` return type
2. Props type defined directly above the component
3. **Client-agnostic** — no `'use client'` directives in this package
4. Tailwind CSS classes only
5. Named exports only
6. Co-locate tests: `Button.test.tsx` next to `Button.tsx`

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
2. Define Props type + component
3. Add to `src/index.ts`:
   ```typescript
   export { MyComponent } from './components/MyComponent';
   export type { MyComponentProps } from './components/MyComponent';
   ```
4. Create `src/components/MyComponent.test.tsx`

## Current Exports
- `Button` / `ButtonProps`

## File Structure
```
src/
  index.ts                 # Barrel exports
  components/
    Button.tsx
    Button.test.tsx
```

## Commands
```bash
pnpm --filter @acme/ui build
pnpm --filter @acme/ui dev     # watch mode
pnpm --filter @acme/ui test
```
