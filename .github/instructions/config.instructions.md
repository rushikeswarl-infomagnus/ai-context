---
applyTo: "packages/config/**"
---

# @acme/config — Shared Configuration Package

## Package Context
- **Name:** @acme/config
- **Purpose:** Shared ESLint, Prettier, and TypeScript configurations
- **Consumers:** All packages extend these configs

## Exports
- `baseConfig` — ESLint base configuration (strict TypeScript rules)
- `prettierConfig` — Prettier formatting rules

## Usage
Apps and packages extend these configs in their local config files:
```javascript
// In an app's .eslintrc.js
const { baseConfig } = require('@acme/config');
module.exports = { ...baseConfig, /* overrides */ };
```

## Key Settings
- ESLint: `@typescript-eslint/no-explicit-any: error` (enforced across monorepo)
- ESLint: `@typescript-eslint/explicit-function-return-type: warn`
- Prettier: single quotes, semicolons, trailing commas, 100 char width
