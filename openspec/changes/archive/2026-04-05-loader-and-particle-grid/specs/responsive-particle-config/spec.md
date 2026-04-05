## ADDED Requirements

### Requirement: Wave-driven character animation background

The `useParticleEngine` hook SHALL render a wave-driven character animation on each canvas frame as a background layer, drawn before the existing particle layer. The wave animation SHALL use multiple overlapping sine/cosine waves (matching the pattern from `example-animation-canvas.js`) to produce an organic, continuously moving pattern. The existing particle font, character set, icon-escape effects, and mouse-interaction behaviors SHALL remain unchanged.

#### Scenario: Wave layer renders on every frame

- **WHEN** the particle engine animation loop runs
- **THEN** the canvas SHALL first draw the wave character grid, then draw the particle characters on top

#### Scenario: Wave characters use the same font as particles

- **WHEN** the wave layer draws characters
- **THEN** the font family and size SHALL match the particle config (`fontSize`, `fontFamily`)

#### Scenario: Wave animation is continuous

- **WHEN** the component is mounted and animating
- **THEN** the wave pattern SHALL visibly change on every rendered frame, driven by an incrementing `time` value

#### Scenario: Existing particle effects are preserved

- **WHEN** the user moves their mouse near particles
- **THEN** the particle scatter/attract behavior SHALL function identically to before the wave layer was added

#### Scenario: Icon shape formation is preserved

- **WHEN** the particle engine is in icon-formation mode
- **THEN** particles SHALL still assemble into the configured icon shape, unaffected by the wave background
