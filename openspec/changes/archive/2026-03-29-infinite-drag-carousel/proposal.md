## Why

The portfolio home page currently has a static placeholder list of images with no interactivity. A dynamic, physics-based infinite carousel will make the page visually engaging and demonstrate frontend craftsmanship — a key goal for a developer portfolio.

## What Changes

- Replace the static `<ul>` image list in `app/page.tsx` with an `InfiniteCarousel` client component
- Implement momentum-based drag interaction: grab velocity directly influences scroll speed
- Add per-item hover state that triggers a background video swap, replacing the particle canvas while a card is hovered
- Use a temporary placeholder video (color-cycling CSS animation or a looping gradient video) until real assets are available
- Wire hover state up through a callback so `ParticleCanvas` visibility can toggle smoothly

## Capabilities

### New Capabilities

- `infinite-carousel`: Horizontally scrolling, looping carousel with momentum drag, velocity-amplified fling, and per-item hover callbacks
- `background-video-overlay`: Full-viewport video layer that fades in/out over the particle canvas when an carousel item is hovered

### Modified Capabilities

- (none)

## Impact

- **Files modified**: `app/page.tsx` — replaces static list, wires hover callback
- **New components**: `app/components/InfiniteCarousel/InfiniteCarousel.tsx`, `app/components/BackgroundVideoOverlay/BackgroundVideoOverlay.tsx`
- **New hook**: `hooks/use-drag-momentum.ts` (used only by InfiniteCarousel initially, but reusable)
- **Dependencies**: No new npm packages required; uses native pointer events and `requestAnimationFrame`
- **Assets**: Placeholder video handled with a CSS `@keyframes` gradient animation rendered to a `<canvas>` or `<div>` until real videos are provided
