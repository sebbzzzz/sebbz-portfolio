## MODIFIED Requirements

### Requirement: Full-viewport overlay with fade transition

The background video overlay SHALL cover the full viewport and fade in/out smoothly when activated or deactivated. It SHALL sit between the particle canvas and interactive UI layers in z-order.

#### Scenario: Overlay fades in on activation

- **WHEN** `isVisible` prop becomes `true`
- **THEN** the overlay SHALL transition from `opacity: 0` to `opacity: 1` over a short CSS transition (300ms ease)

#### Scenario: Overlay fades out on deactivation

- **WHEN** `isVisible` prop becomes `false`
- **THEN** the overlay SHALL transition from `opacity: 1` to `opacity: 0`; after the transition completes, the overlay SHALL not obscure pointer events

### Requirement: Placeholder mode when no video src is provided

When neither `src` (video) nor `imageSrc` (image) prop is given, the overlay SHALL render an animated CSS gradient as a placeholder. When a `src` prop is provided, it SHALL render a muted, looping, auto-playing `<video>` element. When `imageSrc` is provided (and `src` is not), it SHALL render an `<img>` element.

#### Scenario: No src renders animated gradient

- **WHEN** the overlay is rendered without a `src` or `imageSrc` prop
- **THEN** a `<div>` with a looping CSS `@keyframes` gradient animation SHALL be displayed as the background

#### Scenario: src renders video element

- **WHEN** the overlay is rendered with a `src` prop pointing to a video file
- **THEN** a `<video>` element SHALL be rendered with `autoPlay`, `loop`, `muted`, `playsInline`, and `preload="auto"` attributes, and the gradient placeholder SHALL not be rendered

#### Scenario: imageSrc renders img element

- **WHEN** the overlay is rendered with `imageSrc` but no `src`
- **THEN** an `<img>` element SHALL be rendered with `loading="eager"`, `decoding="async"`, and `fetchpriority="high"` attributes, and the gradient placeholder SHALL not be rendered

### Requirement: Particle canvas hides while overlay is visible

The particle canvas SHALL be visually suppressed (opacity 0) while the background video overlay is visible, and SHALL be restored when the overlay is hidden. This suppression is now coordinated through the particle escape/return transition sequence rather than a direct opacity toggle.

#### Scenario: Canvas hidden during overlay

- **WHEN** the overlay `isVisible` is `true` and the particle escape animation has completed
- **THEN** the `ParticleCanvas` container SHALL have `opacity: 0`

#### Scenario: Canvas restored after overlay hides

- **WHEN** the overlay `isVisible` transitions back to `false` and the particle return animation completes
- **THEN** the `ParticleCanvas` container SHALL transition back to `opacity: 1`
