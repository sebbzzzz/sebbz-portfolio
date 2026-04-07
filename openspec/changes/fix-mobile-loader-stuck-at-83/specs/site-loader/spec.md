## MODIFIED Requirements

### Requirement: Full-screen ASCII progress loader

A `Loader` client component SHALL render a full-screen overlay displaying an ASCII progress bar that increments from 0% to 100% as carousel images load. The overlay SHALL be centered on screen using IBM Mono font. The progress bar SHALL consist of 20 segments using `░` (empty) and `▓` (filled) block characters. The loader SHALL animate from 0% to 30% over a 2-second minimum wait, then continue with real image-load progress. The loader SHALL never remain frozen at a partial percentage: if image loading stalls, a timeout escape-hatch SHALL force progress to 100% after at most `MAX_PRELOAD_MS` milliseconds from when the 2-second animation completes.

#### Scenario: Loader renders on initial page visit

- **WHEN** the page first mounts
- **THEN** a full-screen overlay SHALL be visible with a centered progress bar starting at 0%

#### Scenario: Progress animates to 30% over 2 seconds

- **WHEN** the page first mounts
- **THEN** the progress bar SHALL animate from 0% to 30% over approximately 2 seconds regardless of image load speed

#### Scenario: Progress bar fills as images load

- **WHEN** the `progress` prop increases from 0 to 100
- **THEN** the number of `▓` segments SHALL equal `Math.floor(progress / 5)` and the remainder SHALL be `░` segments

#### Scenario: Progress label shows current percentage

- **WHEN** the loader is visible at any progress value
- **THEN** a text label SHALL display the current integer percentage (e.g., `42%`)

#### Scenario: Loader always reaches 100% within the maximum wait

- **WHEN** `fakeReady` becomes true (2-second animation complete)
- **THEN** the loader SHALL reach 100% within `MAX_PRELOAD_MS` milliseconds at the latest, whether via real image loads or the timeout escape-hatch
