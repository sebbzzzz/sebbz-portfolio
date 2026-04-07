## 1. Carousel — Eager Image Loading

- [x] 1.1 In `app/components/InfiniteCarousel/InfiniteCarousel.tsx`, add `loading="eager"` to the `<Image>` component so all thumbnails load unconditionally regardless of scroll position

## 2. Page — Timeout Escape-hatch

- [x] 2.1 In `app/page.tsx`, define a `MAX_PRELOAD_MS` constant (8000)
- [x] 2.2 Add a `useEffect` that starts a timeout after `fakeReady` becomes true; if `realProgress < 100` when the timeout fires, call `setRealProgress(100)` to unblock the loader

## 3. QA

- [ ] 3.1 Run `yarn typecheck && yarn lint:fix && yarn format:write` — all must pass
- [ ] 3.2 Verify on a mobile viewport (Chrome DevTools) that the loader reaches 100% without manual scrolling
- [ ] 3.3 Verify the timeout does NOT fire prematurely on a normal desktop connection (images load before 8 s)
