---
applyTo: "apps/admin/**"
---

# @acme/admin — React Admin Dashboard

## Package Context
- **Name:** @acme/admin | **Port:** 3001
- **Framework:** React 19 SPA via Vite
- **Dependencies:** @acme/ui, @acme/utils

## Key Rules
- Standard React SPA — no server components, no SSR.
- **No direct database access.** All data comes from the API: `http://localhost:4000/api/`
- Never import `@acme/db` in this package.
- Use `@acme/ui` for shared components — don't duplicate.
- Tailwind CSS for all styling.

## Data Fetching
```typescript
// Use fetch to call the API server
const response = await fetch('http://localhost:4000/api/users');
const { success, data, error } = await response.json();
```

## File Structure
```
src/
  App.tsx          # Root component
  main.tsx         # Vite entry point
  components/      # Admin-specific components
  pages/           # Page-level components
  hooks/           # Custom hooks (data fetching, etc.)
  lib/             # API client helpers
```

## Commands
```
pnpm --filter @acme/admin dev      # Dev server (port 3001)
pnpm --filter @acme/admin build    # Production build
pnpm --filter @acme/admin test     # Unit tests
```
