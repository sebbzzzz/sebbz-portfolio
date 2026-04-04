## ADDED Requirements

### Requirement: Animated shimmer skeleton while thumbnail loads

Each carousel card SHALL display an animated shimmer placeholder overlay while its thumbnail `<Image>` has not yet finished loading. Once the image fires its `onLoad` event, the shimmer SHALL fade out smoothly, replacing the abrupt pop-in with a polished reveal.

#### Scenario: Shimmer visible on initial render before image loads

- **WHEN** the carousel first renders and a card's thumbnail image has not yet loaded
- **THEN** an animated shimmer overlay SHALL be visible on top of the card area

#### Scenario: Shimmer fades out after image loads

- **WHEN** the thumbnail `<Image>` fires its `onLoad` event for a given `realIndex`
- **THEN** the shimmer overlay for all cards sharing that `realIndex` SHALL transition to `opacity-0` and become non-interactive (`pointer-events-none`)

#### Scenario: Loaded state is shared across tripled copies

- **WHEN** any one of the three tripled copies of an item fires `onLoad`
- **THEN** the shimmer SHALL disappear for all three copies of that `realIndex`, not just the copy that fired the event

#### Scenario: Already-loaded images show no shimmer on re-render

- **WHEN** a carousel card's `realIndex` has previously been marked as loaded
- **THEN** the shimmer SHALL NOT be visible on that card even after a component re-render

#### Scenario: Shimmer style matches dark portfolio palette

- **WHEN** the shimmer is visible
- **THEN** it SHALL use a dark animated gradient (not white/light) consistent with the site's dark theme, creating a subtle sweep effect
