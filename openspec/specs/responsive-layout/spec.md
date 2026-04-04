## ADDED Requirements

### Requirement: Panels are full-width on mobile

The intro panel and info panel SHALL use full available width on viewports below `md` (768px), and constrain to `max-w-5/12` at `md` and `max-w-4/12` at `lg` and above. Panels SHALL NOT overflow or clip content at any supported viewport width (≥320px).

#### Scenario: Intro panel on mobile viewport

- **WHEN** the viewport width is less than 768px
- **THEN** the intro panel SHALL occupy the full width minus horizontal gutters (e.g., `left-3 right-3`) with no `max-w` constraint

#### Scenario: Intro panel on desktop viewport

- **WHEN** the viewport width is 1024px or greater
- **THEN** the intro panel SHALL be constrained to `max-w-4/12` of the viewport, matching the original desktop layout

### Requirement: Gutters and spacing scale with viewport

Absolute-positioned panels SHALL use smaller gutters on mobile (`top-3 left-3 right-3`) and standard gutters on desktop (`top-5 left-5 right-5`). The carousel bottom offset SHALL scale from `bottom-6` on mobile to `bottom-10` on desktop.

#### Scenario: Mobile gutter sizing

- **WHEN** the viewport width is less than 640px
- **THEN** panels SHALL have at most 12px (0.75rem) horizontal and top gutters

#### Scenario: Desktop gutter sizing

- **WHEN** the viewport width is 1024px or greater
- **THEN** panels SHALL have 20px (1.25rem) horizontal and top gutters matching the original design

### Requirement: Typography scales down on mobile

Heading text in the intro panel SHALL use `text-xl` on mobile and `text-2xl` on `lg` and above. Body text SHALL use `text-sm` on mobile and `text-base` (default) on `md` and above.

#### Scenario: Heading font size on mobile

- **WHEN** the viewport width is less than 640px
- **THEN** the main heading SHALL render at `text-xl` (1.25rem) or smaller

#### Scenario: Heading font size on desktop

- **WHEN** the viewport width is 1024px or greater
- **THEN** the main heading SHALL render at `text-2xl` (1.5rem)

### Requirement: Root container uses small viewport height

The main page wrapper SHALL use `h-svh` (small viewport height) instead of `h-screen` or `100vh` to account for dynamic browser UI chrome on mobile.

#### Scenario: No overflow on mobile browser with visible toolbar

- **WHEN** the page is loaded on a mobile browser with an address bar visible
- **THEN** the layout SHALL fit within the visible viewport without vertical scrollbar or content clipping

### Requirement: Page has a single h1 and correct heading hierarchy

The homepage SHALL contain exactly one `<h1>` element (the greeting in the intro panel). The info panel project title SHALL use `<h2>`. No heading levels SHALL be skipped between `<h1>` and `<h2>`.

#### Scenario: Only one h1 exists at any time

- **WHEN** the homepage is loaded (regardless of pin state)
- **THEN** exactly one `<h1>` SHALL exist in the DOM

#### Scenario: Info panel title is h2

- **WHEN** a portfolio item is pinned and the info panel is visible
- **THEN** the project title element SHALL be an `<h2>`
