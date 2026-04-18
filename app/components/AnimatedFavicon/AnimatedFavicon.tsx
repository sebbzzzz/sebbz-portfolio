"use client"

import { useEffect } from "react"

const AnimationState = {
  TICKING: "ticking",
  SETTLED: "settled",
} as const
type AnimationState = (typeof AnimationState)[keyof typeof AnimationState]

const SIZE = 32
const P = 2
const T = 4
const HALF_H = 8

// [x, y, w, h] for each segment a–g
const SEGMENT_RECTS = [
  [P + T, P, SIZE - 2 * P - 2 * T, T], // a: top
  [SIZE - P - T, P + T, T, HALF_H], // b: top-right
  [SIZE - P - T, P + 2 * T + HALF_H, T, HALF_H], // c: bottom-right
  [P + T, SIZE - P - T, SIZE - 2 * P - 2 * T, T], // d: bottom
  [P, P + 2 * T + HALF_H, T, HALF_H], // e: bottom-left
  [P, P + T, T, HALF_H], // f: top-left
  [P + T, P + T + HALF_H, SIZE - 2 * P - 2 * T, T], // g: middle
] as const

// "S" / "5": a, f, g, c, d → indices 0,5,6,2,3 = [a,b,c,d,e,f,g]
const S_SEGMENTS = [true, false, true, true, false, true, true] as const

const BG_COLOR = "#0D0C0C"
const ACTIVE_COLOR = "#F3F3F3"
const INACTIVE_COLOR = "#232124"

const TICK_INTERVAL_MS = 80
const TICK_DURATION_MS = 1500
const SETTLE_DURATION_MS = 3000

function drawSegments(ctx: CanvasRenderingContext2D, segments: readonly boolean[]) {
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, SIZE, SIZE)
  for (let i = 0; i < SEGMENT_RECTS.length; i++) {
    const [x, y, w, h] = SEGMENT_RECTS[i]
    ctx.fillStyle = segments[i] ? ACTIVE_COLOR : INACTIVE_COLOR
    ctx.fillRect(x, y, w, h)
  }
}

function getOrCreateFaviconLink(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    document.head.appendChild(link)
  }
  return link
}

export function AnimatedFavicon() {
  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = SIZE
    canvas.height = SIZE
    const maybeCtx = canvas.getContext("2d")
    if (!maybeCtx) return
    const ctx = maybeCtx

    const link = getOrCreateFaviconLink()

    const state = { current: AnimationState.TICKING as AnimationState }
    const phaseElapsed = { current: 0 }
    const flipElapsed = { current: 0 }
    const currentSegments = { current: Array.from(S_SEGMENTS) as boolean[] }
    let lastTime: number | null = null
    let rafId: number

    function tick(timestamp: number) {
      if (lastTime === null) lastTime = timestamp
      const delta = timestamp - lastTime
      lastTime = timestamp

      phaseElapsed.current += delta

      if (state.current === AnimationState.TICKING) {
        flipElapsed.current += delta

        if (flipElapsed.current >= TICK_INTERVAL_MS) {
          flipElapsed.current = 0
          currentSegments.current = currentSegments.current.map(() => Math.random() > 0.5)
          drawSegments(ctx, currentSegments.current)
          link.href = canvas.toDataURL()
        }

        if (phaseElapsed.current >= TICK_DURATION_MS) {
          state.current = AnimationState.SETTLED
          phaseElapsed.current = 0
          flipElapsed.current = 0
          currentSegments.current = Array.from(S_SEGMENTS)
          drawSegments(ctx, currentSegments.current)
          link.href = canvas.toDataURL()
        }
      } else {
        if (phaseElapsed.current >= SETTLE_DURATION_MS) {
          state.current = AnimationState.TICKING
          phaseElapsed.current = 0
          flipElapsed.current = 0
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return null
}
