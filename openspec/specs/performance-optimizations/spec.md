## ADDED Requirements

### Requirement: Thumbnail images use next/image

All portfolio item thumbnail images (`thumbnailSrc`) in the carousel SHALL be rendered with `next/image` instead of a raw `<img>` tag to enable automatic format conversion (WebP/AVIF), responsive `srcset`, and built-in lazy loading.

#### Scenario: Thumbnails are served as WebP on supporting browsers

- **WHEN** a browser that supports WebP requests a carousel thumbnail
- **THEN** the image response SHALL be in WebP or AVIF format, not the original PNG/JPG

#### Scenario: First visible thumbnails are not lazy-loaded

- **WHEN** the page loads
- **THEN** the first 3 carousel thumbnails SHALL have `priority` set (or equivalent `loading="eager"`) so they are fetched immediately without waiting for lazy-load intersection

#### Scenario: Off-screen thumbnails are lazy-loaded

- **WHEN** the page loads
- **THEN** carousel thumbnails beyond the initially visible set SHALL be lazy-loaded and not block initial render

### Requirement: Resource hints for above-the-fold assets

The `<head>` SHALL include `<link rel="preload">` hints for the first carousel thumbnail image and any icon images rendered above the fold (social link icons) to reduce their fetch latency.

#### Scenario: Social icons are preloaded

- **WHEN** the page HTML is parsed by the browser
- **THEN** `<link rel="preload" as="image">` tags SHALL exist for the social link icon SVGs

### Requirement: Demo videos are not auto-fetched on initial load

Portfolio demo videos (`.webm`, `.mov`) SHALL NOT be fetched until the user pins an item. No `<video>` preload or prefetch SHALL occur for videos that are not yet active.

#### Scenario: Video src is absent until item is pinned

- **WHEN** the page loads with no item pinned
- **THEN** no network request for any `.webm` or `.mov` file SHALL be initiated

#### Scenario: Video loads when item is pinned

- **WHEN** the user pins a carousel item
- **THEN** the corresponding demo video SHALL begin loading and play in the background overlay
