import { RefObject, useEffect, useRef } from "react"
import { loadIconBitmap } from "./loadIconBitmap"
import {
  PARTICLE_CONFIG,
  type ParticleConfig,
  RGB,
  WAVE_BRIGHTNESS_STEPS,
  WAVE_COLORS,
} from "./particleConfig"

export type ParticleShape = string | null

type AnimState = "IDLE" | "FORMING" | "LOGO" | "DISPERSING" | "ESCAPING" | "ESCAPED" | "RETURNING"

const ESCAPE_DURATION_MS = 600

interface Particle {
  char: string
  baseX: number
  baseY: number
  phaseX: number // random phase for idle X oscillation
  phaseY: number // random phase for idle Y oscillation
  x: number // current rendered x
  y: number // current rendered y
  scale: number // current scale
  targetX: number // lerp target x (logo formation)
  targetY: number // lerp target y
  targetScale: number // lerp target scale
  inLogo: boolean // assigned to a logo pixel
  // ── Escape / return animation ──────────────────────────────────────────────
  escapeStartX: number // position when current escape/return tween began
  escapeStartY: number
  escapeTargetX: number // destination for current escape/return tween
  escapeTargetY: number
}

export interface ParticleEngineAPI {
  escape(onComplete: () => void): void
  return(): void
}

// Characters from ASCII_MAP in _particlesExample.tsx
// Index = vertical bit pattern: top(2) + bottom(1)
const CHAR_POOL = [
  " ", // 00 - empty
  ".", // 01 - bottom only
  "'", // 10 - top only
  "#", // 11 - full
]

function pickChar(): string {
  return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ]
}

function scaleRGB(c: RGB, factor: number): RGB {
  return [Math.round(c[0] * factor), Math.round(c[1] * factor), Math.round(c[2] * factor)]
}

function toCSS([r, g, b]: RGB): string {
  return `rgb(${r},${g},${b})`
}

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

// ─── Pure helpers (no closure deps, safe to call from effects) ────────────────

function computeLogoTargets(
  bitmap: number[][],
  w: number,
  h: number,
  logoScale: number,
): Array<{ x: number; y: number }> {
  if (!bitmap || bitmap.length === 0) return []

  const bRows = bitmap.length
  const bCols = bitmap[0].length
  const cellSize = (h * logoScale) / bRows
  const totalW = bCols * cellSize
  const totalH = bRows * cellSize
  const startX = (w - totalW) / 2
  const startY = (h - totalH) / 2 - 10

  const targets: Array<{ x: number; y: number }> = []
  for (let r = 0; r < bRows; r++) {
    for (let c = 0; c < bCols; c++) {
      if (bitmap[r][c] === 1) {
        targets.push({
          x: startX + c * cellSize + cellSize / 2,
          y: startY + r * cellSize + cellSize / 2,
        })
      }
    }
  }
  return targets
}

