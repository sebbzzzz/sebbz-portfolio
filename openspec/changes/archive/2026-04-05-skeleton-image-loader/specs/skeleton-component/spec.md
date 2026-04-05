## ADDED Requirements

### Requirement: Skeleton component renders animated shimmer placeholder

A `Skeleton` component SHALL be available at `app/components/ui/Skeleton.tsx`. It renders a `<div>` with an animated left-to-right gradient shimmer suited for dark backgrounds. The shimmer animation SHALL be defined via a Tailwind 4 custom `animate-shimmer` utility class, not via inline `style` props.

#### Scenario: Skeleton renders with default full-size behavior

- **WHEN** `<Skeleton />` is rendered with no props inside a positioned container
- **THEN** it SHALL fill its container via `w-full h-full` and display the animated shimmer gradient

#### Scenario: Skeleton accepts className override for positioning

- **WHEN** `<Skeleton className="absolute inset-0 rounded-card" />` is rendered
- **THEN** it SHALL apply those classes alongside its base styles, allowing it to overlay any parent element

#### Scenario: Skeleton shimmer animation is visible on dark backgrounds

- **WHEN** the component is rendered on the site's dark background
- **THEN** the shimmer gradient SHALL use subtle light values (`white/5` to `white/10`) producing a visible sweep without being garish

#### Scenario: Skeleton has no interactive behavior

- **WHEN** the skeleton is visible
- **THEN** it SHALL have `pointer-events-none` so it does not block underlying elements, and `aria-hidden="true"` so screen readers ignore it
