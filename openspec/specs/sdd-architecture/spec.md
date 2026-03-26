## ADDED Requirements

### Requirement: Project layer architecture is documented

The project SHALL document the high-level architecture showing how all layers connect, their responsibilities, and their boundaries.

#### Scenario: Architecture diagram is available in AGENTS.md

- **WHEN** a developer or AI agent reads AGENTS.md
- **THEN** they SHALL find an ASCII diagram showing the full layer stack from browser to data

#### Scenario: Each layer's responsibility is clearly defined

- **WHEN** the architecture section is read
- **THEN** each layer (App Router pages, Server Components, Client Components, Server Actions, Data Layer) SHALL have a one-line description of its responsibility and what it must NOT do

### Requirement: Layer boundaries are enforced by convention

The project SHALL define which layers may communicate with which other layers, preventing coupling violations.

#### Scenario: Client Components do not call the data layer directly

- **WHEN** a Client Component needs data
- **THEN** it SHALL receive the data as props from a Server Component or via a Server Action — it SHALL NOT import database clients or call external APIs directly

#### Scenario: Server Actions are the only mutation entry point from the client

- **WHEN** a Client Component needs to mutate data
- **THEN** it SHALL call a Server Action — it SHALL NOT make direct fetch calls to internal API routes for mutations

#### Scenario: Data layer is only accessed from Server Components or Server Actions

- **WHEN** data needs to be read from or written to a data source
- **THEN** the access SHALL happen only in Server Components or Server Actions — never in Client Components

### Requirement: Folder structure maps directly to architecture layers

The project SHALL maintain a folder structure that makes the architectural layers immediately apparent.

#### Scenario: App Router pages are in app/

- **WHEN** a new page is created
- **THEN** it SHALL be placed under `app/` following Next.js App Router conventions

#### Scenario: Server Actions are in actions/

- **WHEN** a Server Action is created
- **THEN** it SHALL be placed under `actions/{feature}/{feature}.ts`

#### Scenario: Shared types are in types/

- **WHEN** a TypeScript type or interface is used in 2 or more places
- **THEN** it SHALL be placed under `types/{domain}.ts`