function assignToLogo(
  particles: Particle[],
  bitmap: number[][],
  w: number,
  h: number,
  logoScale: number,
  logoBackgroundScale: number,
) {
  const targets = computeLogoTargets(bitmap, w, h, logoScale)

  // Reset all particles — non-logo ones will scale down
  for (const p of particles) {
    p.inLogo = false
    p.targetX = p.baseX
    p.targetY = p.baseY
    p.targetScale = logoBackgroundScale
  }

  // Shuffle particle indices so particles fly in from all directions
  const indices = Array.from({ length: particles.length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = indices[i]
    indices[i] = indices[j]
    indices[j] = tmp
  }

  for (let i = 0; i < targets.length && i < indices.length; i++) {
    const p = particles[indices[i]]
    p.inLogo = true
    p.targetX = targets[i].x
    p.targetY = targets[i].y
    p.targetScale = 1
  }
}

function clearLogoAssignment(particles: Particle[]) {
  for (const p of particles) {
    p.inLogo = false
    p.targetX = p.baseX
    p.targetY = p.baseY
    p.targetScale = 1
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useParticleEngine(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  width: number,
  height: number,
  iconPath: ParticleShape,
  prefetchIconPaths: string[] = [],
  config: ParticleConfig = PARTICLE_CONFIG,
): ParticleEngineAPI {
  // All mutable animation state lives in refs — no React re-renders during rAF
  const particlesRef = useRef<Particle[]>([])
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const configRef = useRef(config)
  configRef.current = config
  // ── Background wave animation time ────────────────────────────────────────
  const waveTimeRef = useRef(0)
  // ── Shine-sweep wave state ─────────────────────────────────────────────────
  const waveProgressRef = useRef(0) // 0 → ~1.3 during sweep, then resets
  const waveStateRef = useRef<"SWEEPING" | "PAUSING">("PAUSING") // start paused so first sweep is delayed
  const wavePauseRef = useRef(PARTICLE_CONFIG.wavePauseDurationMs) // full pause on first load
  const waveFromColorRef = useRef<RGB>([255, 255, 255]) // color before current wave
  const waveColorIdxRef = useRef(WAVE_COLORS.length - 1) // wraps to 0 after initial pause
  // ──────────────────────────────────────────────────────────────────────────
  const animStateRef = useRef<AnimState>("IDLE")
  const transitionTRef = useRef(0)
  const dimsRef = useRef({ width, height })
  const iconPathRef = useRef<ParticleShape>(iconPath)
  // Bitmaps loaded from SVG — keyed by icon path, populated eagerly on mount
  const bitmapsRef = useRef<Record<string, number[][]>>({})
  // ── Escape / return animation state ───────────────────────────────────────
  const escapeStartTimeRef = useRef<number>(0)
  const onEscapeCompleteRef = useRef<(() => void) | null>(null)
  // Imperative API refs — set inside the main effect so they close over correct refs
  const escapeRef = useRef<(onComplete: () => void) => void>(() => {})
  const returnRef = useRef<() => void>(() => {})

  // Keep dim + path refs in sync every render (no effect needed)
  dimsRef.current = { width, height }
  iconPathRef.current = iconPath

  // Stable API object — methods delegate to the inner refs set by the effect
  const apiRef = useRef<ParticleEngineAPI>({
    escape(onComplete) {
      escapeRef.current(onComplete)
    },
    return() {
      returnRef.current()
    },
  })

  // ── Main effect: canvas init + rAF loop ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || width <= 0 || height <= 0) return

    // Local cancel flag — safe across Strict Mode double-invoke
    let cancelled = false

    function buildGrid(w: number, h: number) {
      if (!canvas) return

      // Set buffer size (resets ctx transform — must scale after)
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      const ctx = canvas.getContext("2d")!
      ctx.scale(dpr, dpr) // compensate for HiDPI
      ctxRef.current = ctx

      // Measure actual character advance width at runtime
      const cfg = configRef.current
      ctx.font = `${cfg.fontSize}px ${cfg.fontFamily}`
      const cellW = Math.ceil(ctx.measureText("M").width) + 1
      const cellH = cfg.charCellHeight

      const cols = Math.floor(w / cellW)
      const rows = Math.floor(h / cellH)

      const particles: Particle[] = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * cellW + cellW / 2
          const baseY = row * cellH + cellH / 2
          particles.push({
            char: pickChar(),
            baseX,
            baseY,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            x: baseX,
            y: baseY,
            scale: 1,
            targetX: baseX,
            targetY: baseY,
            targetScale: 1,
            inLogo: false,
            escapeStartX: baseX,
            escapeStartY: baseY,
            escapeTargetX: baseX,
            escapeTargetY: baseY,
          })
        }
      }
      particlesRef.current = particles

      // Reset FSM on resize
      animStateRef.current = "IDLE"
      transitionTRef.current = 0

      // Restore active icon if hover is still active after resize
      if (iconPathRef.current) {
        const bitmap = bitmapsRef.current[iconPathRef.current] ?? []
        const c = configRef.current
        assignToLogo(particles, bitmap, w, h, c.logoScale, c.logoBackgroundScale)
        animStateRef.current = "FORMING"
      }
    }

    // ── Imperative API — defined here so they close over the correct refs ──
    escapeRef.current = (onComplete: () => void) => {
      const particles = particlesRef.current
      const { width: w, height: h } = dimsRef.current
      const diag = Math.hypot(w, h) * 1.2

      const cx = w / 2
      const cy = h / 2

      for (const p of particles) {
        const dx = p.baseX - cx
        const dy = p.baseY - cy
        // Radial from center — "opening space" effect.
        // Particles near the exact center get a random direction to avoid clustering.
        const angle =
          Math.abs(dx) + Math.abs(dy) > 1 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2
        p.escapeStartX = p.x
        p.escapeStartY = p.y
        p.escapeTargetX = cx + Math.cos(angle) * diag
        p.escapeTargetY = cy + Math.sin(angle) * diag
      }

      escapeStartTimeRef.current = performance.now()
      onEscapeCompleteRef.current = onComplete
      animStateRef.current = "ESCAPING"
    }

    returnRef.current = () => {
      const particles = particlesRef.current

      for (const p of particles) {
        p.escapeStartX = p.x
        p.escapeStartY = p.y
        p.escapeTargetX = p.baseX
        p.escapeTargetY = p.baseY
      }

      onEscapeCompleteRef.current = null
      escapeStartTimeRef.current = performance.now()
      animStateRef.current = "RETURNING"
    }

    // Eagerly prefetch bitmaps for all provided paths
    for (const path of prefetchIconPaths) {
      loadIconBitmap(path).then((bitmap) => {
        bitmapsRef.current[path] = bitmap
      })
    }

    function tick(timestamp: number, prev: number) {
      const ctx = ctxRef.current
      const { width: w, height: h } = dimsRef.current
      if (!ctx) return

      const dt = Math.min(timestamp - prev, 50) // cap delta — avoids jumps after tab switch
      waveTimeRef.current += dt * 0.0004 // ~4× slower than original, similar pace to carousel autoplay

      // ── Shine-sweep wave state machine ─────────────────────────────────
      // Freeze the sweep while any non-IDLE animation is active
      const tickCfg = configRef.current
      const SWEEP_END = 1.0 + tickCfg.waveWidth
      if (animStateRef.current === "IDLE") {
        if (waveStateRef.current === "SWEEPING") {
          waveProgressRef.current += tickCfg.waveSpeed * dt
          if (waveProgressRef.current >= SWEEP_END) {
            waveFromColorRef.current = WAVE_COLORS[waveColorIdxRef.current]
            waveProgressRef.current = SWEEP_END
            waveStateRef.current = "PAUSING"
            wavePauseRef.current = tickCfg.wavePauseDurationMs
          }
        } else {
          wavePauseRef.current -= dt
          if (wavePauseRef.current <= 0) {
            waveColorIdxRef.current = (waveColorIdxRef.current + 1) % WAVE_COLORS.length
            waveProgressRef.current = 0
            waveStateRef.current = "SWEEPING"
          }
        }
      }

      // ── Advance FSM transition ──────────────────────────────────────────
      const state = animStateRef.current
      if (state === "FORMING") {
        transitionTRef.current = Math.min(
          1,
          transitionTRef.current + dt / tickCfg.transitionDurationMs,
        )
        if (transitionTRef.current >= 0.98) animStateRef.current = "LOGO"
      } else if (state === "DISPERSING") {
        transitionTRef.current = Math.max(
          0,
          transitionTRef.current - dt / tickCfg.transitionDurationMs,
        )
        if (transitionTRef.current <= 0.02) {
          animStateRef.current = "IDLE"
          transitionTRef.current = 0
        }
      }

      // ── Escape / return progress ─────────────────────────────────────────
      // ESCAPED: particles are all off-screen — clear canvas and skip the render loop entirely
      if (state === "ESCAPED") {
        ctx.clearRect(0, 0, w, h)
        return
      }

      let isEscapeAnim = false
      let escapeAnimT = 0
      if (state === "ESCAPING" || state === "RETURNING") {
        isEscapeAnim = true
        {
          const elapsed = timestamp - escapeStartTimeRef.current
          const t = Math.min(1, elapsed / ESCAPE_DURATION_MS)
          escapeAnimT = state === "ESCAPING" ? t * t : 1 - (1 - t) * (1 - t) // ease-in / ease-out

          if (t >= 1) {
            if (state === "ESCAPING") {
              animStateRef.current = "ESCAPED"
              const cb = onEscapeCompleteRef.current
              onEscapeCompleteRef.current = null
              cb?.()
            } else {
              // RETURNING complete — back to idle
              animStateRef.current = "IDLE"
              transitionTRef.current = 0
              // Re-trigger icon formation if the user is still hovering an item
              if (iconPathRef.current) {
                const bitmap = bitmapsRef.current[iconPathRef.current] ?? []
                if (bitmap.length > 0) {
                  const c = configRef.current
                  assignToLogo(
                    particlesRef.current,
                    bitmap,
                    w,
                    h,
                    c.logoScale,
                    c.logoBackgroundScale,
                  )
                  animStateRef.current = "FORMING"
                }
              }
            }
          }
        }
      }

      // ── Draw frame ─────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h)
      ctx.font = `${tickCfg.fontSize}px ${tickCfg.fontFamily}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const ls = tickCfg.lerpSpeed
      const { x: mx, y: my } = mouseRef.current
      const mr = tickCfg.mouseRadius
      const minS = tickCfg.mouseScaleMin
      const curState = animStateRef.current
      // Logo anim: only the dedicated logo formation states
      const isLogoAnim = curState === "FORMING" || curState === "LOGO" || curState === "DISPERSING"

      // Precompute wave state for this frame
      const waveProgress = waveProgressRef.current
      const waveFrom = waveFromColorRef.current
      const waveTo = WAVE_COLORS[waveColorIdxRef.current]
      const waveWidth = tickCfg.waveWidth
      // Build stops: fromColor → waveTo scaled by each brightness step
      const allStops: RGB[] = [waveFrom, ...WAVE_BRIGHTNESS_STEPS.map((b) => scaleRGB(waveTo, b))]
      const segCount = allStops.length - 1

      for (const p of particlesRef.current) {
        // ── Multi-stop gradient sweep color for this particle ─────────────
        const diag = (p.baseX / w + p.baseY / h) / 2 // 0..1 top-left→bottom-right
        const behind = waveProgress - diag // negative = wave not yet arrived
        let waveRGB: RGB
        if (behind <= 0) {
          waveRGB = waveFrom
        } else if (behind < waveWidth) {
          const t = behind / waveWidth
          const seg = t * segCount
          const segIdx = Math.min(Math.floor(seg), segCount - 1)
          const segT = smoothstep(seg - segIdx)
          waveRGB = lerpRGB(allStops[segIdx], allStops[segIdx + 1], segT)
        } else {
          waveRGB = waveTo
        }

        // ── Position / scale update ────────────────────────────────────────
        if (isEscapeAnim) {
          // Direct position control — bypasses lerp for time-based animation
          p.x = p.escapeStartX + (p.escapeTargetX - p.escapeStartX) * escapeAnimT
          p.y = p.escapeStartY + (p.escapeTargetY - p.escapeStartY) * escapeAnimT
          p.scale = 1
        } else if (isLogoAnim) {
          p.x += (p.targetX - p.x) * ls
          p.y += (p.targetY - p.y) * ls
          p.scale += (p.targetScale - p.scale) * ls
        } else {
          // ── Idle oscillation (suppressed in IDLE — wave drives the visual) ──
          const ox =
            curState === "IDLE"
              ? 0
              : Math.sin(timestamp * tickCfg.idleFrequency + p.phaseX) * tickCfg.idleAmplitudeX
          const oy =
            curState === "IDLE"
              ? 0
              : Math.cos(timestamp * tickCfg.idleFrequency + p.phaseY) * tickCfg.idleAmplitudeY
          let tx = p.baseX + ox
          let ty = p.baseY + oy
          let ts = 1

          // ── Z-axis mouse scatter ──────────────────────────────────────────
          if (mx > -9000) {
            const dx = p.x - mx
            const dy = p.y - my
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < mr) {
              const prox = 1 - dist / mr
              ts = 1 - (1 - minS) * prox
              const scatter = prox * 12
              if (dist > 0.001) {
                tx = p.baseX + (dx / dist) * scatter + ox
                ty = p.baseY + (dy / dist) * scatter + oy
              }
            }
          }

          p.x += (tx - p.x) * ls
          p.y += (ty - p.y) * ls
          p.scale += (ts - p.scale) * ls
        }

        // Wave gates visibility in idle, disperse, and return — so the wave
        // pattern is already established before/during transitions back to grid
        if (curState === "IDLE" || curState === "DISPERSING" || curState === "RETURNING") {
          const nx = (p.baseX / w) * 100
          const ny = (p.baseY / h) * 60
          const distX = nx - 50
          const distY = ny - 30
          const dist = Math.sqrt(distX * distX + distY * distY)
          const t = waveTimeRef.current
          const noiseX = Math.sin(nx * 0.1 + t * 0.7) * 10
          const noiseY = Math.cos(ny * 0.1 + t * 0.5) * 10
          const wave1 = Math.sin(dist * 0.08 - t) * 0.3
          const wave2 =
            Math.sin((nx + noiseX) * 0.1 + t) * Math.cos((ny + noiseY) * 0.1 + t * 0.8) * 0.4
          const wave3 = Math.sin((nx - ny) * 0.05 + t * 0.6) * 0.2
          const wave4 = Math.cos(nx * 0.07 - ny * 0.05 + t * 0.4) * 0.2
          if ((wave1 + wave2 + wave3 + wave4 + 1) / 2 <= 0.63) continue
        }

        if (p.scale < 0.01) continue // skip invisible

        // ── Render character ────────────────────────────────────────────
        ctx.save()
        ctx.translate(p.x, p.y)
        if (Math.abs(p.scale - 1) > 0.005) ctx.scale(p.scale, p.scale)
        ctx.fillStyle = toCSS(waveRGB)
        ctx.fillText(p.char, 0, 0)
        ctx.restore()
      }
    }

    function startLoop() {
      let lastTs = 0
      const loop = (ts: number) => {
        if (cancelled) return
        tick(ts, lastTs)
        lastTs = ts
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    function handleMouseMove(e: MouseEvent) {
      const c = canvasRef.current
      if (!c) return
      const rect = c.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    buildGrid(width, height)
    startLoop()
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, config]) // re-runs on resize or breakpoint change; canvasRef is stable, prefetchIconPaths intentionally on mount only

  // ── iconPath effect: trigger logo formation / dispersal ─────────────────
  useEffect(() => {
    const particles = particlesRef.current
    if (particles.length === 0) return // not yet initialized

    // Don't interrupt escape/return animations
    const cur = animStateRef.current
    if (cur === "ESCAPING" || cur === "ESCAPED" || cur === "RETURNING") return

    const { width: w, height: h } = dimsRef.current

    if (iconPath) {
      const bitmap = bitmapsRef.current[iconPath] ?? []
      const c = configRef.current
      assignToLogo(particles, bitmap, w, h, c.logoScale, c.logoBackgroundScale)
      animStateRef.current = "FORMING"
      transitionTRef.current = 0
    } else {
      if (cur === "FORMING" || cur === "LOGO") {
        clearLogoAssignment(particles)
        animStateRef.current = "DISPERSING"
      }
    }
  }, [iconPath])

  return apiRef.current
}
