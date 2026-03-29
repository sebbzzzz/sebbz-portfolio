## 1. Data Model

- [x] 1.1 Create `types/portfolio.ts` with `PortfolioItem` interface (id, title, description, optional link, optional mediaSrc, optional mediaType)
- [x] 1.2 Define static `PORTFOLIO_ITEMS` placeholder array in `app/page.tsx` using the `PortfolioItem` type (6 entries with titles, descriptions, example links)

## 2. Background Media Overlay

- [x] 2.1 Add `imageSrc?: string` prop to `BackgroundVideoOverlay` alongside existing `src` (video)
- [x] 2.2 Render `<img>` with `loading="eager" decoding="async" fetchpriority="high"` when `imageSrc` is set and `src` is absent
- [x] 2.3 Add `preload="auto"` to the existing `<video>` element and confirm `autoPlay loop muted playsInline` are present
- [x] 2.4 Create `useMediaPreload` hook that injects `<link rel="preload">` into `<head>` for images and constructs a detached `HTMLVideoElement` with `preload="auto"` + `.load()` for videos; cleans up on src change
- [x] 2.5 Call `useMediaPreload` inside `BackgroundVideoOverlay` with the active `src` or `imageSrc`

## 3. Particle Escape / Return Transition

- [x] 3.1 Add `ESCAPING` and `RETURNING` to the particle engine FSM state enum in `useParticleEngine.ts`
- [x] 3.2 Implement escape animation: assign each particle a random radial direction, animate position to `direction * Math.hypot(width, height) * 1.2` with ease-in over ~600 ms; call `onEscapeComplete` when all particles are off-screen
- [x] 3.3 Implement return animation: animate each particle from current position back to its resting grid cell using the existing lerp system over ~600 ms; transition to `IDLE` on completion
- [x] 3.4 Expose imperative `escape(onComplete: () => void)` and `return()` methods on the particle engine via a forwarded ref or callback ref pattern
- [x] 3.5 Handle interruption: if `escape()` is called while `RETURNING`, or `return()` while `ESCAPING`, cancel current phase and start the new one from current particle positions

## 4. Transition Orchestration Hook

- [x] 4.1 Create `useCarouselTransition` hook in `app/` (local, one use) that accepts `isActive: boolean` and the particle engine imperative API
- [x] 4.2 On `isActive` becoming `true`: call `escape()`, in `onComplete` set `isMediaVisible = true`
- [x] 4.3 On `isActive` becoming `false`: set `isMediaVisible = false`, after 300 ms (CSS fade-out duration) call `return()`
- [x] 4.4 Return `isMediaVisible` boolean from the hook for use by `BackgroundVideoOverlay`

## 5. Carousel Pin Interaction

- [x] 5.1 Add `pinnedIndex` and `onPinChange` props to `InfiniteCarousel`
- [x] 5.2 Track drag distance in `useDragMomentum`; expose `isDragging` and `dragDistance` so the carousel can distinguish click vs drag
- [x] 5.3 In `InfiniteCarousel` item click handler: if `dragDistance < 5px`, call `onPinChange(index === pinnedIndex ? null : index)` to toggle pin
- [x] 5.4 Suspend autoplay rAF advancement when `pinnedIndex !== null`
- [x] 5.5 Apply a visible "pinned" ring or border class to the pinned item

## 6. Carousel Item Info Panel

- [x] 6.1 Create `app/components/CarouselItemInfoPanel/CarouselItemInfoPanel.tsx` as a pure display component accepting `item: PortfolioItem | null` and `isVisible: boolean`
- [x] 6.2 Render title, description, and optional `<a>` link (target `_blank` + `rel="noopener noreferrer"`) inside a styled glass-style panel
- [x] 6.3 Apply fade-in/fade-out CSS transition via Tailwind `transition-opacity`; respect `isVisible` for opacity and `pointer-events`
- [x] 6.4 In `app/page.tsx`: manage `revealedItem: PortfolioItem | null` state with a `setTimeout` (500 ms) on hover/pin and immediate clear on unhover/unpin
- [x] 6.5 Pass `revealedItem` and `isVisible` to `CarouselItemInfoPanel`; position panel so it does not intercept carousel drag events

## 7. Page Wiring

- [x] 7.1 Pass `PORTFOLIO_ITEMS` to `InfiniteCarousel` as the `items` prop
- [x] 7.2 Connect `pinnedIndex` / `onPinChange` state in `app/page.tsx`
- [x] 7.3 Thread the particle engine imperative ref from `ParticleCanvas` to `useCarouselTransition`
- [x] 7.4 Replace direct `isVideoOverlayVisible` toggle with `isMediaVisible` from `useCarouselTransition`
- [x] 7.5 Pass the active carousel item's `mediaSrc` and `mediaType` to `BackgroundVideoOverlay` as `src` or `imageSrc`

## 8. QA

- [x] 8.1 Run `yarn typecheck` — zero errors
- [x] 8.2 Run `yarn lint:fix` — zero warnings
- [x] 8.3 Run `yarn format:write` — no diffs
- [x] 8.4 Verify escape/return works for rapid hover toggle (no stuck particles)
- [x] 8.5 Verify pin suspends autoplay and info panel stays visible
- [x] 8.6 Verify clicking pinned item unpins and restores autoplay
- [x] 8.7 Verify image and video backgrounds both preload and display without loading flash
