## Context

The site is a Next.js 15 / React 19 portfolio. Favicons are currently static files served from `public/`. The goal is to replace the static favicon with a canvas-generated animated one that displays a seven-segment "S" / "5" character, with segments ticking through random intermediate states before locking on the final shape.

Seven-segment display segments are conventionally labeled a–g:

```
 _
|_|   a=top, b=top-right, c=bottom-right
|_|   d=bottom, e=bottom-left, f=top-left, g=middle

"S" / "5": a, f, g, c, d  (segments on)
```

## Goals / Non-Goals

**Goals:**
- Canvas-drawn favicon updated via `link[rel="icon"]` data URL
- 7-segment animation: segments tick (random on/off flicker) for ~1.5 s, then snap to "S" and hold for 3 s
- Loop indefinitely
- Pure client-side — no server involvement, no external deps
- Graceful fallback: static `public/favicon.ico` for no-JS environments (Next.js `<link>` in metadata)

**Non-Goals:**
- SVG favicon — canvas chosen for animation frame control
- Support for Safari pinned-tab `.svg` format in this change
- Any favicon other than the "S" / "5" glyph
- Matching the favicon color to user OS dark/light mode (static color is fine)

## Decisions

### 1. Canvas rendered in a `"use client"` React component

**Decision:** Encapsulate all canvas logic in `AnimatedFavicon.tsx` (`"use client"`), rendered inside the root layout. The component returns `null` — its only side effect is updating `document.querySelector('link[rel="icon"]').href`.

**Alternatives considered:**
- Inline `<script>` in layout: harder to type-check and test, no React lifecycle
- Third-party animated favicon lib: unnecessary dep for a simple case

**Rationale:** React component keeps logic co-located, testable, and tree-shakeable. Returning `null` is the idiomatic pattern for side-effect-only components.

### 2. Animation timing via `requestAnimationFrame` + elapsed-time state machine

**Decision:** Use a single `rAF` loop with a state machine: `TICKING` (random segments flip every ~80 ms) → `SETTLED` (fixed "S" for 3000 ms) → back to `TICKING`.

**Rationale:** `setInterval` has drift and can fire while tab is hidden. `rAF` pauses automatically when the tab is hidden (battery friendly) and gives precise frame timing.

Ticking phase duration: 1500 ms (enough to show ~18 random frames at 80 ms each).

### 3. Canvas size 32×32, segment geometry hard-coded

**Decision:** Draw on a 32×32 offscreen `<canvas>`. Segment geometry (7 rectangles) is computed from a `PADDING`, `WIDTH`, and `HEIGHT` constant — no external asset.

**Rationale:** 32×32 is the standard favicon resolution. Hard-coded geometry avoids complexity of a full font renderer.

### 4. Static `public/favicon.ico` kept as fallback

**Decision:** Keep the existing static favicon in `public/` and add a `<link rel="icon">` fallback in `metadata` (Next.js). The React component overwrites the `href` at runtime.

**Rationale:** Non-JS crawlers and some browsers ignore JS-updated favicons; the static file ensures a reasonable fallback.

## Risks / Trade-offs

- [Canvas not supported in very old browsers] → Mitigation: static favicon fallback covers it; canvas support is >98% globally
- [rAF pauses when tab hidden — animation resets on return] → Mitigation: acceptable UX; the "S" will re-appear quickly after ticking
- [Some browser extensions block dynamic favicon updates] → Mitigation: out of scope; falls back to static icon silently

## Migration Plan

1. Add `AnimatedFavicon` component — no breaking changes
2. Render `<AnimatedFavicon />` in `app/layout.tsx` — additive
3. Verify static fallback still present in `<head>` metadata
4. No rollback needed; removing the component restores static favicon immediately
