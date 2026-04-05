## ADDED Requirements

### Requirement: Load progress callback

`InfiniteCarousel` SHALL accept an optional `onLoadProgress` prop of type `(percent: number) => void`. The component SHALL call this prop each time a new unique real-index image finishes loading, passing the ratio of loaded unique images to total items as an integer percentage (0–100).

#### Scenario: Progress emitted on each new image load

- **WHEN** a carousel image fires its `onLoad` event for a real index not previously loaded
- **THEN** `onLoadProgress` SHALL be called with `Math.round((loadedCount / items.length) * 100)`

#### Scenario: Duplicate loads across clones do not double-count

- **WHEN** the same real index image loads in a second or third carousel copy (clone)
- **THEN** `onLoadProgress` SHALL NOT be called again for that real index

#### Scenario: 100% emitted when all images loaded

- **WHEN** all `items.length` unique real-index images have fired `onLoad`
- **THEN** `onLoadProgress` SHALL be called with `100`

#### Scenario: Prop is optional — omitting it has no effect

- **WHEN** `onLoadProgress` is not provided
- **THEN** the carousel SHALL function identically to before with no errors
