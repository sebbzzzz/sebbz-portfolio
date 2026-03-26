## 1. Architecture Section

- [x] 1.1 Add Architecture section to AGENTS.md with ASCII layer diagram (Browser → App Router → Server Components → Client Components → Server Actions → Data Layer)
- [x] 1.2 Document each layer's responsibility and forbidden cross-layer calls
- [x] 1.3 Add folder-to-layer mapping table showing which directories belong to which layer

## 2. Styles Section

- [x] 2.1 Add Styles section to AGENTS.md covering indentation (2 spaces), quotes (double), semicolons (none)
- [x] 2.2 Document max line length (100 chars), trailing commas, and import ordering rules
- [x] 2.3 Verify Prettier config in repo matches defined rules; update if needed

## 3. Conventions Section

- [x] 3.1 Add Conventions section to AGENTS.md with file naming rules (PascalCase for components, kebab-case for others)
- [x] 3.2 Document variable naming rules (camelCase, PascalCase for components, SCREAMING_SNAKE_CASE for constants, is/has/can for booleans)
- [x] 3.3 Document commit message convention (`<type>[scope]: <description>`) with all valid types

## 4. Patterns Section

- [x] 4.1 Add Patterns section to AGENTS.md consolidating existing patterns (Server Component, Server Action, Zustand, cn())
- [x] 4.2 Add pattern for data fetching flow: Server Component fetches → passes as props to Client Component
- [x] 4.3 Add pattern for form handling with react-hook-form + Zod 4 + Server Action

## 5. Anti-patterns Section

- [x] 5.1 Add Anti-patterns section to AGENTS.md listing all forbidden React patterns (useMemo, useCallback, React namespace import)
- [x] 5.2 Document forbidden TypeScript patterns (string union types, any)
- [x] 5.3 Document forbidden styling patterns (var() in className, hex colors)
- [x] 5.4 Document forbidden architecture patterns (business logic in components, Client Components fetching data directly)

## 6. Workflows Section

- [x] 6.1 Add Workflows section to AGENTS.md with development commands table (yarn dev, build, lint, typecheck, format)
- [x] 6.2 Document branching strategy (`<type>/<short-description>` from main)
- [x] 6.3 Document PR process (title format, screenshot requirement, QA checklist)

## 7. Testing Rules Section

- [x] 7.1 Add Testing section to AGENTS.md with unit test rules (Vitest, co-location, behavior-focused descriptions)
- [x] 7.2 Document E2E test rules (Playwright, Page Object Model, accessible selectors, tagging)
- [x] 7.3 Document what requires test coverage (Server Actions, component UI logic, pure utilities)

## 8. Final Review

- [x] 8.1 Add a Table of Contents at the top of AGENTS.md linking to all sections
- [x] 8.2 Review the full AGENTS.md for consistency, remove duplicate rules subsumed by new sections
- [x] 8.3 Run `yarn typecheck && yarn lint:fix && yarn format:write` to confirm no regressions
