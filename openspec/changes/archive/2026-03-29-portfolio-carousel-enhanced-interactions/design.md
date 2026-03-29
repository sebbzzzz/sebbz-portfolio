## Context

The portfolio site uses a full-viewport `ParticleCanvas` as its hero background, a bottom-anchored `InfiniteCarousel` for portfolio items, and a `BackgroundVideoOverlay` that fades in when a carousel item is hovered. Currently the carousel shows anonymous placeholder items, the overlay supports only video, and there is no cinematic sequencing between the particle canvas and the background media.

This design covers five interrelated concerns: the portfolio item data model, the hover metadata panel, click-to-pin state, background media preloading, and the particle escape/return animation sequence.

## Goals / Non-Goals

**Goals:**

- Define a `PortfolioItem` type and wire it through the carousel so every item carries title, description, and an optional link.
- Introduce a `CarouselItemInfoPanel` that appears after a 500 ms delay on hover/pin and disappears immediately on unhover/unpin.
- Add click-to-pin that freezes carousel autoplay and keeps the metadata panel open.
- Extend `BackgroundVideoOverlay` to accept image sources alongside video, preload all media eagerly, and apply browser performance best-practices.
- Implement a two-phase transition: particles escape outward first, then media fades in; media fades out first, then particles return.

**Non-Goals:**

- CMS or remote data fetching for portfolio items — data stays static in the component tree.
- Touch/mobile carousel pin (tap-to-pin is a nice-to-have, out of scope for this change).
- Complex particle physics during escape (a simple radial velocity burst is sufficient).
- Video playback controls or audio.

## Decisions

### D1 — `PortfolioItem` type lives in `types/portfolio.ts`

Items are used in `InfiniteCarousel` and potentially in `CarouselItemInfoPanel`. Per the scope rule, a type used in 2+ places goes to `types/`. An inline interface in the carousel would leak into the info panel, requiring a re-export.

Alternatives considered: Keep type inside `InfiniteCarousel` and re-export — avoids a new file but creates an import dependency from a component to another component's internal.

### D2 — Info panel delay via `setTimeout` in page-level orchestration, not inside the panel

The delay logic (show after 500 ms, cancel on unhover) belongs in the page's interaction state manager, not inside the panel component itself. This keeps `CarouselItemInfoPanel` a pure display component and makes the timing easy to test and adjust without touching the component.

Alternatives considered: `useEffect` with a delay inside the panel — couples timing to the panel and makes cancellation on rapid hover changes harder.

### D3 — Pin state lives in `app/page.tsx` alongside hover state

`isPinned` and `pinnedIndex` are page-level concerns; they affect the carousel, the info panel, and the particle/media transition. Lifting them to the page avoids prop drilling through unrelated components.

### D4 — Particle escape implemented as a new FSM state `ESCAPING` in `useParticleEngine`

The existing particle engine already uses a finite-state machine (`IDLE → FORMING → LOGO → DISPERSING`). Adding `ESCAPING` and `RETURNING` states is a natural extension. An external imperative API (`escapeParticles()` / `returnParticles()`) exposed via a ref callback is cleaner than passing a reactive prop that the engine must diff.

Escape mechanic: assign each particle a random outward angle from its current position; animate position toward `(angle * screenDiagonal)` over ~600 ms with an ease-in curve. Return: reverse — animate from current off-screen position back to the grid target using the existing lerp system.

Alternatives considered: CSS opacity fade of the entire canvas — simpler but lacks the dramatic scatter effect the user specified.

### D5 — Background media preloading uses native `<link rel="preload">` for images and `HTMLVideoElement.load()` for video

`<link rel="preload">` is inserted once into the document head by a custom hook `useMediaPreload`. Video is preloaded by constructing a detached `HTMLVideoElement`, setting `preload="auto"`, and calling `.load()` — this populates the browser cache so the overlay `<video>` renders instantly.

Alternatives considered: `new Image()` for images and ignoring video preload — `new Image()` works but `<link rel="preload">` with `as="image"` and `fetchpriority="high"` integrates better with the browser's preload scanner.

### D6 — Transition orchestration in a custom hook `useCarouselTransition`

Sequencing "escape → show media → (on deactivate) hide media → return particles" requires async coordination. A dedicated `useCarouselTransition` hook holds the transition state machine, drives the particle engine imperatively, and notifies the page when media should be visible. This keeps `app/page.tsx` clean.

## Risks / Trade-offs

[Rapid hover in/out during particle escape] → Mitigation: cancel any in-flight escape/return animation and restart from the current particle positions.

[Particle off-screen positions on small viewports] → Mitigation: escape target distance is calculated relative to `Math.hypot(width, height)`, so it always goes past the viewport edge regardless of size.

[Video preload consuming bandwidth unnecessarily] → Mitigation: preload only the `src` of the currently anticipated next item (or all items if ≤ 6); provide an opt-out `preload={false}` prop on `BackgroundVideoOverlay`.

[Info panel delay 500 ms feels slow on fast users] → Mitigation: expose the delay as a configurable prop (`hoverRevealDelay`, default 500 ms) so it can be tuned without code changes.

## Migration Plan

All changes are additive. Existing `InfiniteCarousel` consumers continue to work because `items` prop type widens from opaque to `PortfolioItem[]` and the extra fields are optional in the display layer. `BackgroundVideoOverlay` gains an `imageSrc` prop while `src` (video) remains unchanged.

No database migrations, no API changes, no deployment steps beyond a standard `yarn build` and redeploy.

## Open Questions

- What are the actual `PortfolioItem` entries? (Placeholder data will be used; user to fill in real titles, descriptions, links, and media sources.)
- Should the info panel be keyboard-accessible / focusable from the carousel items? (Assumed yes — add `aria-describedby` pointing to the panel.)
