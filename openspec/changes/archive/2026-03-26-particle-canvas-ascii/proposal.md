## Why

The homepage has a right-column placeholder section (`col-7 container-particle`) with measured dimensions but no visual content. Adding an ASCII particle canvas animation transforms this empty space into a creative, interactive showcase that demonstrates engineering craft and makes the portfolio visually distinctive.

## What Changes

- New `ParticleCanvas` component renders an animated ASCII character grid inside `col-7`
- `app/page.tsx` gains link hover state (`hoveredLink`) to trigger logo-formation animations
- New `app/components/ParticleCanvas/` directory with all animation logic

## Capabilities

### New Capabilities

- `particle-canvas`: Interactive ASCII character grid with idle oscillation, diagonal color wave, mouse z-axis scatter effect, and logo-formation animation on link hover

### Modified Capabilities

- `sdd-architecture`: Component added to `app/components/` following existing directory conventions

## Impact

- **Files created**: `app/components/ParticleCanvas/ParticleCanvas.tsx`, `useParticleEngine.ts`, `particleConfig.ts`, `logoBitmaps.ts`, `ParticleCanvas.module.scss`
- **Files modified**: `app/page.tsx` (adds hover state + renders `<ParticleCanvas>`)
- **Dependencies**: No new npm packages — uses browser Canvas 2D API only (Pixi.js is installed but not used due to React 19 Strict Mode incompatibility with @pixi/react v7)
- **Performance**: ~3,500 particles at 14px, well within 16ms frame budget on Canvas 2D
