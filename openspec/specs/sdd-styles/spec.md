## ADDED Requirements

### Requirement: Code formatting rules are defined and enforced

The project SHALL define consistent formatting rules covering indentation, quotes, semicolons, line length, and import ordering. These rules SHALL be enforceable via Prettier and ESLint.

#### Scenario: Indentation is always 2 spaces

- **WHEN** any TypeScript, TSX, or CSS file is written
- **THEN** it SHALL use 2-space indentation (no tabs)

#### Scenario: String quotes are always double quotes

- **WHEN** any string literal is written in TypeScript or TSX
- **THEN** it SHALL use double quotes (`"`) not single quotes (`'`) — except in JSX attribute values which use double quotes natively

#### Scenario: Semicolons are omitted

- **WHEN** a TypeScript or TSX statement ends
- **THEN** it SHALL NOT use a trailing semicolon (ASI-style, enforced by Prettier)

#### Scenario: Max line length is 100 characters

- **WHEN** any line of code is written
- **THEN** it SHALL NOT exceed 100 characters in length

#### Scenario: Import ordering is enforced

- **WHEN** imports are written at the top of a file
- **THEN** they SHALL be ordered: (1) external packages, (2) internal aliases (`@/`), (3) relative paths — each group separated by a blank line

#### Scenario: Trailing commas in multi-line structures

- **WHEN** a multi-line array, object, or function parameter list is written
- **THEN** the last item SHALL have a trailing comma
