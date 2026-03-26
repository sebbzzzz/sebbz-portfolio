## ADDED Requirements

### Requirement: PostCSS uses Tailwind v4 plugin package
The build system SHALL use `@tailwindcss/postcss` as the PostCSS plugin for Tailwind CSS, not `tailwindcss` directly.

#### Scenario: Build succeeds with globals.scss
- **WHEN** the Next.js build processes `app/globals.scss`
- **THEN** PostCSS runs without error and Tailwind styles are applied correctly

#### Scenario: postcss.config references correct package
- **WHEN** the PostCSS config is loaded
- **THEN** it SHALL reference `@tailwindcss/postcss` as the Tailwind plugin key, not `tailwindcss`
