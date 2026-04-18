## Why

The site currently uses a static favicon, missing an opportunity to add personality and brand polish. A seven-segment animated favicon that draws an "S" — matching the site's identity — will make the browser tab memorable and visually distinctive.

## What Changes

- Add a new animated favicon rendered on a `<canvas>` element via a client-side script injected in the layout
- The animation cycles through intermediate seven-segment states (random "ticking" segments), then settles on the letter "S" / digit "5" shape for 3 seconds before repeating
- Replace the current static `favicon.ico` / `<link rel="icon">` reference with the dynamically generated canvas-based favicon

## Capabilities

### New Capabilities

- `animated-favicon`: Client-side canvas favicon that animates seven-segment display segments, cycling through random states before locking on the "S" / "5" shape for 3 s, then repeating

### Modified Capabilities

- `seo-metadata`: The `<head>` favicon `<link>` tag must point to the canvas-generated data URL instead of a static file

## Impact

- New file: `app/components/AnimatedFavicon/AnimatedFavicon.tsx` (client component)
- Modified: `app/layout.tsx` — render `<AnimatedFavicon />` inside `<head>` or as a side-effect component
- Static `public/favicon.ico` remains as fallback for non-JS environments
- No external dependencies added; uses native Canvas API
