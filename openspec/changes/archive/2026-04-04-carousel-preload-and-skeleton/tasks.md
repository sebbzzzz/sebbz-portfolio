## 1. Hover Video Preload

- [x] 1.1 In `app/page.tsx`, call `useMediaPreload` with the hovered item's `mediaSrc` and `mediaType` based on `activeCarouselIndex` — preloads the media asset while the user is hovering before they click
- [x] 1.2 Verify the preload cleans up correctly when `activeCarouselIndex` changes (hover moves to next item or leaves carousel) — the existing `useMediaPreload` hook handles cleanup via its `useEffect` dependencies

## 2. Carousel Thumbnail Skeleton

- [x] 2.1 In `InfiniteCarousel.tsx`, add a `useRef<Set<number>>` (`loadedIndicesRef`) to track which `realIndex` values have loaded, and a `useState<Set<number>>` (`loadedIndices`) to trigger re-renders when new indices are marked loaded
- [x] 2.2 Add an `onLoad` handler on the `<Image>` component inside each carousel card that, on first fire per `realIndex`, adds the index to both the ref and state sets
- [x] 2.3 Add an animated shimmer `<div>` overlay (`absolute inset-0`) inside each `<figure>` that is `opacity-0 pointer-events-none` when `loadedIndices.has(realIndex)` and `opacity-100` otherwise, with a CSS transition for the fade-out
- [x] 2.4 Style the shimmer with a dark animated sweep gradient (e.g. `bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse` or a custom keyframe) consistent with the site's dark palette

## 3. QA

- [x] 3.1 Run `yarn typecheck && yarn lint:fix && yarn format:write` — all must pass
