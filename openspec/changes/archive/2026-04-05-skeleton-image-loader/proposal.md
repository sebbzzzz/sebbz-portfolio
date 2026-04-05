## Why

The `InfiniteCarousel` currently shows a broken opacity-shimmer overlay that doesn't work as a real skeleton — the gradient animation runs inline via `style` props and the approach doesn't provide a proper placeholder size or shape before the image loads, causing a visually jarring first paint on the portfolio site.

## What Changes

- Create a new reusable `Skeleton` component (`app/components/ui/Skeleton.tsx`) that accepts `width`, `height`, and `className` props and renders an animated gradient shimmer at the given dimensions.
- Replace the inline shimmer overlay in `InfiniteCarousel` with the new `Skeleton` component as the initial placeholder for each card image.
- Remove the existing `loadedIndices` state + inline `style` shimmer overlay from `InfiniteCarousel` — the `Skeleton` is shown conditionally until `onLoad` fires, then unmounted/hidden.
- Move the `@keyframes carousel-shimmer` animation definition (if it exists in global CSS) to be self-contained inside the `Skeleton` component via Tailwind 4 utilities.

## Capabilities

### New Capabilities

- `skeleton-component`: A standalone animated shimmer skeleton component that accepts size props and can be composited over or in place of any loading image.

### Modified Capabilities

- `carousel-thumbnail-skeleton`: The existing spec requires shimmer while thumbnail loads — the implementation approach changes from an overlay `<div>` with inline styles to using the new `Skeleton` component as a proper placeholder rendered behind/instead-of the `<Image>` until loaded.

## Impact

- New file: `app/components/ui/Skeleton.tsx`
- Modified file: `app/components/InfiniteCarousel/InfiniteCarousel.tsx`
- No API changes, no new dependencies
- The `loadedIndices` / `loadedIndicesRef` state in `InfiniteCarousel` is kept but the rendering logic switches to show `<Skeleton>` when not loaded and `<Image>` (visible) when loaded
