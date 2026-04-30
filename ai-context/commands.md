# Commands

## Monorepo-Wide
```bash
pnpm dev                              # Start all apps in dev mode
pnpm build                            # Build everything (cached by Turbo)
pnpm test                             # Run all tests
pnpm lint                             # Lint all packages
pnpm typecheck                        # Type-check all packages
```

## Per-App

### @acme/web (Next.js)
```bash
pnpm --filter @acme/web dev           # Dev server — port 3000
pnpm --filter @acme/web build         # Production build
pnpm --filter @acme/web start         # Start production server
pnpm --filter @acme/web test          # Unit tests (Vitest)
pnpm --filter @acme/web test:e2e      # E2E tests (Playwright)
pnpm --filter @acme/web typecheck     # Type-check
```

### @acme/api (Express)
```bash
pnpm --filter @acme/api dev           # Dev server with hot reload — port 4000
pnpm --filter @acme/api build         # Build for production
pnpm --filter @acme/api start         # Start production server
pnpm --filter @acme/api test          # Unit tests (Vitest)
```

### @acme/admin (Vite)
```bash
pnpm --filter @acme/admin dev         # Dev server — port 3001
pnpm --filter @acme/admin build       # Production build
pnpm --filter @acme/admin preview     # Preview production build
pnpm --filter @acme/admin test        # Unit tests (Vitest)
```

## Per-Package

### @acme/ui
```bash
pnpm --filter @acme/ui build          # Build (tsup)
pnpm --filter @acme/ui dev            # Build in watch mode
pnpm --filter @acme/ui test           # Run tests
```

### @acme/utils
```bash
pnpm --filter @acme/utils build       # Build (tsup)
pnpm --filter @acme/utils test        # Run tests
```

## Database (@acme/db)
```bash
pnpm --filter @acme/db db:generate    # Regenerate Prisma client after schema change
pnpm --filter @acme/db db:migrate     # Create + apply a new migration
pnpm --filter @acme/db db:push        # Push schema to DB (no migration file)
pnpm --filter @acme/db db:seed        # Run seed script
```

## Adding Dependencies
```bash
pnpm --filter @acme/web add zod       # Add external dep to a package
pnpm --filter @acme/web add @acme/ui  # (workspace deps use package.json workspace:*)
```
