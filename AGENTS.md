# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms.
- Component docs override this file when guidance conflicts.

## Table of Contents

1. [Project Context](#project-context)
2. [Available Skills](#available-skills)
3. [Architecture](#architecture)
4. [Styles](#styles)
5. [Conventions](#conventions)
6. [Patterns](#patterns)
7. [Anti-patterns](#anti-patterns)
8. [Workflows](#workflows)
9. [Testing](#testing)

---

# Project Context

This repository is a Portfolio project built with Next.js 15, React 19 and Tailwind CSS 4. It follows modern best practices for TypeScript types, React components, styling, and state management. The structure is designed for scalability and maintainability.

**Tech stack:** Next.js 15.5.9 | React 19.2.2 | Tailwind 4.1.13

---

## Available Skills

Use these skills for detailed patterns on-demand:

> **Skills Reference**: For detailed patterns, use these skills:
>
> - [`typescript`](./.claude/skills/typescript/SKILL.md) - Const types, flat interfaces
> - [`react-19`](../skills/react-19/SKILL.md) - No useMemo/useCallback, compiler
> - [`nextjs-15`](../skills/nextjs-15/SKILL.md) - App Router, Server Actions
> - [`tailwind-4`](../skills/tailwind-4/SKILL.md) - cn() utility, no var() in className
> - [`playwright`](../skills/playwright/SKILL.md) - Page Object Model, selectors
> - [`find-skills`](../skills/find-skills/SKILL.md) - Search for AI agent skills

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                                                    | Skill         |
| --------------------------------------------------------- | ------------- |
| App Router / Server Actions                               | `nextjs-15`   |
| Working with Tailwind classes                             | `tailwind-4`  |
| Writing Playwright E2E tests                              | `playwright`  |
| Writing React components                                  | `react-19`    |
| Writing TypeScript types/interfaces                       | `typescript`  |
| Searching for patterns or best practices for new features | `find-skills` |

### Skill Maintenance

- ALWAYS: When a new skill is installed or created, update both the **Available Skills** reference list and the **Auto-invoke Skills** table above (add an auto-invoke rule if the skill maps to a recurring action).
- ALWAYS: Keep skill paths up to date if files are moved or renamed.

---

## Architecture

High-level view of how the project layers connect:

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│         (Client Components, Zustand)             │
└────────────────────┬────────────────────────────┘
                     │ user interaction / form submit
┌────────────────────▼────────────────────────────┐
│              Next.js App Router                  │
│   app/ — pages, layouts, route handlers          │
│   Responsibility: routing, page composition       │
│   NEVER: business logic, direct DB access         │
└──────────┬──────────────────────┬────────────────┘
           │ render               │ Server Action call
┌──────────▼──────────┐  ┌───────▼────────────────┐
│  Server Components  │  │    Server Actions        │
│  app/, features/    │  │    actions/{feature}/    │
│  Fetch data, pass   │  │    Validate → mutate →   │
│  props to clients   │  │    revalidate            │
│  NEVER: useState,   │  │    NEVER: render JSX     │
│  useEffect, events  │  │                          │
└──────────┬──────────┘  └───────┬────────────────┘
           │ props               │ read/write
┌──────────▼──────────┐  ┌───────▼────────────────┐
│  Client Components  │  │      Data Layer          │
│  "use client" files │  │  External APIs, DB,      │
│  State, events,     │  │  fetch(), ORM            │
│  browser APIs       │  │  NEVER: called from      │
│  NEVER: fetch data  │  │  Client Components       │
│  directly           │  │                          │
└─────────────────────┘  └────────────────────────┘
```

### Layer Responsibilities

| Layer             | Responsibility                          | Must NOT                                          |
| ----------------- | --------------------------------------- | ------------------------------------------------- |
| App Router pages  | Routing, layout, page composition       | Contain business logic or direct DB access        |
| Server Components | Fetch data, pass props                  | Use useState, useEffect, or handle events         |
| Client Components | State, events, browser APIs             | Fetch data directly or import DB clients          |
| Server Actions    | Validate input, mutate data, revalidate | Render JSX or be called from other Server Actions |
| Data Layer        | Read/write to external data sources     | Be imported in Client Components                  |

### Folder-to-Layer Mapping

| Folder                           | Layer                                     |
| -------------------------------- | ----------------------------------------- |
| `app/`                           | App Router pages & layouts                |
| `app/(auth)/`                    | Auth-scoped pages                         |
| `actions/{feature}/`             | Server Actions                            |
| `components/{domain}/`           | Shared Client/Server Components (2+ uses) |
| `features/{feature}/components/` | Feature-local components (1 use)          |
| `store/`                         | Zustand client state                      |
| `hooks/`                         | Shared React hooks (2+ uses)              |
| `lib/`                           | Shared utilities (2+ uses)                |
| `types/`                         | Shared TypeScript types (2+ uses)         |
| `styles/`                        | Global CSS                                |

### Scope Rule (ABSOLUTE)

```
Used 2+ places → lib/ or types/ or hooks/ (components go in components/{domain}/)
Used 1 place   → keep local in feature directory
```

---

## Styles

Enforced by Prettier + ESLint. Run `yarn format:write` and `yarn lint:fix` to auto-fix.

### Formatting Rules

| Rule            | Value                |
| --------------- | -------------------- |
| Indentation     | 2 spaces (no tabs)   |
| Quotes          | Double quotes `"`    |
| Semicolons      | None (ASI)           |
| Max line length | 100 characters       |
| Trailing commas | Always in multi-line |

### Import Ordering

ALWAYS order imports in this sequence, each group separated by a blank line:

```typescript
// 1. External packages
import { useState } from "react"
import { z } from "zod"

// 2. Internal aliases (@/)
import { cn } from "@/lib/utils"
import { UserCard } from "@/components/user/UserCard"

// 3. Relative paths
import { formatDate } from "./utils"
import type { UserProps } from "./types"
```

### Quotes in Practice

- TypeScript / TSX string literals: `"double quotes"`
- JSX attribute values: `className="bg-slate-800"` (double by default)
- NEVER: single quotes `'like this'` in TS/TSX

---

## Conventions

### File & Folder Naming

| Type                               | Convention | Example                          |
| ---------------------------------- | ---------- | -------------------------------- |
| React component file               | PascalCase | `UserCard.tsx`                   |
| Hook, utility, action, type, store | kebab-case | `use-auth.ts`, `user-actions.ts` |
| Folder                             | kebab-case | `user-profile/`, `auth-modal/`   |
| Test file                          | co-located | `UserCard.test.tsx`              |

### Variable & Function Naming

| Type                        | Convention           | Example                              |
| --------------------------- | -------------------- | ------------------------------------ |
| Variables, functions        | camelCase            | `userName`, `fetchUserData`          |
| React components            | PascalCase           | `UserCard`, `AuthModal`              |
| Module-level constants      | SCREAMING_SNAKE_CASE | `BASE_STYLES`, `MAX_RETRIES`         |
| Boolean variables           | is/has/can prefix    | `isLoading`, `hasError`, `canSubmit` |
| TypeScript types/interfaces | PascalCase           | `UserProps`, `AuthState`             |

### Commit Messages

Follow conventional-commit style: `<type>[scope]: <description>`

**Valid types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

**Rules:**

- Description starts lowercase, imperative mood: `add`, `fix`, `remove` — not `added`, `fixes`
- Example: `feat(auth): add login page`, `fix(nav): resolve broken link`

---

## Patterns

### React Components

**Server Component (default — no directive needed):**

```typescript
export default async function Page() {
  const data = await fetchData()
  return <ClientComponent data={data} />
}
```

**Client Component (only when state/events/browser APIs needed):**

```typescript
"use client"

import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Data fetching flow — Server fetches, passes to Client:**

```typescript
// Server Component
export default async function UserProfile({ id }: { id: string }) {
  const user = await getUser(id)
  return <UserCard user={user} />  // UserCard is "use client"
}
```

### Server Action

```typescript
"use server"

export async function updateUser(formData: FormData) {
  const validated = schema.parse(Object.fromEntries(formData))
  await updateDB(validated)
  revalidatePath("/users")
}
```

### Form + Validation (Zod 4 + react-hook-form + Server Action)

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  email: z.email(), // Zod 4: z.email() not z.string().email()
  id: z.uuid(), // Zod 4: z.uuid() not z.string().uuid()
})

const form = useForm({ resolver: zodResolver(schema) })
```

### Zustand Store

```typescript
const useStore = create(
  persist(
    (set) => ({
      value: 0,
      increment: () => set((s) => ({ value: s.value + 1 })),
    }),
    { name: "store-key" },
  ),
)
```

### className Composition

```typescript
// Static — plain string
className="bg-slate-800 text-white"

// Dynamic — always use cn()
className={cn(BASE_STYLES, isActive && "ring-2 ring-blue-500")}

// Runtime value — style prop
style={{ width: `${progress}%` }}
```

### TypeScript Types

```typescript
// ALWAYS: const object + derived type
const Status = { Active: "active", Inactive: "inactive" } as const
type Status = (typeof Status)[keyof typeof Status]

// ALWAYS: flat interfaces, no inline nesting
interface UserProps {
  user: User
}
interface User {
  id: string
  address: Address
}
interface Address {
  street: string
  city: string
}
```

---

## Anti-patterns

### React — NEVER

| Anti-pattern                                            | Reason                                                 |
| ------------------------------------------------------- | ------------------------------------------------------ |
| `useMemo(...)`, `useCallback(...)`                      | React Compiler handles memoization automatically       |
| `import React from "react"`                             | Not needed in React 19; use named imports only         |
| `import * as React from "react"`                        | Same as above                                          |
| Client Component fetching data with `useEffect + fetch` | Creates waterfalls; fetch in Server Components instead |
| Business logic inline in components                     | Extract to `lib/`, adapter, or Server Action           |

### TypeScript — NEVER

| Anti-pattern               | Use instead                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| `type T = "a" \| "b"`      | `const X = { A: "a", B: "b" } as const; type T = typeof X[keyof typeof X]` |
| `any`                      | `unknown` + type narrowing                                                 |
| Inline nested object types | Dedicated interface per level, reuse via `extends`                         |

### Styling — NEVER

| Anti-pattern                       | Use instead                                   |
| ---------------------------------- | --------------------------------------------- |
| `className="text-[var(--color)]"`  | `style={{ color: "..." }}` for runtime values |
| Hex colors in className or style   | Tailwind color tokens                         |
| Conditional classes without `cn()` | `className={cn(...)}`                         |

### Architecture — NEVER

| Anti-pattern                                                  | Reason                                                  |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| Client Component imports DB client or fetches raw API         | Layer boundary violation                                |
| Direct `fetch()` to internal routes for mutations from client | Use Server Actions instead                              |
| Types/utils/hooks used in 2+ places kept local                | Violates scope rule; move to `types/`, `lib/`, `hooks/` |

---

## Workflows

### Development Commands

```bash
yarn dev            # Start development server
yarn build          # Build for production
yarn lint           # Run ESLint
yarn lint:fix       # Fix ESLint issues
yarn format         # Check code formatting
yarn format:write   # Auto-format code
yarn typecheck      # Run TypeScript type checking
```

### Branching Strategy

- ALWAYS: branch from `main` using `<type>/<short-description>` (e.g., `feat/add-login-page`, `fix/broken-nav`)
- ALWAYS: `main` must be deployable at all times — broken builds MUST NOT be merged
- NEVER: commit directly to `main`

### PR Process

1. Run `yarn typecheck && yarn lint:fix && yarn format:write` — all must pass
2. PR title follows commit convention: `feat(scope): description`
3. Attach before/after screenshots for any UI changes
4. Link to the relevant issue or change (if applicable)

### QA Checklist Before Commit

- [ ] `yarn typecheck` passes
- [ ] `yarn lint:fix` passes
- [ ] `yarn format:write` passes
- [ ] All UI states handled (loading, error, empty)
- [ ] No secrets in code (use `.env.local`)
- [ ] Error messages sanitized
- [ ] Server-side validation present

---

## Testing

### Unit Tests (Vitest)

- ALWAYS: co-locate test files next to source — `UserCard.test.tsx` beside `UserCard.tsx`
- ALWAYS: describe observable behavior, not implementation — `"renders error message when fetch fails"`
- NEVER: test implementation details (internal function calls, state shape)

**What requires unit tests:**

| What                     | Coverage expected                                |
| ------------------------ | ------------------------------------------------ |
| Server Actions           | Happy path, validation failure, unexpected error |
| Components with UI logic | Each conditional rendering branch                |
| Pure utilities in `lib/` | All edge cases                                   |

### E2E Tests (Playwright — Page Object Model)

```typescript
export class FeaturePage extends BasePage {
  readonly submitBtn = this.page.getByRole("button", { name: "Submit" })
  async goto() {
    await super.goto("/path")
  }
  async submit() {
    await this.submitBtn.click()
  }
}

test("action works", { tag: ["@critical", "@feature"] }, async ({ page }) => {
  const p = new FeaturePage(page)
  await p.goto()
  await p.submit()
  await expect(page).toHaveURL("/expected")
})
```

**Playwright rules:**

- ALWAYS: use `getByRole`, `getByLabel`, `getByText` for selectors — never CSS selectors or data-testid unless no accessible alternative exists
- ALWAYS: tag tests with feature scope and criticality: `@critical`, `@feature-name`
- ALWAYS: each feature gets its own Page Object class extending `BasePage`
