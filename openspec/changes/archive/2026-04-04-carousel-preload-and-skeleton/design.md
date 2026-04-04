## Context

The portfolio homepage (`app/page.tsx`) renders an `InfiniteCarousel` of project thumbnails. Clicking (pinning) a carousel item triggers a particle animation and then reveals a full-screen background video via `BackgroundVideoOverlay`. The video only begins buffering at pin time, causing a visible black frame while the browser fetches the first segment — typically 0.5–2 s on a normal connection.

Separately, carousel thumbnail `<Image>` elements rendered by Next.js load asynchronously. Because images are loaded on-demand, the carousel shows empty cards that fill in sequentially on first paint — an unpolished visual that conflicts with the site's premium feel.

The existing `useMediaPreload` hook in `hooks/use-media-preload.ts` already supports both image and video preloading via detached `<video>` elements and `<link rel="preload">` tags. No new network primitives are needed.

## Goals / Non-Goals

**Goals:**

- Preload a carousel item's `mediaSrc` (video or image) when the user hovers it so playback is instant on click.
- Show an animated shimmer skeleton on each carousel card while its thumbnail is loading; fade it out once the image is ready.
- Reuse the existing `useMediaPreload` hook — no new dependencies or network APIs.

**Non-Goals:**

- Preloading all videos upfront on page load (bandwidth concern; only preload the hovered item).
- Skeleton for the background video overlay itself (separate concern, already handled by `useMediaPreload` in `BackgroundVideoOverlay`).
- Changes to the particle animation or pin flow.

## Decisions

### D1 — Trigger preload from `page.tsx`, not inside `InfiniteCarousel`

`InfiniteCarousel` is a pure presentation component; it does not know about media sources. `page.tsx` already owns `PORTFOLIO_ITEMS` and `activeCarouselIndex`. Calling `useMediaPreload` in `page.tsx` when `activeCarouselIndex` changes keeps concerns separated and avoids threading `mediaSrc` data down to the carousel.

_Alternative considered_: Pass all `mediaSrc` values into the carousel and preload internally — rejected because it would couple a UI scroll component to domain data and violate the existing component contract.

### D2 — Per-card `isLoaded` state tracked by `realIndex` in `InfiniteCarousel`

The carousel renders three copies of each item (tripled array) for infinite-scroll. Loaded state must be keyed by `realIndex` (not the tripled array index `i`) so all three copies of an item share a single loaded signal. A `Set<number>` in a `useRef` (mutated without re-render) will track which indices have fired `onLoad`, and a parallel `useState<Set<number>>` (shallow-copied on update) will drive the shimmer visibility — this avoids per-render `Set` allocation while keeping React's render cycle correct.

_Alternative considered_: A simple boolean array indexed by `realIndex` — equivalent but a `Set` communicates "membership" intent more clearly.

### D3 — Shimmer is a positioned `<div>` overlay inside `<figure>`, not a wrapper

The shimmer sits `absolute inset-0` inside the existing `<figure>` that already has `overflow-hidden rounded-card`. No DOM restructuring needed. It uses a CSS linear-gradient animation (matching the site's dark palette) and transitions to `opacity-0` once loaded, then is removed from the paint tree via `pointer-events-none`.

## Risks / Trade-offs

- **Excessive video preload on slow hover**: A user quickly scanning across cards will trigger preload for each hovered item. Each preload creates a detached `<video>` element and issues a network request. The browser will abort lower-priority in-flight requests as the user moves, limiting real waste. Mitigation: The existing `useMediaPreload` cleans up (`video.src = ""`) when the src changes (i.e., hover moves to next item), which signals the browser to abort. This is acceptable for a portfolio site with 6 items.
- **Shimmer flicker on fast connections**: On very fast connections, images may load before React commits the skeleton render, causing a one-frame flash. Mitigation: The `onLoad` event fires after paint, so the shimmer will always render at least one frame; imperceptible in practice.
- **Three-copy image onLoad**: Each of the three tripled copies fires `onLoad` independently. Only the first fire per `realIndex` matters. The `Set` lookup is O(1) and the state update is idempotent, so duplicate fires are harmless.

## Migration Plan

No data migration or feature flags needed. Changes are confined to:

1. `app/page.tsx` — add one `useMediaPreload` call.
2. `app/components/InfiniteCarousel/InfiniteCarousel.tsx` — add shimmer overlay and `onLoad` tracking.

Rollback: revert the two files. No DB, API, or infra changes.
