## Context

The homepage `app/page.tsx` has a `col-7 container-particle` section with measured dimensions (`particleContainerDimensions`) already wired via `useRef` + `ResizeObserver`. The section renders `{/* Particle Feature */}`. Pixi.js v7 and `@pixi/react` v7 are installed but unused.

## Goals / Non-Goals

**Goals:**

- ASCII character grid fills the right column, visible on first load
- Idle oscillation and diagonal color wave run continuously
- Mouse proximity over canvas triggers z-axis scatter (scale-down + radial push)
- Hovering LinkedIn/Twitter/Email links triggers logo-formation animation
- Config constants (`PARTICLE_COLORS`, `PARTICLE_CONFIG`) are co-located and easy to tweak
- Clean Strict Mode behavior — no WebGL context leaks, no stale rAF loops

**Non-Goals:**

- Mobile touch support (portfolio targets desktop)
- SSR rendering of canvas (canvas is client-only by nature)
- Pixi.js or WebGL — Canvas 2D only
- Generating logo bitmaps dynamically from images — bitmaps are hand-authored constants

## Decisions

### Canvas 2D over Pixi.js

**Decision**: Use `HTMLCanvasElement` with Context2D, not Pixi.js.
**Rationale**: `@pixi/react` v7 uses legacy `ReactDOM.render` internally. Under React 19 Strict Mode, effects double-fire → two `PIXI.Application` instances created against the same canvas → WebGL context loss warnings and difficult cleanup. Canvas 2D `fillText` is purpose-built for ASCII character rendering; at ~3,500 characters per frame it comfortably fits within a 16ms budget. No new dependency required.
**Alternative**: Pixi.js with manual `new PIXI.Application()` (bypassing `@pixi/react`). Rejected: still requires manual WebGL context cleanup and adds complexity without measurable performance benefit at this particle count.

### All animation state in refs, not React state

**Decision**: Particle array, rAF handle, mouse position, wave phase, and animation FSM state all live in `useRef`. Only `activeShape` (from parent) and `width`/`height` (from parent) are React props.
**Rationale**: Updating React state inside a `requestAnimationFrame` callback at 60fps causes cascading re-renders and tearing. Refs are synchronously readable in the rAF loop without scheduling overhead.

### Greedy nearest-neighbor logo assignment

**Decision**: When transitioning to a logo shape, assign particles to logo pixels using a greedy nearest-neighbor algorithm (run once at transition start).
**Rationale**: O(particles × logo_pixels) ≈ 3,500 × 256 = ~900K distance calculations — completes in <1ms. Produces visually natural transitions (nearby particles flow to nearby logo pixels) vs random assignment which creates visual chaos.

### Hand-authored binary bitmaps for logos

**Decision**: Logo shapes are `number[][]` constants in `logoBitmaps.ts`.
**Rationale**: No image loading, no canvas offscreen rendering, no font dependency. Bitmaps are authored once and don't change. The simplified LinkedIn `in` mark fits in a 15×16 grid; Twitter/X in 14×14.

### devicePixelRatio scaling

**Decision**: Canvas `width`/`height` attributes are set to `cssWidth * dpr` / `cssHeight * dpr`; context is scaled by `dpr`; CSS size is `100% × 100%`.
**Rationale**: Without this, text renders at half resolution on 2x Retina displays (blurry characters).

## Risks / Trade-offs

- **Font not loaded at first frame** → `document.fonts.ready` promise gates particle init. If fonts load late, canvas is blank for a frame. Mitigation: fallback to `monospace` for character width measurement if IBM Plex Mono is unavailable.
- **Bitmap maintenance** → Adding a new logo shape requires hand-authoring a binary array. Mitigation: bitmaps are grouped in one file (`logoBitmaps.ts`) with clear coordinate comments.
- **Strict Mode double-init** → rAF loop fires twice on mount. Mitigation: cleanup function in `useEffect` calls `cancelAnimationFrame` and sets a `destroyed` flag checked at loop start.
- **Resize thrashing** → On rapid resize, particle array is rebuilt each frame. Mitigation: debounce resize prop with a 150ms delay in the hook.
