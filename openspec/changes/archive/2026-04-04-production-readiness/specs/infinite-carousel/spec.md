## ADDED Requirements

### Requirement: Carousel items have ARIA list semantics

The carousel track element SHALL have `role="list"` and each item wrapper SHALL have `role="listitem"` and an `aria-label` equal to the item's `title`.

#### Scenario: List role is present on track

- **WHEN** the carousel is rendered
- **THEN** the scrollable track element SHALL have `role="list"`

#### Scenario: Each item has an accessible name

- **WHEN** a screen reader navigates to a carousel item
- **THEN** it SHALL announce the portfolio item's title via `aria-label`

### Requirement: Carousel supports keyboard scrolling

The carousel container SHALL accept keyboard focus (`tabIndex={0}`) and SHALL scroll left or right by one item width when `ArrowLeft` or `ArrowRight` is pressed. Default browser scroll behaviour SHALL be suppressed for these keys while the carousel is focused.

#### Scenario: ArrowRight scrolls forward

- **WHEN** the carousel is focused and `ArrowRight` is pressed
- **THEN** the carousel SHALL scroll right by one item width

#### Scenario: ArrowLeft scrolls backward

- **WHEN** the carousel is focused and `ArrowLeft` is pressed
- **THEN** the carousel SHALL scroll left by one item width

#### Scenario: Arrow keys do not scroll the page

- **WHEN** the carousel is focused and an arrow key is pressed
- **THEN** `event.preventDefault()` SHALL be called, preventing page-level scroll

### Requirement: Pinned item communicates state to assistive technology

Each carousel item button/interactive element SHALL carry `aria-pressed="true"` when it is pinned and `aria-pressed="false"` when it is not.

#### Scenario: Pinned item has aria-pressed true

- **WHEN** a carousel item is pinned
- **THEN** its interactive element SHALL have `aria-pressed="true"`

#### Scenario: Unpinned item has aria-pressed false

- **WHEN** no item is pinned or a different item is pinned
- **THEN** each non-pinned item's interactive element SHALL have `aria-pressed="false"`
