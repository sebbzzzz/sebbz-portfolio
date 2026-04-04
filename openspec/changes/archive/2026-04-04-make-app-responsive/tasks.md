## 1. Responsive Particle Config Hook

- [ ] 1.1 Add breakpoint-aware config values to `app/components/ParticleCanvas/particleConfig.ts` (mobile/sm/lg tiers for fontSize, charCellHeight, logoScale, mouseRadius)
- [ ] 1.2 Create `app/components/ParticleCanvas/useResponsiveParticleConfig.ts` hook that reads viewport breakpoint via `window.matchMedia` and returns the appropriate config object; updates on breakpoint change
- [ ] 1.3 Update `useParticleEngine.ts` to accept config as a parameter instead of importing `PARTICLE_CONFIG` directly
- [ ] 1.4 Update `ParticleCanvas.tsx` to call `useResponsiveParticleConfig` and pass result to `useParticleEngine`

## 2. Root Layout & Viewport Units

- [ ] 2.1 Replace `h-screen` / `100vh` with `h-svh` on the root page wrapper in `app/page.tsx`
- [ ] 2.2 Verify `w-svw h-svh` is applied to the main container (or add if missing)

## 3. Panel Responsive Layout

- [ ] 3.1 Update intro panel classes in `app/page.tsx`: replace `max-w-4/12` with `w-full md:max-w-5/12 lg:max-w-4/12` and `top-3 left-3 right-3 md:top-5 md:left-5 md:right-5`
- [ ] 3.2 Update `CarouselItemInfoPanel.tsx` with the same responsive panel classes
- [ ] 3.3 Scale down heading typography: add `text-xl lg:text-2xl` to the h1/greeting in the intro panel
- [ ] 3.4 Scale body text: add `text-sm md:text-base` to description paragraph
- [ ] 3.5 Update carousel bottom offset in `app/page.tsx`: `bottom-6 md:bottom-10`

## 4. Carousel Responsive Item Sizing

- [ ] 4.1 Update carousel item width in `InfiniteCarousel.tsx` from `w-[calc(20vw-16px)]` to `w-[calc(72vw-16px)] sm:w-[calc(40vw-16px)] md:w-[calc(28vw-16px)] lg:w-[calc(20vw-16px)]`
- [ ] 4.2 Verify touch drag still works after sizing change (no regression in `use-drag-momentum.ts` touch event handling)

## 5. Background Video Overlay

- [ ] 5.1 Update `BackgroundVideoOverlay.tsx`: replace `object-contain sm:object-cover` with `object-cover` on both video and image elements
- [ ] 5.2 Ensure the overlay container uses `inset-0` absolute positioning (verify no fixed pixel heights)

## 6. Verification

- [ ] 6.1 Test at 375px viewport width: panels fit, carousel shows ~1.3 items, particle grid is readable
- [ ] 6.2 Test at 768px: panels constrain at md breakpoint, carousel shows ~2.5 items
- [ ] 6.3 Test at 1440px: original desktop layout preserved
- [ ] 6.4 Run `yarn typecheck && yarn lint:fix && yarn format:write` — no errors
