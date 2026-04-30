# @acme/admin — React Admin Dashboard

## Quick Facts
| Key | Value |
|-----|-------|
| Package name | @acme/admin |
| Framework | React 19 SPA (Vite) |
| Port | 3001 |
| Workspace deps | @acme/ui, @acme/utils |
| Entry | src/main.tsx → src/App.tsx |

## Key Rules
- Standard React SPA — **no server components, no SSR**.
- **No direct database access.** Never import `@acme/db`.
- All data comes from the API: `http://localhost:4000/api/`
- Use `@acme/ui` for shared components.
- Tailwind CSS for all styling.

## Data Fetching
```typescript
const response = await fetch('http://localhost:4000/api/users');
const { success, data, error } = await response.json();
```

## File Structure
```
src/
  App.tsx          # Root component
  main.tsx         # Vite entry point (renders App)
  components/      # Admin-specific components
  pages/           # Page-level components
  hooks/           # Custom hooks (data fetching)
  lib/             # API client helpers
```

## Commands
```bash
pnpm --filter @acme/admin dev      # port 3001
pnpm --filter @acme/admin build
pnpm --filter @acme/admin test
```
