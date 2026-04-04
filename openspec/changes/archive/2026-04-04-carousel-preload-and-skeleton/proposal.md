## Why

Two UX gaps exist in the portfolio carousel: (1) clicking a carousel item shows a blank/black frame while the background video buffers, because the video only starts loading on click; (2) on initial page load, carousel thumbnails render one-by-one with a jarring pop-in effect that looks unpolished.

## What Changes

- **Video preload on hover**: When the user hovers a carousel item, its background video (`mediaSrc`) is preloaded in the background so it is ready to play the moment they click/pin it — eliminating the black-frame dead time.
- **Thumbnail skeleton**: Each carousel card shows an animated shimmer placeholder while its `<Image>` is still loading; the shimmer fades out once the image has loaded, replacing the abrupt pop-in with a smooth reveal.

## Capabilities

### New Capabilities

- `hover-video-preload`: Preloads a portfolio item's video/image mediaSrc when the user hovers the carousel card, before the item is pinned, so playback starts instantly on click.
- `carousel-thumbnail-skeleton`: Renders an animated shimmer overlay on each carousel card that fades out once the thumbnail image has fully loaded, preventing the one-by-one pop-in on initial load.

### Modified Capabilities

<!-- none -->

## Impact

- `app/components/InfiniteCarousel/InfiniteCarousel.tsx` — add per-card loaded state tracking + shimmer overlay; expose a new `onItemHover` prop (or reuse `onHoverChange`) to trigger preload from the parent.
- `app/page.tsx` — call `useMediaPreload` with the hovered item's `mediaSrc`/`mediaType` when `activeCarouselIndex` changes.
- `hooks/use-media-preload.ts` — no changes required; hook already supports both video and image preload.
- No new dependencies.
