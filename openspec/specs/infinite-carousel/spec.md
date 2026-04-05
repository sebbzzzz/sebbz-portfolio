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

### Requirement: Load progress callback

`InfiniteCarousel` SHALL accept an optional `onLoadProgress` prop of type `(percent: number) => void`. The component SHALL call this prop each time a new unique real-index image finishes loading, passing the ratio of loaded unique images to total items as an integer percentage (0–100).

#### Scenario: Progress emitted on each new image load

- **WHEN** a carousel image fires its `onLoad` event for a real index not previously loaded
- **THEN** `onLoadProgress` SHALL be called with `Math.round((loadedCount / items.length) * 100)`

#### Scenario: Duplicate loads across clones do not double-count

- **WHEN** the same real index image loads in a second or third carousel copy (clone)
- **THEN** `onLoadProgress` SHALL NOT be called again for that real index

#### Scenario: 100% emitted when all images loaded

- **WHEN** all `items.length` unique real-index images have fired `onLoad`
- **THEN** `onLoadProgress` SHALL be called with `100`

#### Scenario: Prop is optional — omitting it has no effect

- **WHEN** `onLoadProgress` is not provided
- **THEN** the carousel SHALL function identically to before with no errors
