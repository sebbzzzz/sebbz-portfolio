## Why

The carousel currently shows anonymous items with no context and a passive background overlay; it needs to evolve into an interactive portfolio showcase where each item carries meaning (title, description, link) and every interaction — hover, click-to-pin — triggers cinematic transitions that make the particle canvas and background media feel like a unified stage.

## What Changes

- **Portfolio item metadata**: Each carousel item gains a typed `PortfolioItem` data structure with `title`, `description`, and optional `link`.
- **Hover info panel**: When a carousel item is hovered, the presentation paragraph fades out and — after a short delay — a floating metadata panel fades in showing the item's title, description, and optional link.
- **Click-to-pin**: Clicking a carousel item pins it (freezes the carousel scroll, keeps the metadata panel visible); clicking the same or another item unpins / re-pins. Unpin restores autoplay.
- **Background media upgrade**: `BackgroundVideoOverlay` accepts either a `video` or `image` source, preloads assets on mount using `<link rel="preload">` / `new Image()` / `HTMLVideoElement`, and applies best practices (e.g., `fetchpriority`, `decoding="async"`, `loading="eager"`) for fast first display.
- **Particle escape / return transition**: On carousel item hover or pin, particles animate outward off-screen before the background media fades in. On unhover / unpin, background media fades out first and then particles animate back to their resting grid positions.

## Capabilities

### New Capabilities

- `portfolio-carousel-items`: Data model and type definitions for `PortfolioItem`; updates to `InfiniteCarousel` to accept `items: PortfolioItem[]` and emit the hovered/pinned item.
- `carousel-item-info-panel`: New `CarouselItemInfoPanel` component that appears after a delay when a portfolio item is hovered or pinned, showing title, description, and optional link.
- `carousel-pin-interaction`: Click-to-pin behaviour on carousel items — state management for pinned item, pausing/resuming autoplay, and keyboard/accessibility support.
- `background-media-overlay`: Enhanced `BackgroundVideoOverlay` supporting both video and image sources, preloading strategy, and performance best-practices markup.
- `particle-escape-return-transition`: New animation mode in `useParticleEngine` that scatters all particles off-screen (escape) and a complementary return mode that re-assembles them; orchestration hook that sequences escape → show media → hide media → return.

### Modified Capabilities

- `infinite-carousel`: Carousel now accepts `PortfolioItem[]` instead of generic items; adds click-to-pin state and pauses autoplay when pinned.
- `background-video-overlay`: Gains image support, preloading, and performance attributes; existing `isVisible` + `src` API is extended (not broken).

## Impact

- **Files modified**: `app/components/InfiniteCarousel/InfiniteCarousel.tsx`, `app/components/BackgroundVideoOverlay/BackgroundVideoOverlay.tsx`, `app/components/ParticleCanvas/useParticleEngine.ts`, `app/page.tsx`
- **Files created**: `app/components/CarouselItemInfoPanel/CarouselItemInfoPanel.tsx` (+ module scss), `types/portfolio.ts`
- **No new dependencies** — transitions use CSS + existing canvas rAF loop; preloading uses native browser APIs
- **No breaking API changes** — all prop extensions are additive; existing consumers continue to work
