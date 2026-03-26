## ADDED Requirements

### Requirement: ASCII particle grid fills canvas

The system SHALL render a grid of ASCII characters that covers the full dimensions of the canvas container. Characters SHALL be 14px monospace, white, one per cell on a regular grid. Cell dimensions SHALL be derived by measuring the actual character advance width at runtime.

#### Scenario: Grid renders on mount

- **WHEN** the component mounts with valid `width` and `height` props (both > 0)
- **THEN** the canvas is filled with ASCII characters in a regular grid, one per cell, with no visible gaps larger than inter-character spacing

#### Scenario: Grid recalculates on resize

- **WHEN** `width` or `height` props change
- **THEN** the particle grid is rebuilt to fit the new dimensions within 200ms, and the canvas visually reflects the new size

### Requirement: Idle oscillation

The system SHALL animate each character with a subtle continuous oscillation. Each character SHALL have a unique random phase offset so they do not move in unison.

#### Scenario: Characters oscillate independently

- **WHEN** the canvas is in idle state with no mouse interaction
- **THEN** each character moves slightly in X and Y following a sine/cosine pattern, with amplitude ≤ 2px, at a speed that completes a cycle in roughly 8–12 seconds

### Requirement: Diagonal color wave

The system SHALL animate a continuous diagonal color transition sweeping from top-left to bottom-right. Colors SHALL be defined in a top-level `PARTICLE_COLORS` constant. The wave SHALL loop seamlessly.

#### Scenario: Wave sweeps continuously

- **WHEN** the canvas is in idle state
- **THEN** a color gradient visibly travels from the top-left corner toward the bottom-right corner, repeating indefinitely, with no visible hard seam at the loop point

#### Scenario: Colors are customizable via constant

- **WHEN** `PARTICLE_COLORS.waveLead` or `PARTICLE_COLORS.waveTrail` values are changed
- **THEN** the wave gradient reflects the new colors without any other code changes

### Requirement: Z-axis scatter on canvas mouse hover

The system SHALL scale down and radially push characters near the cursor when the mouse is over the canvas, creating a z-axis recession illusion. The effect SHALL smoothly recover when the mouse moves away.

#### Scenario: Characters near cursor recede

- **WHEN** the mouse moves over the canvas within 80px of a character
- **THEN** that character's scale decreases proportionally to proximity (minimum scale 0.2) and its position shifts slightly away from the cursor

#### Scenario: Characters recover when mouse leaves

- **WHEN** the mouse cursor exits the canvas or moves more than 80px away from a character
- **THEN** the character smoothly lerps back to its original scale (1.0) and base position within 500ms

### Requirement: Logo formation on link hover

The system SHALL rearrange characters to form a logo shape when the user hovers a designated link. Characters SHALL smoothly transition to logo positions and back to the grid when hover ends.

#### Scenario: LinkedIn logo forms on hover

- **WHEN** the user hovers the LinkedIn link
- **THEN** all characters animate to form the LinkedIn logo shape; the transition completes in approximately 900ms

#### Scenario: Logo disperses on hover end

- **WHEN** the user stops hovering the LinkedIn link
- **THEN** characters animate back to their idle grid positions within approximately 900ms

#### Scenario: Active logo characters are highlighted

- **WHEN** the logo formation is complete
- **THEN** characters forming the logo are rendered in `PARTICLE_COLORS.logoActive` and non-logo characters are dimmed to `PARTICLE_COLORS.logoInactive`

### Requirement: Retina/HiDPI sharpness

The system SHALL scale the canvas buffer by `devicePixelRatio` so text renders crisp on high-density displays.

#### Scenario: Canvas is sharp on Retina display

- **WHEN** the component renders on a display with `devicePixelRatio` of 2 or higher
- **THEN** ASCII characters appear crisp and not blurry

### Requirement: Clean mount/unmount lifecycle

The system SHALL cancel the animation loop and release all resources when the component unmounts. The system SHALL handle React Strict Mode's double-mount pattern correctly.

#### Scenario: Animation loop stops on unmount

- **WHEN** the component unmounts
- **THEN** the `requestAnimationFrame` loop is cancelled and no further canvas operations are performed
