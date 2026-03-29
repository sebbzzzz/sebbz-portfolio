## MODIFIED Requirements

### Requirement: Infinite horizontal loop

The carousel SHALL display items in a continuously looping horizontal track. When the user scrolls past the last item, the view SHALL seamlessly wrap to the beginning without a visible jump, and vice versa.

#### Scenario: Scroll past last item wraps to start

- **WHEN** the carousel scroll position reaches the end of the last clone set
- **THEN** the scroll offset is silently repositioned to the equivalent position in the center track, with no visible layout shift

#### Scenario: Scroll past first item wraps to end

- **WHEN** the carousel scroll position goes before the first item in the center track
- **THEN** the scroll offset is silently repositioned to the equivalent position in the last clone set, with no visible layout shift

### Requirement: Momentum drag interaction

The carousel SHALL respond to pointer drag (mouse and touch) with physics-based momentum. Drag velocity at pointer-up SHALL determine the post-release deceleration distance and direction.

#### Scenario: Slow drag stops near release point

- **WHEN** the user drags slowly and releases the pointer
- **THEN** the carousel decelerates quickly and stops within a short distance of the release point

#### Scenario: Fast fling scrolls further

- **WHEN** the user drags quickly and releases the pointer
- **THEN** the carousel continues scrolling in the drag direction with higher momentum and decelerates gradually to a stop

#### Scenario: Drag outside element boundary continues tracking

- **WHEN** the user initiates a drag and moves the pointer outside the carousel bounds before releasing
- **THEN** the carousel SHALL continue tracking the drag and apply the final velocity on pointer-up

### Requirement: Velocity cap

The carousel SHALL cap the maximum fling velocity to prevent runaway scrolling.

#### Scenario: Extremely fast drag is capped

- **WHEN** the user drags faster than the maximum allowed velocity (3000 px/s)
- **THEN** the resulting fling velocity SHALL be clamped to the maximum, not exceed it

### Requirement: Hover state callback

The carousel SHALL emit the index of the currently hovered item (or `null` when no item is hovered) via an `onHoverChange` callback prop.

#### Scenario: Hovering an item emits its index

- **WHEN** the user moves the pointer over a carousel item
- **THEN** `onHoverChange` SHALL be called with that item's index

#### Scenario: Leaving an item emits null

- **WHEN** the user moves the pointer off a carousel item without entering another
- **THEN** `onHoverChange` SHALL be called with `null`

#### Scenario: No callback during active drag

- **WHEN** the user is actively dragging the carousel
- **THEN** `onHoverChange` SHALL NOT fire hover events until the drag ends

### Requirement: PortfolioItem typed items prop

The carousel `items` prop SHALL accept an array of `PortfolioItem` objects (from `@/types/portfolio`) instead of a generic or untyped array. Each item SHALL be rendered with its associated thumbnail/media source.

#### Scenario: Carousel accepts PortfolioItem array

- **WHEN** the parent passes `items={PORTFOLIO_ITEMS}` where `PORTFOLIO_ITEMS` is `PortfolioItem[]`
- **THEN** TypeScript SHALL accept the prop without error and the carousel SHALL render one slot per item

### Requirement: Autoplay suspended while an item is pinned

The carousel's automatic scrolling SHALL be fully suspended whenever a pinned item index is active, and SHALL resume when pin is cleared.

#### Scenario: Autoplay halts on pin

- **WHEN** `pinnedIndex` prop is a non-null number
- **THEN** the carousel SHALL not advance its scroll position automatically

#### Scenario: Autoplay resumes on unpin

- **WHEN** `pinnedIndex` prop becomes `null`
- **THEN** the carousel SHALL resume autoplay from its current position
