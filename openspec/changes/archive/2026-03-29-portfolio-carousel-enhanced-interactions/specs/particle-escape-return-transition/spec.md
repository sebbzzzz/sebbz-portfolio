## ADDED Requirements

### Requirement: Particle escape animation

The particle engine SHALL support an `ESCAPING` state in which all particles animate radially outward from their current positions toward the viewport edge, leaving the screen within ~600 ms.

#### Scenario: Escape triggered externally

- **WHEN** the particle engine receives an escape command (via imperative API)
- **THEN** each particle SHALL be assigned a random outward direction and animate toward a position beyond the viewport edge using an ease-in curve over ~600 ms

#### Scenario: Escape completes and engine signals done

- **WHEN** all particles have reached their off-screen targets
- **THEN** the engine SHALL invoke a provided `onEscapeComplete` callback so the caller can then show the background media

#### Scenario: Canvas becomes effectively blank after escape

- **WHEN** the ESCAPING animation finishes
- **THEN** no visible particles SHALL remain within the viewport bounds

### Requirement: Particle return animation

The particle engine SHALL support a `RETURNING` state in which particles animate from their current off-screen positions back to their resting grid coordinates.

#### Scenario: Return triggered after media hide

- **WHEN** the particle engine receives a return command
- **THEN** each particle SHALL animate from its current position back to its resting grid cell using the existing lerp system over ~600 ms

#### Scenario: Return restores normal idle behaviour

- **WHEN** all particles have reached their grid targets
- **THEN** the engine SHALL transition back to the `IDLE` state and resume normal oscillation

### Requirement: Escape/return transition sequence orchestration

The page-level orchestration hook SHALL enforce the following sequence:

**On activate (hover or pin):**

1. Trigger particle escape.
2. Wait for `onEscapeComplete`.
3. Set background media visible.

**On deactivate (unhover or unpin):**

1. Hide background media.
2. Wait for CSS fade-out transition to end (~300 ms).
3. Trigger particle return.

#### Scenario: Media does not appear before particles leave

- **WHEN** the user hovers a carousel item
- **THEN** the background media SHALL NOT become visible until the particle escape animation has completed

#### Scenario: Particles do not return while media is still visible

- **WHEN** the user unhovers a carousel item
- **THEN** the particle return animation SHALL NOT start until the background media opacity transition has finished

### Requirement: Interruption handling

If the user rapidly toggles hover/pin during an in-flight transition, the engine SHALL cancel the current animation phase and reverse direction from the particles' current positions.

#### Scenario: Re-hover during return snaps to escape

- **WHEN** particles are in the RETURNING state and the user hovers a new item
- **THEN** the return animation SHALL be cancelled and a new ESCAPING animation SHALL start from the particles' current positions

#### Scenario: Unhover during escape cancels and starts return

- **WHEN** particles are in the ESCAPING state and the user removes hover without pinning
- **THEN** the escape animation SHALL be cancelled and a RETURNING animation SHALL start from the particles' current positions
