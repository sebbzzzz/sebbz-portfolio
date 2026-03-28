import { RefObject, useEffect, useRef } from "react"
import { loadIconBitmap } from "./loadIconBitmap"
import { PARTICLE_CONFIG, RGB, WAVE_BRIGHTNESS_STEPS, WAVE_COLORS } from "./particleConfig"

export type ParticleShape = string | null

type AnimState = "IDLE" | "FORMING" | "LOGO" | "DISPERSING"

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
): Array<{ x: number; y: number }> {
  if (!bitmap || bitmap.length === 0) return []

  const bRows = bitmap.length
  const bCols = bitmap[0].length
  const cellSize = (h * 0.6) / bRows
  const totalW = bCols * cellSize
  const totalH = bRows * cellSize
  const startX = (w - totalW) / 2
  const startY = (h - totalH) / 2

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

function assignToLogo(particles: Particle[], bitmap: number[][], w: number, h: number) {
  const targets = computeLogoTargets(bitmap, w, h)

  // Reset all particles — non-logo ones will scale down
  for (const p of particles) {
    p.inLogo = false
    p.targetX = p.baseX
    p.targetY = p.baseY
    p.targetScale = PARTICLE_CONFIG.logoBackgroundScale
  }

  const used = new Uint8Array(particles.length)

  // Greedy nearest-neighbor assignment
  for (const target of targets) {
    let bestDist = Infinity
    let bestIdx = -1
    for (let i = 0; i < particles.length; i++) {
      if (used[i]) continue
      const p = particles[i]
      const dx = p.baseX - target.x
      const dy = p.baseY - target.y
      const d2 = dx * dx + dy * dy
      if (d2 < bestDist) {
        bestDist = d2
        bestIdx = i
      }
    }
    if (bestIdx >= 0) {
      used[bestIdx] = 1
      const p = particles[bestIdx]
      p.inLogo = true
      p.targetX = target.x
      p.targetY = target.y
      p.targetScale = 1
    }
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
) {
  // All mutable animation state lives in refs — no React re-renders during rAF
  const particlesRef = useRef<Particle[]>([])
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
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

  // Keep dim + path refs in sync every render (no effect needed)
  dimsRef.current = { width, height }
  iconPathRef.current = iconPath

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
      ctx.font = `${PARTICLE_CONFIG.fontSize}px ${PARTICLE_CONFIG.fontFamily}`
      const cellW = Math.ceil(ctx.measureText("M").width) + 1
      const cellH = PARTICLE_CONFIG.charCellHeight

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
        assignToLogo(particles, bitmap, w, h)
        animStateRef.current = "FORMING"
      }
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

      // ── Shine-sweep wave state machine ─────────────────────────────────
      // Freeze the sweep while a logo animation is active so the diagonal
      // gradient doesn't conflict with the formed icon shape.
      const SWEEP_END = 1.0 + PARTICLE_CONFIG.waveWidth
      if (animStateRef.current === "IDLE") {
        if (waveStateRef.current === "SWEEPING") {
          waveProgressRef.current += PARTICLE_CONFIG.waveSpeed * dt
          if (waveProgressRef.current >= SWEEP_END) {
            waveFromColorRef.current = WAVE_COLORS[waveColorIdxRef.current]
            waveProgressRef.current = SWEEP_END
            waveStateRef.current = "PAUSING"
            wavePauseRef.current = PARTICLE_CONFIG.wavePauseDurationMs
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
          transitionTRef.current + dt / PARTICLE_CONFIG.transitionDurationMs,
        )
        if (transitionTRef.current >= 0.98) animStateRef.current = "LOGO"
      } else if (state === "DISPERSING") {
        transitionTRef.current = Math.max(
          0,
          transitionTRef.current - dt / PARTICLE_CONFIG.transitionDurationMs,
        )
        if (transitionTRef.current <= 0.02) {
          animStateRef.current = "IDLE"
          transitionTRef.current = 0
        }
      }

      // ── Draw frame ─────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h)
      ctx.font = `${PARTICLE_CONFIG.fontSize}px ${PARTICLE_CONFIG.fontFamily}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const ls = PARTICLE_CONFIG.lerpSpeed
      const { x: mx, y: my } = mouseRef.current
      const mr = PARTICLE_CONFIG.mouseRadius
      const minS = PARTICLE_CONFIG.mouseScaleMin
      const curState = animStateRef.current
      const isLogoAnim = curState !== "IDLE"

      // Precompute wave state for this frame
      const waveProgress = waveProgressRef.current
      const waveFrom = waveFromColorRef.current
      const waveTo = WAVE_COLORS[waveColorIdxRef.current]
      const waveWidth = PARTICLE_CONFIG.waveWidth
      // Build stops: fromColor → waveTo scaled by each brightness step
      // WAVE_BRIGHTNESS_STEPS already ends at 1.0 (full toColor)
      const allStops: RGB[] = [waveFrom, ...WAVE_BRIGHTNESS_STEPS.map((b) => scaleRGB(waveTo, b))]
      const segCount = allStops.length - 1 // number of segments between stops

      for (const p of particlesRef.current) {
        // ── Multi-stop gradient sweep color for this particle ─────────────
        const diag = (p.baseX / w + p.baseY / h) / 2 // 0..1 top-left→bottom-right
        const behind = waveProgress - diag // negative = wave not yet arrived
        let waveRGB: RGB
        if (behind <= 0) {
          // Wave hasn't reached this particle yet
          waveRGB = waveFrom
        } else if (behind < waveWidth) {
          // Particle is inside the gradient band — interpolate through all stops
          const t = behind / waveWidth // 0 = leading edge, 1 = trailing edge
          const seg = t * segCount // which segment (float)
          const segIdx = Math.min(Math.floor(seg), segCount - 1)
          const segT = smoothstep(seg - segIdx) // t within this segment
          waveRGB = lerpRGB(allStops[segIdx], allStops[segIdx + 1], segT)
        } else {
          // Wave has fully passed — settled to new color
          waveRGB = waveTo
        }

        let tx: number
        let ty: number
        let ts: number

        if (isLogoAnim) {
          // ── Logo formation / dispersal ──────────────────────────────────
          tx = p.targetX
          ty = p.targetY
          ts = p.targetScale
        } else {
          // ── Idle oscillation ───────────────────────────────────────────
          const ox =
            Math.sin(timestamp * PARTICLE_CONFIG.idleFrequency + p.phaseX) *
            PARTICLE_CONFIG.idleAmplitudeX
          const oy =
            Math.cos(timestamp * PARTICLE_CONFIG.idleFrequency + p.phaseY) *
            PARTICLE_CONFIG.idleAmplitudeY
          tx = p.baseX + ox
          ty = p.baseY + oy
          ts = 1

          // ── Z-axis mouse scatter ────────────────────────────────────────
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
        }

        // ── Lerp toward targets ─────────────────────────────────────────
        p.x += (tx - p.x) * ls
        p.y += (ty - p.y) * ls
        p.scale += (ts - p.scale) * ls

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
  }, [width, height]) // re-runs on resize

  // ── iconPath effect: trigger logo formation / dispersal ─────────────────
  useEffect(() => {
    const particles = particlesRef.current
    if (particles.length === 0) return // not yet initialized

    const { width: w, height: h } = dimsRef.current

    if (iconPath) {
      const bitmap = bitmapsRef.current[iconPath] ?? []
      assignToLogo(particles, bitmap, w, h)
      animStateRef.current = "FORMING"
      transitionTRef.current = 0
    } else {
      const cur = animStateRef.current
      if (cur === "FORMING" || cur === "LOGO") {
        clearLogoAssignment(particles)
        animStateRef.current = "DISPERSING"
      }
    }
  }, [iconPath])
}
