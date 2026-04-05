## ADDED Requirements

### Requirement: Full-screen ASCII progress loader

A `Loader` client component SHALL render a full-screen overlay displaying an ASCII progress bar that increments from 0% to 100% as carousel images load. The overlay SHALL be centered on screen using IBM Mono font. The progress bar SHALL consist of 20 segments using `░` (empty) and `▓` (filled) block characters, matching the pattern from `example-loader.js`.

#### Scenario: Loader renders on initial page visit

- **WHEN** the page first mounts
- **THEN** a full-screen overlay SHALL be visible with a centered progress bar at 0%

#### Scenario: Progress bar fills as images load

- **WHEN** the `progress` prop increases from 0 to 100
- **THEN** the number of `▓` segments SHALL equal `Math.floor(progress / 5)` and the remainder SHALL be `░` segments

#### Scenario: Progress label shows current percentage

- **WHEN** the loader is visible at any progress value
- **THEN** a text label SHALL display the current integer percentage (e.g., `42%`)

### Requirement: Loader fade-out at 100%

When progress reaches 100%, the loader SHALL trigger a CSS fade-out transition and call an `onComplete` callback after the transition ends.

#### Scenario: Fade-out begins at 100%

- **WHEN** the `progress` prop reaches 100
- **THEN** the overlay SHALL begin fading out via a CSS opacity transition

#### Scenario: onComplete fires after transition

- **WHEN** the fade-out CSS transition ends
- **THEN** the `onComplete` callback SHALL be invoked exactly once

### Requirement: Reveal sequence after loader completes

The page SHALL orchestrate a reveal sequence after the loader calls `onComplete`: the ParticleCanvas SHALL become visible first, then after a short delay the carousel and main paragraph SHALL fade in.

#### Scenario: ParticleCanvas fades in after loader

- **WHEN** the loader calls `onComplete`
- **THEN** the ParticleCanvas SHALL fade in (opacity 0 → 1) immediately

#### Scenario: Carousel and paragraph fade in after particles

- **WHEN** the ParticleCanvas fade-in begins
- **THEN** after approximately 600ms the carousel and main paragraph SHALL fade in (opacity 0 → 1)

#### Scenario: Content hidden while loader is active

- **WHEN** the loader is still counting (progress < 100)
- **THEN** the carousel, main paragraph, and ParticleCanvas SHALL be invisible (opacity: 0) but SHALL be present in the DOM
