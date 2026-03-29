## ADDED Requirements

### Requirement: Image source support

The background media overlay SHALL accept an `imageSrc` prop in addition to the existing `src` (video) prop. When `imageSrc` is provided and `src` is not, the overlay SHALL render an `<img>` element instead of a `<video>`.

#### Scenario: imageSrc renders img element

- **WHEN** the overlay is rendered with `imageSrc` but no `src`
- **THEN** an `<img>` element SHALL be rendered with `src={imageSrc}`, `alt=""`, `decoding="async"`, and `className` ensuring full coverage

#### Scenario: src takes precedence over imageSrc

- **WHEN** both `src` and `imageSrc` are provided
- **THEN** the `<video>` element SHALL be rendered and `imageSrc` SHALL be ignored

### Requirement: Eager media preloading

The overlay SHALL preload its media asset as soon as the `src` or `imageSrc` prop is known, before the overlay becomes visible, so there is no loading delay when it fades in.

#### Scenario: Image preloaded before first display

- **WHEN** `imageSrc` is provided during initial mount or first prop update
- **THEN** a `<link rel="preload" as="image" fetchpriority="high">` SHALL be injected into the document `<head>` for that URL

#### Scenario: Video preloaded before first display

- **WHEN** `src` (video) is provided during initial mount or first prop update
- **THEN** a detached `HTMLVideoElement` with `preload="auto"` SHALL be constructed and `.load()` called so the browser caches the video resource

#### Scenario: Preload cleans up on src change

- **WHEN** the `src` or `imageSrc` prop changes to a new URL
- **THEN** the previous preload link SHALL be removed from `<head>` and a new one inserted for the updated URL

### Requirement: Performance attributes on rendered media

Rendered `<img>` and `<video>` elements SHALL carry performance-optimising attributes.

#### Scenario: img has performance attributes

- **WHEN** an `<img>` is rendered as the overlay background
- **THEN** it SHALL have `loading="eager"`, `decoding="async"`, and `fetchpriority="high"` attributes

#### Scenario: video has performance attributes

- **WHEN** a `<video>` is rendered as the overlay background
- **THEN** it SHALL have `preload="auto"`, `autoPlay`, `loop`, `muted`, and `playsInline` attributes
