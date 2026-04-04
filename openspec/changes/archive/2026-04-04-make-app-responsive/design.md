## Context

The portfolio app was built desktop-first. The homepage (`app/page.tsx`) uses fixed absolute positioning (`top-5 left-5 max-w-4/12`) for panels, static pixel values in particle configuration, and minimal viewport adaptation. On mobile viewports (<768px) the layout breaks: panels are too wide, typography is oversized, carousel items are too small to tap, and the particle grid density is unusable.

The app uses Tailwind CSS 4 with custom tokens and has a 12-column grid system in `styles/grid.scss` that is currently unused. Breakpoints available: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).

## Goals / Non-Goals

**Goals:**

- Panels (intro, info) fill screen width on mobile, constrain on desktop — no broken overflow
- Carousel items scale up on mobile (`vw`-based) so they remain tappable
- Typography scales down on mobile with Tailwind responsive prefixes
- Spacing/gutters scale with breakpoints
- Particle canvas configuration adapts to viewport size via a hook
- Background overlay uses `svh` units for correct mobile browser chrome handling
- Touch drag works correctly on carousel (no regression)

**Non-Goals:**

- A separate mobile layout or navigation drawer
- SSR/hydration changes
- Carousel pin behavior changes on touch (same interaction model)
- Animations disabled on mobile (reduced-motion is a separate concern)
- Support for viewports below 320px

## Decisions

### D1: Tailwind responsive prefixes over CSS media queries in SCSS

Use Tailwind's `sm:`, `md:`, `lg:` prefixes directly on JSX class strings rather than writing SCSS media queries. **Why:** All other layout and spacing in this codebase uses Tailwind utilities. Mixing approaches would fragment the styling mental model. The grid.scss system exists but is unused — we won't adopt it here since Tailwind utilities cover the needed cases.

### D2: `useResponsiveParticleConfig` hook replaces static `particleConfig` import

Extract a new hook that derives particle config from a breakpoint snapshot and updates on window resize via `ResizeObserver` or `matchMedia` listeners. The hook returns the same shape as `PARTICLE_CONFIG` so `useParticleEngine` can consume it with minimal changes. **Why:** The engine already accepts `ResizeObserver` updates for canvas size; adding config reactivity follows the same pattern. The alternative (CSS custom properties for particle config) doesn't work because the canvas API reads JS values, not CSS.

### D3: Breakpoint values for particle config

| Breakpoint      | fontSize | charCellHeight | logoScale | mouseRadius |
| --------------- | -------- | -------------- | --------- | ----------- |
| mobile (<640px) | 10       | 20             | 0.30      | 60          |
| sm (640–1023px) | 12       | 24             | 0.38      | 80          |
| lg (≥1024px)    | 14       | 30             | 0.45      | 100         |

**Why:** At 14px font and 30px cell height on a 375px screen the grid is too dense and the character columns overflow. Scaling down to 10px/20px gives ~37 columns at 375px which is legible. Logo scale at 0.30 prevents icon formation from consuming the entire mobile screen.

### D4: Panel width strategy — full-width on mobile, capped on desktop

Intro panel and info panel: `w-full max-w-full md:max-w-5/12 lg:max-w-4/12`. On mobile the panels are full-width (minus gutters), on md+ they start constraining. The `absolute` positioning is kept but `right-5` on mobile allows the element to be full-width minus the gutter without needing to change the positioning model.

### D5: Carousel item width increases on mobile

Current: `w-[calc(20vw-16px)]`. Mobile override: `w-[calc(72vw-16px)] sm:w-[calc(40vw-16px)] md:w-[calc(28vw-16px)] lg:w-[calc(20vw-16px)]`. **Why:** At 20vw on a 375px screen each item is 75px wide — too small to distinguish. 72vw shows ~1.3 items in view, making the carousel feel like a peeking slider which is a standard mobile pattern.

### D6: Small-viewport units for overlay and main wrapper

Replace `h-screen`/`h-full` on the root container with `h-svh` and ensure the overlay uses `inset-0` (no fixed px). **Why:** Mobile browsers have dynamic UI chrome (address bar, toolbars) that makes `100vh` unreliable. `svh` (small viewport height) is the conservative safe zone.

## Risks / Trade-offs

- **Particle config hook adds re-renders on resize** → Debounce the `matchMedia` change listener (already done for the canvas resize observer). Config only changes at breakpoint boundaries, not continuously.
- **`w-[calc(72vw-16px)]` on mobile changes carousel feel significantly** → Intentional. The alternative (keeping 20vw) makes items unusable on mobile.
- **`useParticleEngine` signature change** → The hook currently reads `PARTICLE_CONFIG` directly from the module. If we pass config as a prop/arg, all consumers must update. There is only one consumer (`ParticleCanvas.tsx`) so the impact is minimal.
- **Logo formation on mobile** → With fewer particles (smaller grid) the icon silhouette is less detailed. Acceptable: the escape animation is the primary visual moment; icon clarity is secondary.
