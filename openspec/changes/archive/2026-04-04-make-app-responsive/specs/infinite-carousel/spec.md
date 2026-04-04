## MODIFIED Requirements

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

## ADDED Requirements

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
