## ADDED Requirements

### Requirement: Breakpoint-aware particle configuration hook

A `useResponsiveParticleConfig` hook SHALL exist that returns a particle configuration object matching the shape of `PARTICLE_CONFIG`. The hook SHALL evaluate the current viewport against defined breakpoints and return the appropriate config values. The hook SHALL update the returned config when the viewport crosses a breakpoint boundary.

#### Scenario: Mobile config returned below sm breakpoint

- **WHEN** the viewport width is less than 640px
- **THEN** the hook SHALL return `fontSize: 10`, `charCellHeight: 20`, `logoScale: 0.30`, `mouseRadius: 60`

#### Scenario: Tablet config returned at sm breakpoint

- **WHEN** the viewport width is between 640px and 1023px
- **THEN** the hook SHALL return `fontSize: 12`, `charCellHeight: 24`, `logoScale: 0.38`, `mouseRadius: 80`

#### Scenario: Desktop config returned at lg breakpoint

- **WHEN** the viewport width is 1024px or greater
- **THEN** the hook SHALL return `fontSize: 14`, `charCellHeight: 30`, `logoScale: 0.45`, `mouseRadius: 100`

#### Scenario: Config updates on viewport resize crossing a breakpoint

- **WHEN** the viewport width changes from below 640px to above 640px (or vice versa)
- **THEN** the hook SHALL return updated config values reflecting the new breakpoint

### Requirement: Particle engine consumes responsive config

The `useParticleEngine` hook SHALL accept particle configuration as a parameter (or from the hook) rather than reading from a static module constant. The `ParticleCanvas` component SHALL pass the result of `useResponsiveParticleConfig` to the engine.

#### Scenario: Engine uses mobile config on small screen

- **WHEN** `useParticleEngine` is initialized on a 375px-wide viewport
- **THEN** the particle grid SHALL be generated using `fontSize: 10` and `charCellHeight: 20`

#### Scenario: Engine rebuilds grid after breakpoint change

- **WHEN** the viewport resizes across a breakpoint boundary
- **THEN** the particle grid SHALL be recalculated with the updated config values, producing a new column/row count appropriate for the new font size

### Requirement: Wave-driven character animation in idle state

The `useParticleEngine` hook SHALL render a wave-driven character animation to control per-particle visibility in the idle state. The wave animation SHALL use multiple overlapping sine/cosine waves to produce an organic, continuously moving pattern. Only particles whose base-position wave value exceeds the configured threshold SHALL be drawn. The existing particle font, character set, icon-escape effects, and mouse-interaction behaviors SHALL remain unchanged. The wave gate SHALL also apply during DISPERSING and RETURNING states to prevent a full-grid flash on transition back to idle.

#### Scenario: Wave animation is continuous in idle

- **WHEN** the particle engine is in IDLE state
- **THEN** the wave pattern SHALL visibly change on every rendered frame, driven by an incrementing time value, with only wave-active particles drawn

#### Scenario: Idle grid is replaced by wave pattern

- **WHEN** the particle engine is in IDLE state
- **THEN** the static full particle grid SHALL NOT be visible; only particles passing the wave threshold SHALL be drawn

#### Scenario: Wave gate applies during disperse and return transitions

- **WHEN** the engine transitions from FORMING/LOGO back to IDLE (DISPERSING) or from ESCAPED back to IDLE (RETURNING)
- **THEN** the wave gate SHALL apply during those transition states so no full-grid flash occurs

#### Scenario: Existing particle effects are preserved

- **WHEN** the user moves their mouse near particles or hovers a carousel item
- **THEN** the particle scatter/attract and icon-formation behaviors SHALL function identically to before
