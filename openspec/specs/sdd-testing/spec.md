## ADDED Requirements

### Requirement: Unit test structure and tooling are defined

The project SHALL define how unit and integration tests are written, where they live, and what tooling to use.

#### Scenario: Unit tests use Vitest

- **WHEN** a unit or integration test is written
- **THEN** it SHALL use Vitest as the test runner and assertion library

#### Scenario: Test files are co-located with source

- **WHEN** a test file is created for a module
- **THEN** it SHALL be placed next to the source file with `.test.ts` or `.test.tsx` suffix

#### Scenario: Test describes behavior, not implementation

- **WHEN** a test is written
- **THEN** the test description SHALL describe observable behavior (e.g., `"renders error message when fetch fails"`) — not internal implementation details

### Requirement: E2E test structure follows Page Object Model

The project SHALL use Playwright for E2E tests following the Page Object Model pattern.

#### Scenario: Each feature has a Page Object class

- **WHEN** E2E tests are written for a feature
- **THEN** a Page Object class SHALL be created extending `BasePage` encapsulating selectors and actions

#### Scenario: Selectors use accessible roles and labels

- **WHEN** an element is selected in a Playwright test
- **THEN** it SHALL use `getByRole`, `getByLabel`, or `getByText` — never CSS selectors or test IDs unless no accessible alternative exists

#### Scenario: Tests are tagged with feature and criticality

- **WHEN** a Playwright test is written
- **THEN** it SHALL include tags for feature scope and criticality (e.g., `{ tag: ['@critical', '@auth'] }`)

### Requirement: What to test is defined

The project SHALL define clear expectations for what requires test coverage.

#### Scenario: Server Actions are tested

- **WHEN** a Server Action is written
- **THEN** it SHALL have unit tests covering: happy path, validation failure, and unexpected error

#### Scenario: UI logic in components is tested

- **WHEN** a component contains conditional rendering or user interaction logic
- **THEN** it SHALL have unit tests covering each meaningful branch

#### Scenario: Pure utility functions are tested

- **WHEN** a pure utility function is written in `lib/`
- **THEN** it SHALL have unit tests covering all edge cases
