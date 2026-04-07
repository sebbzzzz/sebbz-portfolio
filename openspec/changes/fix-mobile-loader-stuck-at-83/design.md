## Context

The site loader tracks thumbnail load progress via `onLoadProgress` in `InfiniteCarousel`. Each unique `realIndex` (0–5) fires `handleImageLoad` on first `onLoad`, advancing progress by 1/6 ≈ 16.67%. The carousel renders 18 images (3 × 6 items), but Next.js `<Image>` defaults to `loading="lazy"` for non-priority items. On mobile, items at `realIndex` 3–5 sit ~3–5 item-widths (≈ 2–4 viewport widths at 72vw/item) away from the initial scroll position and are inside an `overflow: hidden` container. The browser's Intersection Observer never marks them as near the viewport, so their `onLoad` event never fires. The loader stalls permanently at 83% (5/6 loaded).

## Goals / Non-Goals

**Goals:**

- Guarantee all 6 thumbnail images load on every device during the preload phase.
- Provide a timing-based escape-hatch so the loader never freezes regardless of network or browser quirks.
- Keep the fix minimal — no changes to Loader, progress math, or reveal sequence.

**Non-Goals:**

- Changing the loader animation or UX.
- Optimising network performance beyond what the existing priority/lazy split already provides.
- Fixing video preload on mobile (videos are preloaded only on hover, after the loader is gone).

## Decisions

### D1 — `loading="eager"` on all carousel images

**Decision**: Remove the lazy-loading default by adding `loading="eager"` to every `<Image>` in `InfiniteCarousel`, regardless of the `priority` prop.

**Why eager over priority for all**: `priority` adds a `<link rel="preload">` in `<head>` and sets `loading="eager"`, but it is a stronger hint that can penalise Lighthouse scores when applied to many below-the-fold images. `loading="eager"` alone tells the browser to fetch regardless of position without emitting extra preload hints. For 18 images that already exist in the DOM and have a known `src`, this is the lightest intervention.

**Alternative considered — increase `priority` range to include realIndex 3–5**: Would help for the canonical copy but still leaves clone copies lazy. Also over-signals to the browser that all 18 images are critical. Rejected.

**Alternative considered — IntersectionObserver polyfill / rootMargin expansion**: Complex, fragile, and non-standard. Rejected.

### D2 — Timeout fallback in `page.tsx`

**Decision**: Add a `useEffect` in `page.tsx` that, after `MAX_PRELOAD_MS` (8000 ms), sets `realProgress` to 100 if it hasn't reached that value yet. The timer starts only after `fakeReady` is true.

**Why 8 s**: Gives slow 3G connections ample time to fetch thumbnails (~30–50 KB each) while not blocking users on truly broken networks indefinitely.

**Why only after fakeReady**: The fake 2-second animation runs first; starting the timeout only after fakeReady means the maximum visible wait stays bounded to `2000 + 8000 = 10 s`.

**Alternative considered — remove the real-progress tracking, rely solely on fake progress**: Loses the "images are actually ready" guarantee. Rejected.

## Risks / Trade-offs

- [Eager loading 18 images] → Marginally higher initial bandwidth on mobile. Mitigated: thumbnails are small PNGs/JPGs, three copies share the browser cache so only 6 unique fetches occur.
- [Timeout fallback fires too early on very slow connections] → Content reveals before all images are loaded, showing Skeleton placeholders briefly. Mitigated: Skeletons already exist for this purpose; the loader's job is to hide the layout shift, not guarantee pixel-perfect display.
- [timeout fires and some image loads complete after] → `handleImageLoad` deduplication (`loadedIndicesRef`) is safe to call after the loader is gone; no state corruption.
