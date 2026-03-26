## Context

The project uses Tailwind CSS v4 with Next.js 15 and SCSS. Tailwind v4 extracted its PostCSS integration into a separate package (`@tailwindcss/postcss`). The current `postcss.config.js` still references `tailwindcss` as a plugin key, which throws a hard build error when processing `app/globals.scss`.

## Goals / Non-Goals

**Goals:**
- Resolve the PostCSS build error so `app/globals.scss` compiles
- Align PostCSS config with Tailwind v4 package structure

**Non-Goals:**
- Upgrading or downgrading Tailwind CSS itself
- Changing any Tailwind configuration or utility usage
- Modifying SCSS or global styles

## Decisions

**Use `@tailwindcss/postcss` as the PostCSS plugin key**
- Tailwind v4 requires it; the old `tailwindcss` key no longer works as a PostCSS plugin
- No alternatives — this is the mandated migration path per Tailwind v4 docs

**Keep `autoprefixer` in place**
- It remains a valid and independent PostCSS plugin; no reason to remove it

## Risks / Trade-offs

- [Low risk] The change is a one-line config swap plus a dependency install — no logic changes
- [Rollback] Reverting means pinning back to Tailwind v3 or using the legacy plugin setup; not recommended
