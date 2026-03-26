## ADDED Requirements

### Requirement: File and folder naming conventions are defined

The project SHALL use consistent naming conventions for all files and folders.

#### Scenario: Component files use PascalCase

- **WHEN** a React component file is created
- **THEN** the filename SHALL use PascalCase matching the component name (e.g., `UserCard.tsx`)

#### Scenario: Non-component files use kebab-case

- **WHEN** a utility, hook, action, type, or store file is created
- **THEN** the filename SHALL use kebab-case (e.g., `use-auth.ts`, `user-actions.ts`)

#### Scenario: Folders use kebab-case

- **WHEN** a new folder is created
- **THEN** the folder name SHALL use kebab-case (e.g., `user-profile/`, `auth-modal/`)

#### Scenario: Test files co-locate with source files

- **WHEN** a test file is created
- **THEN** it SHALL be placed next to the file under test with a `.test.ts(x)` suffix (e.g., `UserCard.test.tsx`)

### Requirement: Variable and function naming conventions are defined

The project SHALL use consistent naming conventions for variables, functions, constants, and types.

#### Scenario: Variables and functions use camelCase

- **WHEN** a variable or function is named
- **THEN** it SHALL use camelCase (e.g., `userName`, `fetchUserData`)

#### Scenario: React components use PascalCase

- **WHEN** a React component function is named
- **THEN** it SHALL use PascalCase (e.g., `UserCard`, `AuthModal`)

#### Scenario: Constants use SCREAMING_SNAKE_CASE

- **WHEN** a module-level constant with a fixed value is defined
- **THEN** it SHALL use SCREAMING_SNAKE_CASE (e.g., `BASE_STYLES`, `MAX_RETRIES`)

#### Scenario: Boolean variables use is/has/can prefix

- **WHEN** a boolean variable is named
- **THEN** it SHALL be prefixed with `is`, `has`, or `can` (e.g., `isLoading`, `hasError`, `canSubmit`)

### Requirement: Commit message conventions are defined

The project SHALL use conventional commit format for all commit messages.

#### Scenario: Commit message follows conventional format

- **WHEN** a commit is created
- **THEN** the message SHALL follow `<type>[scope]: <description>` format (e.g., `feat(auth): add login page`)

#### Scenario: Commit type is one of the defined set

- **WHEN** a commit type is chosen
- **THEN** it SHALL be one of: `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

#### Scenario: Commit description is lowercase and imperative

- **WHEN** the commit description is written
- **THEN** it SHALL start with a lowercase letter and use imperative mood (e.g., `add`, `fix`, `remove` — not `added`, `fixes`)
