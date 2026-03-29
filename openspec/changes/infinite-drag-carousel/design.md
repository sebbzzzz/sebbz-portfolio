## Context

`app/page.tsx` currently renders a static `<ul>` of six placeholder images with no interactivity. The page already has a `ParticleCanvas` that fills the viewport and responds to icon hover. The new carousel must coexist with that canvas — sharing the same hover-callback pattern — and introduce physics-based drag without adding new npm dependencies.

## Goals / Non-Goals

**Goals:**

- Infinite horizontal scroll via a duplicated-track technique (clone items ahead/behind, silently reposition when boundaries are crossed)
- Momentum drag: pointer-down captures start position; pointer-move accumulates velocity; pointer-up releases with a `requestAnimationFrame` deceleration loop; fast fling = higher exit velocity
- Per-item hover triggers a full-viewport background video overlay (fade in) that replaces the particle canvas visually; hover-out fades it back out
- Placeholder video: a looping CSS-animated gradient `<div>` until real assets are supplied; swapped in by setting a prop to a video URL when ready
- No new npm packages

**Non-Goals:**

- Touch-specific gestures (pinch-to-zoom, multi-touch) — pointer events cover touch too, so basic touch drag works, but no special touch UX
- Keyboard navigation within the carousel (out of scope for this change)
- Lazy-loading real video assets (deferred; placeholder handles the gap)

## Decisions

### 1. Infinite scroll via DOM cloning, not CSS transforms on a virtual list

**Decision**: Duplicate the item array (render `[...items, ...items, ...items]`) and jump the scroll offset silently when it drifts past the first or last clone boundary.

**Rationale**: Simpler than a virtual list for a small, fixed item count. CSS `scroll-snap` is not used because it fights the momentum physics. A single `scrollLeft` manipulation on the container during `rAF` keeps everything in one coordinate space.

**Alternative considered**: CSS `animation` marquee — rejected because it cannot be paused/grabbed by the user without fighting the animation timeline.

### 2. Pointer Events API for drag, not mouse/touch split

**Decision**: Use `onPointerDown` / `onPointerMove` / `onPointerUp` + `setPointerCapture`.

**Rationale**: Single code path for mouse and touch. `setPointerCapture` ensures move/up events continue even when the pointer leaves the element, which is critical for flings.

### 3. `useDragMomentum` hook encapsulates all physics

**Decision**: Extract drag state, velocity tracking, and deceleration loop into `hooks/use-drag-momentum.ts`. The component only receives `{ isDragging, onPointerDown }` and a `translateX` reactive value.

**Rationale**: Keeps the carousel render tree clean and makes the physics testable in isolation. The hook is placed in `hooks/` (shared scope) because it has no UI coupling and could be reused.

### 4. Background video overlay as a sibling layer, not inside ParticleCanvas

**Decision**: `BackgroundVideoOverlay` is an absolutely-positioned sibling to `ParticleCanvas` in `page.tsx`, controlled by the same `activeItemIndex` state. `ParticleCanvas` fades to `opacity-0` while the overlay fades in.

**Rationale**: Avoids modifying `ParticleCanvas` internals. The overlay sits between the canvas and the glass panel in z-order (`z-5`), so content remains above both.

### 5. Placeholder video = animated CSS gradient div

**Decision**: When no real video URL is provided, render a `<div>` with a looping `@keyframes` background-gradient animation as the "video" placeholder.

**Rationale**: Zero additional assets, no `<video>` codec concerns, visually distinct enough to verify the hover mechanic works. Real video is wired by passing a `src` prop — the component renders `<video>` when `src` is set, the animated div when it is not.

## Risks / Trade-offs

- **Silent scroll jump janks on slow devices** → Mitigation: jump only when `scrollLeft` crosses boundaries by >1px; the jump amount equals exactly one full track width, so items appear stationary.
- **Velocity accumulation over many frames drifts** → Mitigation: cap maximum velocity at `MAX_VELOCITY = 3000px/s`; `requestAnimationFrame` timestamp delta is clamped to 64ms to absorb tab-switch freezes.
- **Three-copy DOM duplication** → For ≤20 items the DOM cost is negligible. If the item count grows beyond ~50, switch to a virtual approach.
- **CSS gradient placeholder may look unpolished** → Acceptable; it is explicitly temporary and documented in code with a `// TODO: replace with real video` comment.
