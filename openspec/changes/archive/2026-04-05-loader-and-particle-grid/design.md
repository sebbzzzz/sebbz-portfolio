## Context

Currently the site renders the full UI immediately on load, which means carousel images can pop in unstyled. The ParticleCanvas draws particles on a static grid without any animated background pattern. We want to gate the UI behind a loading experience that doubles as branding, and update the particle background to have organic wave-driven motion.

Two sub-tasks share a single change because they are coupled: the loader controls when the carousel and particle canvas become visible, so they must be designed together.

## Goals / Non-Goals

**Goals:**
- Full-screen ASCII loader that tracks carousel image loading progress (0–100%)
- Loader fades out when all images are loaded, then orchestrates: particles fade in → carousel + paragraph fade in
- IBM Mono font in loader, centered, matching the site's monospace aesthetic
- ASCII progress bar using `░` / `▓` characters (20 segments, matching `example-loader.js`)
- ParticleCanvas renders a wave-driven character animation as its background; existing font, character set, scatter/attract effects, and icon shapes are preserved

**Non-Goals:**
- Persisting "already loaded" state across sessions (loader runs on every page visit)
- Caching or service worker integration
- Changing the particle font, character set, or interaction behaviors
- Lazy loading images beyond what Next.js `Image` already provides

## Decisions

### D1: Loader tracks images via `onLoadProgress` prop on InfiniteCarousel

**Decision**: Add an `onLoadProgress(percent: number)` prop to `InfiniteCarousel`. The component counts how many unique real-index images have fired `onLoad`, divides by `items.length`, and calls the prop with the resulting percentage.

**Alternatives considered**:
- Track from the page using `window` load events — unreliable for individual image progress
- Use a shared loading context/store — overkill for a single use

**Rationale**: The carousel already has `handleImageLoad(realIndex)` which deduplicates by real index. Wiring progress from there is minimal and keeps the concern local.

### D2: Loader component is a standalone client component with CSS fade-out

**Decision**: A new `app/components/Loader/Loader.tsx` (`"use client"`) renders the full-screen overlay. When progress reaches 100%, it adds a CSS class that triggers a fade-out via Tailwind transition classes. On transition end, the parent reveals the rest of the UI.

**Alternatives considered**:
- Framer Motion for the fade — unnecessary dependency
- Inline style transitions — harder to maintain

**Rationale**: CSS transitions via Tailwind are sufficient and zero-dependency.

### D3: Reveal sequence managed by page-level state

**Decision**: `app/page.tsx` (or the relevant layout) holds a `revealStage` state: `"loading" | "particles" | "content"`. The Loader calls `onComplete` when done. The page then sets `revealStage` to `"particles"`, and after a short delay (e.g., 600ms) to `"content"`.

**Alternatives considered**:
- Managing inside the Loader component — breaks separation; the Loader shouldn't control what comes after it
- CSS-only sequencing — hard to coordinate between three independent components

**Rationale**: Simple state machine in the parent; each stage maps directly to which elements are visible.

### D4: ParticleCanvas wave animation added as a new rendering layer

**Decision**: In `useParticleEngine.ts`, add a wave animation tick (ported from `example-animation-canvas.js` wave math) that runs alongside the existing particle system. The wave layer is rendered first (background), then particles on top. A `time` ref increments each frame.

**Alternatives considered**:
- Replace the particle engine entirely — loses all existing icon/escape effects
- Separate canvas element for the wave — doubles canvas overhead

**Rationale**: Drawing the wave on the same canvas before the particle layer is the simplest approach with zero extra elements.

## Risks / Trade-offs

- [Risk] `onLoad` doesn't fire for cached images → **Mitigation**: Use Next.js `Image` `onLoad` which fires for cached images too (React synthetic event, fires after hydration regardless of cache)
- [Risk] Wave animation increases per-frame CPU work → **Mitigation**: Wave math is O(cols × rows) float arithmetic — same complexity as the existing particle loop; profiling not expected to flag it
- [Risk] Loader may flash for returning users with warm cache (images load instantly) → **Mitigation**: Loader will complete in <100ms in that case and fade out quickly; acceptable UX

## Migration Plan

1. Add `onLoadProgress` to `InfiniteCarousel` (non-breaking — optional prop)
2. Add `Loader` component
3. Update page to manage reveal state
4. Add wave animation to `useParticleEngine`
5. QA: `yarn typecheck && yarn lint:fix && yarn format:write`

No rollback complexity — all changes are additive or confined to existing files.

## Open Questions

- Should the loader show a label like `"loading..."` above the progress bar, or just the bar? (Assume yes — matches `example-loader.js` pattern)
- Exact fade-in duration for particles vs content? (Assume 400ms fade-in, 200ms stagger)
