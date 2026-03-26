## ADDED Requirements

### Requirement: Forbidden React patterns are explicitly documented

The project SHALL document patterns that MUST NOT be used in React components, with a rationale for each prohibition.

#### Scenario: useMemo and useCallback are never used

- **WHEN** a component is written or reviewed
- **THEN** it SHALL NOT use `useMemo` or `useCallback` — the React Compiler handles memoization automatically

#### Scenario: React namespace is never imported

- **WHEN** React is needed in a file
- **THEN** only named imports SHALL be used (`import { useState } from "react"`) — never `import React` or `import * as React`

#### Scenario: Inline nested object types are never used

- **WHEN** a TypeScript interface or type has a property that is itself an object
- **THEN** the nested object SHALL be extracted into its own named interface

### Requirement: Forbidden TypeScript patterns are explicitly documented

The project SHALL document TypeScript anti-patterns that lead to poor type safety or maintainability.

#### Scenario: String union types are never used directly

- **WHEN** a type with a fixed set of string values is needed
- **THEN** it SHALL use `const X = { A: "a" } as const; type T = typeof X[keyof typeof X]` — never `type T = "a" | "b"`

#### Scenario: any type is never used

- **WHEN** a type is unknown or unclear
- **THEN** it SHALL use `unknown` and narrow it — never `any`

### Requirement: Forbidden styling patterns are explicitly documented

The project SHALL document CSS and Tailwind anti-patterns that break the design system.

#### Scenario: CSS var() in className is never used

- **WHEN** a dynamic value is needed in a class name
- **THEN** it SHALL use the `style` prop for runtime values — never `className="text-[var(--color)]"`

#### Scenario: Hardcoded hex colors are never used

- **WHEN** a color is applied to an element
- **THEN** it SHALL use a Tailwind color token — never a raw hex value in className or style

### Requirement: Forbidden architecture patterns are explicitly documented

The project SHALL document structural anti-patterns that violate the scope rule or layer boundaries.

#### Scenario: Business logic is never placed in components

- **WHEN** a component needs to perform data transformation or business logic
- **THEN** the logic SHALL be extracted to a utility, adapter, or server action — not inline in the component

#### Scenario: Client Components never directly fetch data

- **WHEN** a Client Component needs data
- **THEN** the data SHALL be fetched in a Server Component and passed as props — not fetched inside the Client Component with useEffect + fetch
