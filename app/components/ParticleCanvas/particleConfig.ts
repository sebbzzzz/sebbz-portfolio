export type RGB = [number, number, number]

// ─── Wave color sequence — each sweep transitions to the next color ───────────
// Add / remove / reorder entries freely; the animation cycles through them.
export const WAVE_COLORS: RGB[] = [
  [100, 180, 255], // sky blue
  [147, 100, 255], // violet
  [100, 220, 180], // teal
  [255, 100, 180], // pink
  [255, 255, 100], // yellow
  [255, 180, 100], // orange
  [255, 100, 100], // red
  [255, 255, 255], // white (reset)
]

// ─── Gradient brightness steps inside the wave band ──────────────────────────
// Each value is a brightness multiplier (0–1) applied to toColor, evenly
// distributed across the band after fromColor. The last value should be 1.0
// (full toColor). The gradient is:
//
//   fromColor → toColor×steps[0] → toColor×steps[1] → … → toColor×1.0
//
// Example with 3 steps → 4-segment gradient:
//   green → purple@70% → purple@80% → purple@90% → purple@100%
export const WAVE_BRIGHTNESS_STEPS: number[] = [0.7, 0.8, 0.9, 1.0]

// ─── Font stack (mirrors _particlesExample.tsx) ───────────────────────────────
export const MONOSPACE_FONT_STACK = [
  '"IBM Plex Mono"', // preferred explicit fallback
  "monospace", // generic keyword — last resort
].join(", ")

// ─── Tuning knobs ─────────────────────────────────────────────────────────────

export const PARTICLE_CONFIG = {
  fontSize: 14,
  fontFamily: MONOSPACE_FONT_STACK,
  charCellHeight: 30,
  idleAmplitudeX: 1.5, // px max horizontal oscillation
  idleAmplitudeY: 1.5, // px max vertical oscillation
  idleFrequency: 0.001, // rad/ms — full cycle ~7.8s
  waveSpeed: 0.002, // progress advance per ms — full sweep ~1.9s (0→1.3)
  waveWidth: 1.0, // gradient band width — values >1.0 exceed the full diagonal so the entire canvas is inside the gradient at once
  wavePauseDurationMs: 5000, // ms the color holds between sweeps
  mouseRadius: 100, // px — scatter effect radius
  mouseScaleMin: 0.2, // min scale at cursor center
  lerpSpeed: 0.15, // per-frame lerp factor
  transitionDurationMs: 200,
  logoBackgroundScale: 0.01, // scale of non-logo particles during icon formation
  logoScale: 0.45, // fraction of canvas height used for the logo on hover
}

export type ParticleConfig = typeof PARTICLE_CONFIG
