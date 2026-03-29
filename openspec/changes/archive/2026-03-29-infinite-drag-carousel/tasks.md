## 1. Drag Momentum Hook

- [x] 1.1 Create `hooks/use-drag-momentum.ts` with pointer event handlers, velocity tracking (rolling average over last 5 frames), and `requestAnimationFrame` deceleration loop
- [x] 1.2 Implement velocity cap at `MAX_VELOCITY = 3000 px/s` and delta-time clamp at 64ms to guard against tab-freeze spikes
- [x] 1.3 Expose `{ isDragging, onPointerDown, scrollDelta }` from the hook so the carousel component stays logic-free

## 2. InfiniteCarousel Component

- [x] 2.1 Create `app/components/InfiniteCarousel/InfiniteCarousel.tsx` — accept `items`, `onHoverChange` props; render three cloned tracks (`[...items, ...items, ...items]`)
- [x] 2.2 Wire `useDragMomentum` to the scroll container; apply `scrollDelta` via direct `scrollLeft` manipulation inside `rAF` (not React state) to avoid render-loop overhead
- [x] 2.3 Implement silent boundary jump: in the `rAF` loop, when `scrollLeft < trackWidth` or `scrollLeft > 2 * trackWidth`, reposition by exactly `±trackWidth`
- [x] 2.4 Add pointer-capture on drag start (`element.setPointerCapture(pointerId)`) so flings outside the element still register
- [x] 2.5 Suppress `onHoverChange` callbacks while `isDragging` is true; resume on pointer-up

## 3. BackgroundVideoOverlay Component

- [x] 3.1 Create `app/components/BackgroundVideoOverlay/BackgroundVideoOverlay.tsx` — accept `isVisible: boolean` and optional `src?: string` props
- [x] 3.2 Render animated CSS gradient `<div>` when `src` is absent; render `<video autoPlay loop muted playsInline>` when `src` is provided — add a `// TODO: replace with real video` comment at the placeholder
- [x] 3.3 Apply `opacity-0 pointer-events-none` / `opacity-100` transition (300ms ease) driven by the `isVisible` prop

## 4. Page Integration

- [x] 4.1 In `app/page.tsx`, add `activeCarouselIndex` state (`number | null`) and wire it to `InfiniteCarousel`'s `onHoverChange`
- [x] 4.2 Replace the static `<ul>` placeholder list with `<InfiniteCarousel>` using the six placeholder images
- [x] 4.3 Add `<BackgroundVideoOverlay isVisible={activeCarouselIndex !== null} />` as a sibling to the `ParticleCanvas` section, positioned at `z-5` (between canvas and glass panel)
- [x] 4.4 Wrap the `ParticleCanvas` section in a `<div>` with a CSS transition on opacity: `opacity-100` normally, `opacity-0` when `activeCarouselIndex !== null`

## 5. QA

- [x] 5.1 Run `yarn typecheck` — fix all type errors
- [x] 5.2 Run `yarn lint:fix && yarn format:write` — fix all lint and formatting issues
- [x] 5.3 Verify infinite loop: drag to both ends and confirm no visible jump
- [x] 5.4 Verify fast fling: flick quickly and confirm momentum carry-through with deceleration
- [x] 5.5 Verify hover: hover a carousel item → gradient overlay fades in, particle canvas fades out; mouse-out → restores
