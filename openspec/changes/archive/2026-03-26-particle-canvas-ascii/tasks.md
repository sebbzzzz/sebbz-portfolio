## 1. Config and Data Files

- [x] 1.1 Create `app/components/ParticleCanvas/particleConfig.ts` with `PARTICLE_COLORS` and `PARTICLE_CONFIG` constants
- [x] 1.2 Create `app/components/ParticleCanvas/logoBitmaps.ts` with binary pixel bitmaps for `linkedin`, `twitter`, and `email` shapes

## 2. Animation Engine Hook

- [x] 2.1 Create `app/components/ParticleCanvas/useParticleEngine.ts` — skeleton with `useEffect` that sets up and tears down the rAF loop
- [x] 2.2 Implement particle grid initialization (measure char width, compute rows/cols, create particle array with random phase offsets and chars)
- [x] 2.3 Implement idle oscillation (sin/cos per-particle with phase offsets)
- [x] 2.4 Implement diagonal color wave (wavePhase advancement, per-particle color interpolation)
- [x] 2.5 Implement canvas draw loop (clear, set font, per-particle `ctx.save/translate/scale/fillText/restore`)
- [x] 2.6 Implement devicePixelRatio scaling (set canvas buffer size, scale context by dpr)
- [x] 2.7 Implement mouse move/leave handlers (store cursor position in ref, calculate per-particle z-axis scatter effect)
- [x] 2.8 Implement animation state machine (IDLE / RECEDING / FORMING / LOGO / DISPERSING FSM with lerp transitions)
- [x] 2.9 Implement logo formation (greedy nearest-neighbor assignment, scale bitmap to canvas, lerp particles to target positions)
- [x] 2.10 Implement resize handling (debounced `useEffect([width, height])` that rebuilds particle array)
- [x] 2.11 Wire `activeShape` prop changes via `useEffect` → writes to `animStateRef` (no re-renders)

## 3. React Component

- [x] 3.1 Create `app/components/ParticleCanvas/ParticleCanvas.module.scss` (canvas sizing, `will-change: transform`, `display: block`)
- [x] 3.2 Create `app/components/ParticleCanvas/ParticleCanvas.tsx` — renders `<canvas>`, wires `canvasRef` to `useParticleEngine`, applies CSS module

## 4. Homepage Integration

- [x] 4.1 Add `hoveredLink` state (`'linkedin' | 'twitter' | 'email' | null`) to `app/page.tsx`
- [x] 4.2 Add `onMouseEnter` / `onMouseLeave` handlers to LinkedIn, Twitter, and Email `<a>` tags
- [x] 4.3 Replace `{/* Particle Feature */}` with `<ParticleCanvas width={...} height={...} activeShape={hoveredLink} />`
- [x] 4.4 Guard render with `hasDimensions` check (already present in page) to avoid zero-size canvas on SSR

## 5. Verification

- [x] 5.1 Run `yarn dev` — confirm canvas fills `col-7`, characters visible on load
- [ ] 5.2 Verify idle oscillation and color wave animate continuously
- [ ] 5.3 Verify mouse-over canvas triggers z-axis scatter; characters recover on mouse leave
- [ ] 5.4 Hover LinkedIn link — verify logo forms and disperses correctly
- [ ] 5.5 Check Retina display (or browser zoom 200%) — confirm text renders crisp
- [ ] 5.6 Resize browser window — confirm grid recalculates without errors
- [x] 5.7 Run `yarn typecheck` — no TypeScript errors
