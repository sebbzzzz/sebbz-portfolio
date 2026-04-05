## MODIFIED Requirements

### Requirement: Animated shimmer skeleton while thumbnail loads

Each carousel card SHALL display a `<Skeleton>` component as an absolute-positioned overlay filling the card while its thumbnail `<Image>` has not yet finished loading. The `<Skeleton>` SHALL use an animated shimmer gradient (via the `skeleton-component` capability). Once the image fires its `onLoad` event, the skeleton overlay SHALL fade out smoothly via an opacity transition (`transition-opacity duration-300 opacity-0`), revealing the loaded image beneath. The previous implementation using inline `style` shimmer with `carousel-shimmer` keyframes is replaced.

#### Scenario: Skeleton visible on initial render before image loads

- **WHEN** the carousel first renders and a card's thumbnail image has not yet loaded
- **THEN** a `<Skeleton className="absolute inset-0 rounded-card" />` SHALL be visible on top of the card

#### Scenario: Skeleton fades out after image loads

- **WHEN** the thumbnail `<Image>` fires its `onLoad` event for a given `realIndex`
- **THEN** the skeleton overlay for all cards sharing that `realIndex` SHALL transition to `opacity-0` within 300ms

#### Scenario: Loaded state is shared across tripled copies

- **WHEN** any one of the three tripled copies of an item fires `onLoad`
- **THEN** the skeleton SHALL disappear for all three copies of that `realIndex`, not just the copy that fired the event

#### Scenario: Already-loaded images show no skeleton on re-render

- **WHEN** a carousel card's `realIndex` has previously been marked as loaded
- **THEN** the skeleton SHALL NOT be visible on that card even after a component re-render

#### Scenario: Image is always mounted for preloading

- **WHEN** the skeleton is showing
- **THEN** the `<Image>` component SHALL still be mounted in the DOM (not conditionally removed) so the browser can preload it
