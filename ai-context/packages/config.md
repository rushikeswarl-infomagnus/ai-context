# @acme/config — Shared Configuration Package

## Quick Facts
| Key | Value |
|-----|-------|
| Package name | @acme/config |
| Workspace deps | none |
| Consumers | all packages (devDependency) |

## Exports
- `baseConfig` — ESLint base rules (strict TypeScript)
- `prettierConfig` — Prettier formatting rules

## Key Settings

### ESLint
- `@typescript-eslint/no-explicit-any: error` — no `any` anywhere
- `@typescript-eslint/explicit-function-return-type: warn` — return types encouraged
- `no-console: warn` — avoid console.log in production code

### Prettier
- Single quotes
- Semicolons
- Trailing commas (all)
- 100 char print width
- 2 space tabs

## Usage
Apps extend these in their local configs:
```javascript
const { baseConfig } = require('@acme/config');
module.exports = { ...baseConfig, /* local overrides */ };
```

## File Structure
```
src/
  index.ts      # Barrel exports
  eslint.ts     # ESLint base config
  prettier.ts   # Prettier config
```
