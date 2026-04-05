## 1. Tailwind 4 Animation Setup

- [x] 1.1 Add `@keyframes shimmer` definition to `app/globals.css` inside the `@theme` block, animating `background-position` from `-200% 0` to `200% 0`
- [x] 1.2 Add `--animate-shimmer` custom animation variable referencing the keyframe, so `animate-shimmer` class is available as a Tailwind 4 utility
- [x] 1.3 Remove any existing `@keyframes carousel-shimmer` definition from `app/globals.css` if present

## 2. Skeleton Component

- [x] 2.1 Create `app/components/ui/Skeleton.tsx` — a client-safe (no directive needed) functional component
- [x] 2.2 Accept props: `className?: string` (merged via `cn()`)
- [x] 2.3 Render a `<div>` with `w-full h-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer pointer-events-none aria-hidden` and any passed `className`

## 3. InfiniteCarousel Integration

- [x] 3.1 Import `Skeleton` into `InfiniteCarousel.tsx`
- [x] 3.2 Replace the existing shimmer `<div>` (the one with inline `style` background gradient and `carousel-shimmer` animation) with `<Skeleton className="absolute inset-0 rounded-card transition-opacity duration-300" />`
- [x] 3.3 Apply conditional opacity on the `<Skeleton>`: `opacity-0` when `loadedIndices.has(realIndex)`, full opacity otherwise — keep the `loadedIndices` state logic unchanged
- [x] 3.4 Verify `<Image>` remains always-mounted (not wrapped in a conditional) so preloading still works

## 4. QA

- [x] 4.1 Run `yarn typecheck` — zero errors
- [x] 4.2 Run `yarn lint:fix` — zero errors
- [x] 4.3 Run `yarn format:write` — no diff
- [ ] 4.4 Visually verify in `yarn dev`: skeleton is visible before thumbnails load and fades smoothly once each image loads
