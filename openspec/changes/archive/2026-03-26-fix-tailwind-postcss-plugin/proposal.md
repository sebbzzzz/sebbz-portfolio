## Why

The build is failing because Tailwind CSS v4 moved its PostCSS plugin to a separate package (`@tailwindcss/postcss`), but the project's PostCSS config still references `tailwindcss` directly. This must be fixed for the app to build.

## What Changes

- Install `@tailwindcss/postcss` package
- Update `postcss.config.*` to use `@tailwindcss/postcss` instead of `tailwindcss` as the PostCSS plugin

## Capabilities

### New Capabilities

<!-- None — this is a dependency/config fix, no new capabilities introduced -->

### Modified Capabilities

<!-- None — no spec-level behavior changes -->

## Impact

- `postcss.config.js` / `postcss.config.mjs` (whichever exists)
- `package.json` / `yarn.lock` (new dev dependency `@tailwindcss/postcss`)
- Build pipeline: resolves the PostCSS error blocking `app/globals.scss` compilation
