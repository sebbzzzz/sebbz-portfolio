## ADDED Requirements

### Requirement: Carousel thumbnails load eagerly regardless of viewport position

Every `<Image>` rendered inside `InfiniteCarousel` SHALL use `loading="eager"` so that the browser fetches all thumbnails unconditionally, regardless of the element's distance from the current scroll position or viewport.

#### Scenario: Non-priority images load on mobile before scroll reaches them

- **WHEN** the page mounts on a mobile viewport (width < 768 px)
- **THEN** all 6 unique thumbnail images SHALL begin loading immediately without requiring the user to scroll to them

#### Scenario: All onLoad events fire during the preload phase

- **WHEN** the page mounts and the loader is active
- **THEN** `handleImageLoad` SHALL be called for every `realIndex` (0–5) before or shortly after `fakeReady` becomes true, causing `realProgress` to reach 100

### Requirement: Loader timeout escape-hatch prevents indefinite stall

The page SHALL include a maximum-wait timer that forces `realProgress` to 100 after `MAX_PRELOAD_MS` milliseconds from the moment `fakeReady` becomes true, guaranteeing the loader always completes.

#### Scenario: Loader completes even when an image never fires onLoad

- **WHEN** `fakeReady` is true and `realProgress` is below 100 for longer than `MAX_PRELOAD_MS`
- **THEN** `realProgress` SHALL be set to 100, allowing the loader fade-out to begin

#### Scenario: Timeout does not fire when all images load in time

- **WHEN** all 6 images fire `onLoad` before `MAX_PRELOAD_MS` elapses
- **THEN** the timeout SHALL be cancelled and `realProgress` reaches 100 via the normal image-load path
