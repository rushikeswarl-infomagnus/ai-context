---
applyTo: "apps/web/**"
---

# @acme/web — Next.js 15 Web App

## Package Context
- **Name:** @acme/web | **Port:** 3000
- **Framework:** Next.js 15 with App Router
- **Dependencies:** @acme/ui, @acme/db, @acme/utils

## Rendering Rules
- Use **server components by default**. Every `.tsx` in `src/app/` is a server component unless marked otherwise.
- Only add `'use client'` when the component needs: `useState`, `useEffect`, event handlers (`onClick`, `onChange`), or browser APIs.
- Never add `'use client'` to page.tsx or layout.tsx unless absolutely necessary.

## File Conventions (App Router)
- `page.tsx` — route page component
- `layout.tsx` — shared layout (wraps child pages)
- `loading.tsx` — streaming loading UI
- `error.tsx` — error boundary (`'use client'` required)
- `not-found.tsx` — 404 page
- Route groups: `(groupName)/` for organization without affecting URL

## Data Fetching
- **Server components:** Import `db` from `@acme/db` and query directly — no API calls needed.
- **Client components:** Use `fetch('/api/...')` to hit Next.js API route handlers under `src/app/api/`.
- Never import `@acme/db` in a `'use client'` component.

## File Structure
```
src/
  app/                    # App Router
    page.tsx              # Home page (server component)
    layout.tsx            # Root layout
    globals.css           # Global Tailwind styles
    api/                  # API route handlers
    (auth)/               # Auth route group
  components/             # App-specific client components
  hooks/                  # Custom React hooks
  lib/                    # App utilities
e2e/                      # Playwright e2e tests
```

## Imports
```typescript
import { Button } from '@acme/ui';          // Shared components
import { db } from '@acme/db';              // Server-side only
import { formatDate } from '@acme/utils';   // Utilities
import type { User } from '@acme/db';       // Type imports
```

## Styling
- Tailwind CSS 4 utility classes only.
- No CSS modules, styled-components, or inline style objects.
- Global styles in `src/app/globals.css`.

## Commands
```
pnpm --filter @acme/web dev        # Dev server (port 3000)
pnpm --filter @acme/web build      # Production build
pnpm --filter @acme/web test       # Unit tests (Vitest)
pnpm --filter @acme/web test:e2e   # E2E tests (Playwright)
```
