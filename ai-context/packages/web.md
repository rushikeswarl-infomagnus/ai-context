# @acme/web — Next.js 15 Web App

## Quick Facts
| Key | Value |
|-----|-------|
| Package name | @acme/web |
| Framework | Next.js 15 (App Router) |
| Port | 3000 |
| Workspace deps | @acme/ui, @acme/db, @acme/utils |
| Entry | src/app/page.tsx |

## Rendering Model
- **Server components by default.** Every `.tsx` in `src/app/` is a server component unless marked otherwise.
- Add `'use client'` only when the component needs: `useState`, `useEffect`, event handlers (`onClick`, `onChange`), or browser APIs (`window`, `document`).
- Never add `'use client'` to `page.tsx` or `layout.tsx` unless absolutely necessary.
- Never import `@acme/db` in a `'use client'` component.

## App Router File Conventions
| File | Purpose |
|------|---------|
| `page.tsx` | Route page (required per route) |
| `layout.tsx` | Shared layout wrapping child pages |
| `loading.tsx` | Streaming/suspense loading UI |
| `error.tsx` | Error boundary (`'use client'` required here) |
| `not-found.tsx` | Custom 404 page |
| `route.ts` | API route handler (in `src/app/api/`) |

Route groups: `(groupName)/` for organization without affecting URL path.

## Data Fetching
- **Server components:** Import `db` from `@acme/db` and query Prisma directly.
- **Client components:** Fetch from Next.js API routes (`/api/...`).
- **Never** call the Express API (port 4000) from server components — use `@acme/db` directly.

## File Structure
```
src/
  app/                    # App Router
    page.tsx              # Home page (server component)
    layout.tsx            # Root layout
    globals.css           # Tailwind global styles
    api/                  # API route handlers (client-facing)
    (auth)/               # Auth route group
  components/             # App-specific client components
  hooks/                  # Custom React hooks
  lib/                    # App-specific utilities
e2e/                      # Playwright e2e tests
```

## Imports
```typescript
import { Button } from '@acme/ui';
import { db } from '@acme/db';              // Server components only
import { formatDate } from '@acme/utils';
import type { User } from '@acme/db';
```

## Styling
- Tailwind CSS 4 utility classes only
- Global styles in `src/app/globals.css`
- No CSS modules, styled-components, or inline `style` objects

## Commands
```bash
pnpm --filter @acme/web dev        # port 3000
pnpm --filter @acme/web build
pnpm --filter @acme/web test
pnpm --filter @acme/web test:e2e
```
