## ADDED Requirements

### Requirement: Carousel has semantic list structure

The carousel track SHALL have `role="list"` and each item SHALL have `role="listitem"` so screen readers announce the portfolio as a navigable list.

#### Scenario: Screen reader announces list context

- **WHEN** a screen reader focuses the carousel section
- **THEN** it SHALL announce "Portfolio projects, list, N items" or equivalent

### Requirement: Carousel is keyboard operable

The carousel container SHALL be focusable (`tabIndex={0}`) and respond to `ArrowLeft`/`ArrowRight` keys for scrolling and `Enter`/`Space` for pinning/unpinning the focused item. Default scroll behaviour SHALL be prevented when these keys are active inside the carousel.

#### Scenario: Arrow keys scroll the carousel

- **WHEN** the carousel container is focused and the user presses `ArrowRight`
- **THEN** the carousel SHALL scroll right by approximately one item width

#### Scenario: Arrow keys do not trigger page scroll

- **WHEN** the carousel container is focused and the user presses `ArrowLeft` or `ArrowRight`
- **THEN** the browser SHALL NOT scroll the page horizontally

#### Scenario: Enter/Space pins an item

- **WHEN** a carousel item is the active/focused item and the user presses `Enter` or `Space`
- **THEN** the item SHALL be pinned and the info panel SHALL appear, equivalent to a click

### Requirement: Carousel items have accessible names

Each carousel item SHALL have an `aria-label` derived from the portfolio item's `title` field so screen readers announce the item by name rather than its index.

#### Scenario: Item label is read by screen reader

- **WHEN** a screen reader navigates to a carousel item
- **THEN** it SHALL announce the item's project title

### Requirement: Pinned state is conveyed to assistive technology

When a carousel item is pinned, it SHALL carry `aria-pressed="true"` (or `aria-expanded="true"` if the info panel is treated as a disclosure). When unpinned, the attribute SHALL be `false`.

#### Scenario: Pinned item announces pressed state

- **WHEN** a carousel item is pinned
- **THEN** a screen reader SHALL announce "pressed" or "expanded" when focusing that item

### Requirement: Social link icons have alt text

Icon `<img>` elements in `SocialLinks` SHALL have a non-empty `alt` attribute that describes the destination (e.g., "LinkedIn", "GitHub", "Email").

#### Scenario: Icon alt text is read

- **WHEN** a screen reader focuses a social link
- **THEN** it SHALL announce the platform name from the icon's `alt` attribute

### Requirement: Info panel live region is properly labelled

The `CarouselItemInfoPanel` section already has `aria-live="polite"` and `aria-atomic="true"`. It SHALL also have `aria-label="Project details"` so screen readers identify the region when it becomes visible.

#### Scenario: Info panel region is identified

- **WHEN** a screen reader encounters the info panel section
- **THEN** it SHALL announce "Project details" as the region label

### Requirement: Page heading hierarchy is correct

The page SHALL have exactly one `<h1>` (the greeting heading in the intro panel). Portfolio item titles in the info panel SHALL use `<h2>`. No heading levels SHALL be skipped.

#### Scenario: Single h1 on page

- **WHEN** the page is audited for heading structure
- **THEN** there SHALL be exactly one `<h1>` element

#### Scenario: Info panel title is h2

- **WHEN** a portfolio item is pinned
- **THEN** the project title in the info panel SHALL be rendered as `<h2>`
