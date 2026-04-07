## Why

On mobile the site loader stalls at 83% (5 of 6 portfolio thumbnails) because Next.js `<Image>` defaults to `loading="lazy"` for non-priority items, and on mobile the carousel's large item size (72vw per item) places items 3–5 well outside the lazy-load intersection threshold when the overflow container is `hidden`. The sixth image never fires `onLoad`, so `realProgress` never reaches 100% and the loader freezes.

## What Changes

- Set `loading="eager"` on all `<Image>` elements inside `InfiniteCarousel` so every thumbnail is fetched unconditionally, regardless of viewport proximity.
- Add a timeout-based safety-net fallback in `page.tsx` that force-completes the loader after a configurable maximum wait (e.g. 8 s) in case any single asset still fails to load on slow connections.

## Capabilities

### New Capabilities

- `loader-mobile-progress-fix`: Ensures the preload progress bar always reaches 100% on mobile by making carousel thumbnail loading unconditional and adding a timeout escape-hatch.

### Modified Capabilities

- `site-loader`: The progress-reporting contract (`onLoadProgress`) is unchanged; the fix is upstream in how images are loaded, not in the Loader component itself.

## Impact

- `app/components/InfiniteCarousel/InfiniteCarousel.tsx` — `loading` prop change on `<Image>`
- `app/page.tsx` — add a `useEffect` timeout fallback that clamps `realProgress` to 100 after N seconds
