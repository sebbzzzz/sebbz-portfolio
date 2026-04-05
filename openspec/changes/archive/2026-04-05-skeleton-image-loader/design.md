## Context

`InfiniteCarousel` currently uses a `loadedIndices` state + an absolute-positioned `<div>` with inline `style` animation to simulate a shimmer while thumbnails load. This approach has multiple issues: the CSS animation keyframe (`carousel-shimmer`) must live in global CSS, the overlay sits on top of the image rather than replacing it, and the gradient values are nearly invisible on a dark background (`rgba(255,255,255,0.03–0.08)`), making the effect imperceptible.

The goal is to replace this with a proper `Skeleton` component that renders a visible animated shimmer as the initial placeholder, then hides once the image fires `onLoad`.

## Goals / Non-Goals

**Goals:**

- Create a reusable `Skeleton` component at `app/components/ui/Skeleton.tsx` that renders a self-contained animated gradient shimmer.
- The component accepts `width`, `height`, and `className` props (all optional) so it can fit any container.
- In `InfiniteCarousel`, render `<Skeleton>` absolutely filling the card, then fade it out (opacity transition) once the image loads — using existing `loadedIndices` state.
- The shimmer animation is defined via a Tailwind 4 `@keyframes` `animate-` utility or a CSS class — no inline `style` keyframe injection.

**Non-Goals:**

- Generic loading states for non-image content.
- SSR/streaming skeleton patterns.
- Replacing the carousel's `loadedIndices` state tracking logic.

## Decisions

**Decision 1 — Skeleton as an overlay, not a replacement**
Keep `<Image>` always mounted (good for preloading). Render `<Skeleton>` as `absolute inset-0` on top. Once loaded, fade skeleton out via `opacity-0 pointer-events-none` transition. This avoids an image swap flash and lets the browser keep preloading.

Alternative considered: conditionally unmount `<Image>` until loaded and show only `<Skeleton>`. Rejected — unmounting pauses the browser's preload pipeline.

**Decision 2 — Tailwind 4 `animate-` utility for shimmer keyframes**
Define a custom `@keyframes shimmer` and `--animate-shimmer` in `app/globals.css` (Tailwind 4 `@theme` block), then use `animate-shimmer` class on the `Skeleton`. This keeps animation self-contained in CSS, not injected via JS `style` props.

Alternative considered: CSS Modules or inline `style`. Rejected — the project uses Tailwind 4 exclusively; CSS modules would be a new pattern.

**Decision 3 — Dark-palette gradient**
Use `from-white/5 via-white/10 to-white/5` (Tailwind utility values) for a subtle sweep on a dark background, moving left-to-right via `background-position` animation. Contrast is intentional — too bright would clash with the dark portfolio theme.

## Risks / Trade-offs

- **[Risk] Skeleton flashes briefly on fast connections** → Mitigation: `transition-opacity duration-300` on the skeleton ensures a smooth fade even when load is near-instant.
- **[Risk] Tailwind 4 `@theme` custom animation may not purge correctly if class is dynamic** → Mitigation: Use a static class string `animate-shimmer` — no dynamic construction.

## Migration Plan

1. Add `@keyframes shimmer` and `--animate-shimmer` to `app/globals.css` `@theme` block.
2. Create `app/components/ui/Skeleton.tsx`.
3. In `InfiniteCarousel`, replace the inline `style` shimmer `<div>` with `<Skeleton className="absolute inset-0 rounded-card" />` controlled by `loadedIndices`.
4. Remove `carousel-shimmer` keyframe from globals if it exists.
5. Run `yarn typecheck && yarn lint:fix && yarn format:write`.
