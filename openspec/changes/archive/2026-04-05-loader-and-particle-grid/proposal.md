## Why

The site currently has no loading experience — assets load asynchronously and the carousel images can pop in unstyled. Additionally, the ParticleCanvas background uses a static grid layout, but we want it to be animated with an organic wave-driven character animation for a more dynamic visual.

## What Changes

- **New**: A full-screen ASCII-style loader overlay that counts 0%→100% as carousel images load, then fades out revealing the UI
- **New**: The loader uses IBM Mono font, centered layout, with an ASCII progress bar inspired by `example-loader.js`
- **Modified**: After loader fades out, ParticleCanvas renders first, then the carousel and main paragraph fade in
- **Modified**: `ParticleCanvas` replaces its grid rendering with a wave-based character animation (ported from `example-animation-canvas.js`) — existing font, character set, icon-escape effects and particle behaviors are preserved

## Capabilities

### New Capabilities

- `site-loader`: Full-screen ASCII progress loader shown on first visit; tracks image loading from the InfiniteCarousel; fades out at 100% and orchestrates the reveal sequence (particles → carousel + paragraph)

### Modified Capabilities

- `infinite-carousel`: Exposes an `onLoadProgress` callback (0–100) so the loader can track per-image load events across the tripled item set
- `responsive-particle-config`: ParticleCanvas animation loop switches from static grid rendering to a wave-driven character animation; existing particle interaction, icon shapes, and font remain unchanged

## Impact

- `app/components/InfiniteCarousel/InfiniteCarousel.tsx` — add `onLoadProgress` prop
- `app/components/ParticleCanvas/useParticleEngine.ts` — replace grid tick with wave animation
- New component: `app/components/Loader/` (client component)
- Page layout (`app/page.tsx` or root layout) — wrap content with loader, manage reveal state
- No new dependencies required (canvas + CSS animations only)
