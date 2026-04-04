## ADDED Requirements

### Requirement: Preload hovered item media on hover

When the user hovers a carousel card, the system SHALL begin preloading that item's `mediaSrc` in the background before the user clicks/pins the item. This ensures the background video (or image) is buffered and ready to display without a loading delay when the item is pinned.

#### Scenario: Video preloads on hover

- **WHEN** the user moves the pointer over a carousel card whose item has `mediaType: "video"`
- **THEN** a detached `<video>` element with `preload="auto"` SHALL be created and `.load()` called for that item's `mediaSrc`

#### Scenario: Image preloads on hover

- **WHEN** the user moves the pointer over a carousel card whose item has `mediaType: "image"`
- **THEN** a `<link rel="preload" as="image" fetchpriority="high">` tag SHALL be injected into `<head>` for that item's `mediaSrc`

#### Scenario: Previous preload is cancelled when hover moves to a different item

- **WHEN** the user moves the pointer from one carousel card to another
- **THEN** the preload resource for the previously hovered item SHALL be cleaned up (detached video `src` set to `""`, or preload link removed from `<head>`)

#### Scenario: No preload triggered during drag

- **WHEN** the user is dragging the carousel (isDragging is true)
- **THEN** no new preload SHALL be triggered for hovered items during the drag gesture

#### Scenario: No preload when item has no mediaSrc

- **WHEN** the user hovers a carousel card whose item has no `mediaSrc`
- **THEN** no preload request SHALL be made
