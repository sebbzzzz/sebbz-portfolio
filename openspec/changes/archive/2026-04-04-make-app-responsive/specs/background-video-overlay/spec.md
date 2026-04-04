## MODIFIED Requirements

### Requirement: Full-viewport overlay with fade transition

The background video overlay SHALL cover the full viewport using `inset-0` positioning and SHALL use `h-svh` (small viewport height) where a height unit is required to avoid content being hidden behind mobile browser chrome. It SHALL fade in/out smoothly when activated or deactivated. It SHALL sit between the particle canvas and interactive UI layers in z-order.

#### Scenario: Overlay fades in on activation

- **WHEN** `isVisible` prop becomes `true`
- **THEN** the overlay SHALL transition from `opacity: 0` to `opacity: 1` over a short CSS transition (300ms ease)

#### Scenario: Overlay fades out on deactivation

- **WHEN** `isVisible` prop becomes `false`
- **THEN** the overlay SHALL transition from `opacity: 1` to `opacity: 0`; after the transition completes, the overlay SHALL not obscure pointer events

#### Scenario: Overlay does not clip on mobile browser with toolbar

- **WHEN** the overlay is visible on a mobile viewport with dynamic browser chrome
- **THEN** the overlay SHALL fill the small viewport height without scrollbars or clipping

## ADDED Requirements

### Requirement: Correct object-fit defaults across viewport sizes

Video and image elements inside the overlay SHALL use `object-cover` as the default fit on all viewport sizes. The `sm:` prefix override SHALL be removed in favor of a consistent default.

#### Scenario: Video fills overlay on mobile

- **WHEN** the overlay renders a video on a mobile viewport
- **THEN** the video SHALL use `object-cover` to fill the overlay container without letterboxing

#### Scenario: Image fills overlay on desktop

- **WHEN** the overlay renders an image on a desktop viewport
- **THEN** the image SHALL use `object-cover` to fill the overlay container
