## 1. InfiniteCarousel — load progress callback

- [x] 1.1 Add optional `onLoadProgress?: (percent: number) => void` to `InfiniteCarouselProps`
- [x] 1.2 Update `handleImageLoad` to compute `Math.round((loadedCount / items.length) * 100)` and call `onLoadProgress`
- [x] 1.3 Verify duplicate real-index loads across clones do not double-count (existing dedup logic already covers this — confirm and test)

## 2. Loader component

- [x] 2.1 Create `app/components/Loader/Loader.tsx` as a `"use client"` component
- [x] 2.2 Render a full-screen centered overlay with IBM Mono font
- [x] 2.3 Render a 20-segment ASCII progress bar using `▓` (filled) and `░` (empty) characters based on `progress` prop
- [x] 2.4 Render a `progress%` label below the bar
- [x] 2.5 When `progress === 100`, apply CSS fade-out transition class
- [x] 2.6 On `transitionend`, call `onComplete` callback once and hide the overlay (`display: none` or `pointer-events: none`)

## 3. Page reveal sequence

- [x] 3.1 In the page component, add `revealStage` state: `"loading" | "particles" | "content"`
- [x] 3.2 Render `<Loader progress={loadProgress} onComplete={handleLoaderComplete} />` in the page
- [x] 3.3 In `handleLoaderComplete`, set `revealStage` to `"particles"`
- [x] 3.4 After 600ms delay from `"particles"`, set `revealStage` to `"content"`
- [x] 3.5 Apply `opacity-0` / `opacity-100` Tailwind classes (with `transition-opacity duration-400`) to ParticleCanvas based on `revealStage >= "particles"`
- [x] 3.6 Apply `opacity-0` / `opacity-100` Tailwind classes (with `transition-opacity duration-400`) to the carousel section and main paragraph based on `revealStage === "content"`
- [x] 3.7 Wire `onLoadProgress` from `<InfiniteCarousel>` to update `loadProgress` state in the page

## 4. ParticleCanvas — wave animation background

- [x] 4.1 Add a `timeRef = useRef(0)` to `useParticleEngine` (or equivalent animation state)
- [x] 4.2 In the animation tick, increment `timeRef.current` by `0.02` each frame
- [x] 4.3 Before drawing particles, iterate over the canvas grid (cols × rows) and compute the wave value using the multi-wave formula from `example-animation-canvas.js` (wave1 + wave2 + wave3 + wave4)
- [x] 4.4 For cells above threshold (0.4), draw the appropriate character using the existing particle character set and font
- [x] 4.5 For cells below threshold, clear that cell (draw empty space)
- [x] 4.6 Ensure particles and icon-formation effects are drawn on top of the wave layer (existing draw calls run after wave draw)
- [x] 4.7 Verify wave characters use the same `fontSize` / `fontFamily` from particle config

## 5. QA

- [x] 5.1 Run `yarn typecheck` — must pass with zero errors
- [x] 5.2 Run `yarn lint:fix` — must pass
- [x] 5.3 Run `yarn format:write` — must pass
- [ ] 5.4 Verify loader appears on page load and counts to 100%
- [ ] 5.5 Verify fade-out → particles → carousel reveal sequence plays correctly
- [ ] 5.6 Verify wave animation is visible behind particles
- [ ] 5.7 Verify particle mouse-escape and icon-formation effects still work
