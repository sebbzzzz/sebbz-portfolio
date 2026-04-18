## Requirements

### Requirement: Seven-segment canvas favicon renders the "S" glyph
The system SHALL render a 32×32 canvas displaying a seven-segment representation of the letter "S" (equivalent to digit "5": segments a, c, d, f, g active) and update the `link[rel="icon"]` href to the canvas data URL on each animation frame.

#### Scenario: Favicon shows "S" after settle phase
- **WHEN** the animated favicon component mounts and the ticking phase (1500 ms) completes
- **THEN** the browser tab favicon SHALL display the "S" shape with segments a, f, g, c, d illuminated and segments b, e off

#### Scenario: Favicon icon element is updated at runtime
- **WHEN** the canvas data URL is generated
- **THEN** `document.querySelector('link[rel="icon"]').href` SHALL be set to the new data URL within the same animation frame

### Requirement: Ticking animation cycles random segment states before settling
The system SHALL animate the favicon through random segment combinations for approximately 1500 ms (ticking phase) before locking on the "S" shape.

#### Scenario: Random segments shown during ticking phase
- **WHEN** the component is in the TICKING state
- **THEN** each segment (a–g) SHALL independently flip on or off at approximately 80 ms intervals, producing visually distinct frames

#### Scenario: Ticking phase transitions to settled phase
- **WHEN** 1500 ms have elapsed since the ticking phase began
- **THEN** the animation state SHALL transition to SETTLED and display the fixed "S" glyph

### Requirement: Settled phase holds "S" for 3 seconds then loops
The system SHALL display the "S" glyph for exactly 3000 ms during the SETTLED phase, then restart the ticking phase.

#### Scenario: Loop restarts after settle
- **WHEN** 3000 ms have elapsed since the SETTLED phase began
- **THEN** the animation state SHALL transition back to TICKING and begin a new random-segment cycle

### Requirement: Animation pauses when browser tab is hidden
The system SHALL use `requestAnimationFrame` so the animation loop automatically suspends when the tab is in the background.

#### Scenario: rAF loop is cancelled on unmount
- **WHEN** the `AnimatedFavicon` component unmounts
- **THEN** any pending `requestAnimationFrame` callback SHALL be cancelled via `cancelAnimationFrame`

### Requirement: Component renders no visible DOM output
The system SHALL render `null` from the `AnimatedFavicon` component — all side effects occur via the Canvas API and `link` element mutation.

#### Scenario: No element added to page body
- **WHEN** `AnimatedFavicon` is mounted
- **THEN** no visible HTML element SHALL be inserted into the document body by this component
