## ADDED Requirements

### Requirement: Infinite horizontal loop

The carousel SHALL display items in a continuously looping horizontal track. When the user scrolls past the last item, the view SHALL seamlessly wrap to the beginning without a visible jump, and vice versa.

#### Scenario: Scroll past last item wraps to start

- **WHEN** the carousel scroll position reaches the end of the last clone set
- **THEN** the scroll offset is silently repositioned to the equivalent position in the center track, with no visible layout shift

#### Scenario: Scroll past first item wraps to end

- **WHEN** the carousel scroll position goes before the first item in the center track
- **THEN** the scroll offset is silently repositioned to the equivalent position in the last clone set, with no visible layout shift

### Requirement: Momentum drag interaction

The carousel SHALL respond to pointer drag (mouse and touch) with physics-based momentum. Drag velocity at pointer-up SHALL determine the post-release deceleration distance and direction. Touch events SHALL be handled natively (via `touchstart`/`touchmove`/`touchend`) with `touch-action: pan-x` to allow vertical scrolling to pass through to the browser.

#### Scenario: Slow drag stops near release point

- **WHEN** the user drags slowly and releases the pointer
- **THEN** the carousel decelerates quickly and stops within a short distance of the release point

#### Scenario: Fast fling scrolls further

- **WHEN** the user drags quickly and releases the pointer
- **THEN** the carousel continues scrolling in the drag direction with higher momentum and decelerates gradually to a stop

#### Scenario: Drag outside element boundary continues tracking

- **WHEN** the user initiates a drag and moves the pointer outside the carousel bounds before releasing
- **THEN** the carousel SHALL continue tracking the drag and apply the final velocity on pointer-up

#### Scenario: Touch drag works on mobile

- **WHEN** the user swipes horizontally on a touch device
- **THEN** the carousel SHALL respond to the swipe with the same momentum physics as mouse drag

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

### Requirement: Responsive item sizing

Carousel items SHALL use viewport-relative widths that scale appropriately across device sizes. Items SHALL be wide enough to be identifiable and tappable on mobile viewports.

#### Scenario: Item width on mobile viewport

- **WHEN** the viewport width is less than 640px
- **THEN** each carousel item SHALL have a width of approximately `calc(72vw - 16px)`, showing roughly 1.3 items in view

#### Scenario: Item width on tablet viewport

- **WHEN** the viewport width is between 640px and 1023px
- **THEN** each carousel item SHALL have a width of approximately `calc(40vw - 16px)`, showing ~2.5 items in view

#### Scenario: Item width on desktop viewport

- **WHEN** the viewport width is 1024px or greater
- **THEN** each carousel item SHALL have a width of `calc(20vw - 16px)`, matching the original desktop layout (~5 items visible)

### Requirement: Info panel renders HTML descriptions

The `CarouselItemInfoPanel` component SHALL render the `description` field of the active `PortfolioItem` as parsed HTML rather than a plain text string, so that anchor tags and other markup are rendered as real DOM elements.

#### Scenario: Description with anchor tag shows a link

- **WHEN** a pinned portfolio item has a description containing an `<a>` anchor tag
- **THEN** the info panel SHALL display the text with a rendered, clickable hyperlink — not escaped HTML characters

#### Scenario: Description with no HTML renders unchanged

- **WHEN** a pinned portfolio item has a plain text description
- **THEN** the info panel SHALL display the text identically to before
