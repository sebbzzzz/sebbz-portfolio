## ADDED Requirements

### Requirement: Delayed appearance on hover or pin

The `CarouselItemInfoPanel` component SHALL remain hidden immediately after a portfolio item is hovered or pinned, and SHALL fade in only after a configurable delay (default 500 ms). If the item is unhovered or unpinned before the delay elapses, the panel SHALL NOT appear.

#### Scenario: Panel appears after delay

- **WHEN** the user hovers a carousel item and holds the hover for longer than `hoverRevealDelay` (500 ms)
- **THEN** the info panel SHALL fade in showing the item's title and description

#### Scenario: Rapid hover does not flash panel

- **WHEN** the user hovers an item and immediately moves away within the delay window
- **THEN** the panel SHALL NOT appear and the pending timeout SHALL be cancelled

#### Scenario: Pinned item keeps panel visible

- **WHEN** the item is pinned by a click
- **THEN** the info panel SHALL remain visible regardless of pointer position until unpinned

### Requirement: Panel displays item metadata

The panel SHALL render the `PortfolioItem`'s `title`, `description`, and — if present — a clickable `link` that opens in a new tab.

#### Scenario: Title and description are rendered

- **WHEN** the info panel is visible with a `PortfolioItem` that has title and description
- **THEN** both fields SHALL be visible in the panel

#### Scenario: Optional link renders as anchor

- **WHEN** the `PortfolioItem` has a `link` field
- **THEN** the panel SHALL render an `<a>` element with `href={link}` and `target="_blank" rel="noopener noreferrer"`

#### Scenario: No link renders no anchor

- **WHEN** the `PortfolioItem` has no `link` field
- **THEN** no `<a>` element SHALL be rendered in the panel

### Requirement: Instant hide on unhover or unpin

The panel SHALL disappear immediately (or with a short 150 ms fade-out) when the user unhovers and the item is not pinned, or when the item is unpinned.

#### Scenario: Unhover hides panel quickly

- **WHEN** the user moves the pointer off a carousel item that is not pinned
- **THEN** the info panel SHALL begin fading out within one animation frame

#### Scenario: Unpin hides panel

- **WHEN** the user clicks a pinned item to unpin it
- **THEN** the info panel SHALL fade out

### Requirement: Panel does not block carousel interaction

The info panel SHALL be positioned so it does not intercept pointer events on the carousel track. It SHALL use `pointer-events: none` on the panel container while the carousel is not pinned.

#### Scenario: Drag still works with panel visible

- **WHEN** the info panel is visible and the user drags the carousel
- **THEN** the drag SHALL succeed as if the panel were not there
