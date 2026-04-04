## ADDED Requirements

### Requirement: Page has a single h1 and correct heading hierarchy

The homepage SHALL contain exactly one `<h1>` element (the greeting in the intro panel). The info panel project title SHALL use `<h2>`. No heading levels SHALL be skipped between `<h1>` and `<h2>`.

#### Scenario: Only one h1 exists at any time

- **WHEN** the homepage is loaded (regardless of pin state)
- **THEN** exactly one `<h1>` SHALL exist in the DOM

#### Scenario: Info panel title is h2

- **WHEN** a portfolio item is pinned and the info panel is visible
- **THEN** the project title element SHALL be an `<h2>`
