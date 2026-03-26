## ADDED Requirements

### Requirement: React component patterns are standardized

The project SHALL use consistent patterns for React components: Server Components by default, Client Components only when necessary, and compound components for complex UI.

#### Scenario: Server Component is the default

- **WHEN** a new component is created
- **THEN** it SHALL be a Server Component (no `"use client"` directive) unless it requires browser APIs, event handlers, or React state/effects

#### Scenario: Client Component is explicitly marked

- **WHEN** a component needs state, effects, or browser APIs
- **THEN** it SHALL include `"use client"` as the first line of the file

#### Scenario: Data fetching happens in Server Components

- **WHEN** a component needs external data
- **THEN** the fetch SHALL happen in a Server Component and the result passed as props to Client Components

### Requirement: Server Action patterns are standardized

The project SHALL define a consistent structure for Server Actions including validation, error handling, and cache revalidation.

#### Scenario: Server Actions validate all input with Zod

- **WHEN** a Server Action receives form data or any user input
- **THEN** it SHALL validate the input with a Zod schema before processing

#### Scenario: Server Actions revalidate affected paths

- **WHEN** a Server Action mutates data
- **THEN** it SHALL call `revalidatePath` or `revalidateTag` to invalidate affected cache entries

### Requirement: State management follows Zustand slice pattern

The project SHALL use Zustand for global client state. Each domain SHALL have its own store file. Stores SHALL use `persist` only for data that must survive page reloads.

#### Scenario: Store is scoped to a domain

- **WHEN** global client state is needed for a feature
- **THEN** a dedicated store file SHALL be created at `store/{domain}.ts`

#### Scenario: Persist is used only for user preferences and session data

- **WHEN** a store value needs to survive page reloads
- **THEN** the `persist` middleware SHALL be used with a namespaced key

### Requirement: cn() utility is used for all className composition

The project SHALL use the `cn()` utility (clsx + tailwind-merge) for all dynamic or conditional class name composition.

#### Scenario: Static single className

- **WHEN** a component has only static, unconditional classes
- **THEN** a plain string `className="..."` SHALL be used

#### Scenario: Dynamic or conditional className

- **WHEN** a component has conditional or merged class names
- **THEN** `className={cn(...)}` SHALL be used
