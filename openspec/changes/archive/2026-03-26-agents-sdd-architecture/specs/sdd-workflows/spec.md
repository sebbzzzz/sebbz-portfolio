## ADDED Requirements

### Requirement: Development workflow commands are documented

The project SHALL document all essential CLI commands for the development lifecycle.

#### Scenario: Developer can start local development

- **WHEN** a developer wants to run the project locally
- **THEN** they SHALL run `yarn dev` to start the Next.js development server

#### Scenario: Developer can verify code quality before committing

- **WHEN** a developer is ready to commit
- **THEN** they SHALL run `yarn typecheck`, `yarn lint:fix`, and `yarn format:write` in sequence — all must pass

#### Scenario: Developer can build for production

- **WHEN** a production build is needed
- **THEN** they SHALL run `yarn build` and resolve any type or lint errors before continuing

### Requirement: Branching strategy is defined

The project SHALL follow a consistent branching strategy to keep the main branch stable.

#### Scenario: Feature work happens on a named branch

- **WHEN** a new feature or fix is started
- **THEN** a branch SHALL be created from `main` using the format `<type>/<short-description>` (e.g., `feat/add-login-page`, `fix/broken-nav`)

#### Scenario: main branch is always deployable

- **WHEN** code is merged to `main`
- **THEN** the build, lint, and typecheck SHALL all pass — broken builds MUST NOT be merged

### Requirement: PR process is defined

The project SHALL define a consistent pull request process.

#### Scenario: PR title follows conventional commit format

- **WHEN** a PR is opened
- **THEN** the title SHALL follow `<type>[scope]: <description>` format matching the commit convention

#### Scenario: UI changes include screenshots

- **WHEN** a PR includes visual UI changes
- **THEN** before/after screenshots SHALL be attached to the PR description

#### Scenario: QA checklist is completed before merge

- **WHEN** a PR is ready for review
- **THEN** the author SHALL verify: typecheck passes, lint passes, format passes, all UI states handled, no secrets in code
