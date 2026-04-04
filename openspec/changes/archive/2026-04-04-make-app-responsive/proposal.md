## Why

The application is built desktop-first with fixed sizing on panels, typography, and particle configuration — it breaks on mobile and small viewports. Making it fully responsive ensures the portfolio is accessible and polished across all device sizes, from phones to large monitors.

## What Changes

- Intro panel and info panel adapt from fixed `max-w-4/12` to responsive widths that fill the screen on mobile and constrain on desktop
- Carousel item sizing adjusts for mobile (larger `vw` percentage) so items are still legible and tappable
- Typography scales down on mobile (headings, body, metadata)
- Spacing and absolute positioning adapts across breakpoints (top/bottom/side gutters)
- Background video/image overlay uses proper small-viewport height units (`svh`)
- Particle canvas configuration exposes breakpoint-aware values (font size, cell height, logo scale, mouse radius) via a `useResponsiveParticleConfig` hook
- Social links and action buttons remain usable on touch devices

## Capabilities

### New Capabilities

- `responsive-layout`: Responsive layout system for the homepage — panels, spacing, and typography adapt across sm/md/lg breakpoints
- `responsive-particle-config`: Breakpoint-aware particle engine configuration delivered via a React hook that re-evaluates on window resize

### Modified Capabilities

- `infinite-carousel`: Carousel item sizing and touch interaction adapt for mobile viewports
- `background-video-overlay`: Overlay uses small-viewport units and correct object-fit defaults across all sizes

## Impact

- `app/page.tsx` — layout classes updated for responsive panels and spacing
- `app/components/ParticleCanvas/particleConfig.ts` — base config refactored to allow per-breakpoint overrides
- `app/components/ParticleCanvas/useParticleEngine.ts` — consumes responsive config instead of static constants
- `app/components/InfiniteCarousel/InfiniteCarousel.tsx` — item sizing updated, touch drag behavior preserved
- `app/components/BackgroundVideoOverlay/BackgroundVideoOverlay.tsx` — viewport units and object-fit fixed
- `app/components/CarouselItemInfoPanel/CarouselItemInfoPanel.tsx` — panel sizing made responsive
