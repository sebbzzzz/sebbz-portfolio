## 1. Component Scaffold

- [x] 1.1 Create `app/components/AnimatedFavicon/AnimatedFavicon.tsx` with `"use client"` directive and a `useEffect` skeleton that returns `null`
- [x] 1.2 Define the seven-segment geometry constants (32×32 canvas, segment a–g rectangles for PADDING / WIDTH / HEIGHT)
- [x] 1.3 Define the `S_SEGMENTS` constant — boolean tuple `[a,b,c,d,e,f,g]` = `[true,false,true,true,false,true,true]`

## 2. Canvas Drawing Logic

- [x] 2.1 Implement `drawSegments(ctx, segments)` — clears canvas, draws background, then draws each active segment as a filled rectangle using the geometry constants
- [x] 2.2 Choose colors: background dark (`#111`), active segment accent color matching site palette, inactive segment subtle (`#222`)
- [x] 2.3 Verify the "S" shape renders correctly in isolation (can test in a `<canvas>` element on a scratch page)

## 3. Animation State Machine

- [x] 3.1 Define `AnimationState` const object: `{ TICKING: "ticking", SETTLED: "settled" } as const` and derive its type
- [x] 3.2 Implement the `rAF` loop inside `useEffect`: track `elapsed`, `lastFlip`, `state` via refs (not useState — no re-renders needed)
- [x] 3.3 Implement TICKING logic: every 80 ms flip each segment independently (Math.random() > 0.5), update canvas, update `link[rel="icon"]` href
- [x] 3.4 Implement transition: after 1500 ms in TICKING, switch to SETTLED, draw `S_SEGMENTS`, update favicon href
- [x] 3.5 Implement SETTLED logic: after 3000 ms, switch back to TICKING, reset `elapsed` and `lastFlip`
- [x] 3.6 Return cleanup from `useEffect` that calls `cancelAnimationFrame`

## 4. Favicon Link Wiring

- [x] 4.1 In `useEffect`, locate or create `link[rel="icon"]` element in `document.head` (create if not found)
- [x] 4.2 Ensure `app/layout.tsx` exports `metadata.icons` with `/favicon.ico` as static fallback so non-JS envs get a favicon
- [x] 4.3 Render `<AnimatedFavicon />` in `app/layout.tsx` (inside `<body>` or as a layout sibling — must be client boundary)

## 5. QA

- [x] 5.1 Verify animation plays in browser: ticking phase shows random segments, then "S" holds for ~3 s, then loops
- [x] 5.2 Verify favicon disappears cleanly from browser tab icon on unmount (navigate away test)
- [x] 5.3 Run `yarn typecheck && yarn lint:fix && yarn format:write` — all must pass
