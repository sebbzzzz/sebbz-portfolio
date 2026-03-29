import { useRef, useState } from "react"
import type { MutableRefObject, PointerEvent as ReactPointerEvent, RefObject } from "react"

const MAX_VELOCITY = 3000 // px/s
const MAX_VELOCITY_PER_FRAME = MAX_VELOCITY / 60 // px/frame at 60fps
const FRICTION = 0.95
const MAX_DELTA_MS = 64
const VELOCITY_SAMPLE_SIZE = 5

interface UseDragMomentumOptions {
  // Receives the value we just wrote to scrollLeft so callers never need to read it back
  onAfterScroll?: (newScrollLeft: number) => void
}

interface DragMomentumResult<T extends HTMLElement> {
  isDragging: boolean
  scrollDelta: MutableRefObject<number>
  /** Accumulated absolute drag distance in px since last pointer-down — use to distinguish click (<5px) from drag */
  dragDistance: MutableRefObject<number>
  onPointerDown: (e: ReactPointerEvent<T>) => void
}

export function useDragMomentum<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  options?: UseDragMomentumOptions,
): DragMomentumResult<T> {
  const [isDragging, setIsDragging] = useState(false)
  const isDraggingRef = useRef(false)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const velocitySamplesRef = useRef<number[]>([])
  const rafRef = useRef<number | null>(null)
  const scrollDelta = useRef(0)
  const dragDistance = useRef(0)
  // Use a ref to always call the latest callback without stale closures
  const onAfterScrollRef = useRef(options?.onAfterScroll)
  onAfterScrollRef.current = options?.onAfterScroll

  function cancelMomentum() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  function runDeceleration(velocity: number) {
    if (Math.abs(velocity) < 0.5) {
      scrollDelta.current = 0
      return
    }
    const el = containerRef.current
    if (!el) return
    // Read BEFORE write — layout is clean at rAF start, no forced reflow
    const newScrollLeft = el.scrollLeft + velocity
    el.scrollLeft = newScrollLeft
    scrollDelta.current = velocity
    onAfterScrollRef.current?.(newScrollLeft)
    rafRef.current = requestAnimationFrame(() => runDeceleration(velocity * FRICTION))
  }

  function onPointerDown(e: ReactPointerEvent<T>) {
    const el = containerRef.current
    if (!el) return

    cancelMomentum()
    isDraggingRef.current = true
    setIsDragging(true)
    lastXRef.current = e.clientX
    lastTimeRef.current = performance.now()
    velocitySamplesRef.current = []
    scrollDelta.current = 0
    dragDistance.current = 0 // reset accumulated distance on each pointer-down

    // Use window listeners instead of setPointerCapture.
    // Pointer capture redirects the `click` event to the capturing element,
    // preventing onClick handlers on child elements (carousel items) from firing.
    // Window listeners keep move/up active outside the container with the same effect.
    const handleMove = (ev: PointerEvent) => {
      const container = containerRef.current
      if (!container || !isDraggingRef.current) return

      const now = performance.now()
      // Clamp dt to guard against tab-switch freezes
      const dt = Math.min(now - lastTimeRef.current, MAX_DELTA_MS)
      const dx = ev.clientX - lastXRef.current

      dragDistance.current += Math.abs(dx) // accumulate total distance

      if (dt > 0) {
        // Rolling average: convert dx/dt to px/frame at 60fps reference
        const instantVelocity = (dx / dt) * (1000 / 60)
        velocitySamplesRef.current.push(instantVelocity)
        if (velocitySamplesRef.current.length > VELOCITY_SAMPLE_SIZE) {
          velocitySamplesRef.current.shift()
        }
      }

      lastXRef.current = ev.clientX
      lastTimeRef.current = now

      // Read BEFORE write — no forced reflow at pointer event start
      const newScrollLeft = container.scrollLeft - dx
      container.scrollLeft = newScrollLeft
      scrollDelta.current = -dx
      onAfterScrollRef.current?.(newScrollLeft)
    }

    const handleUp = () => {
      isDraggingRef.current = false
      setIsDragging(false)

      const samples = velocitySamplesRef.current
      if (samples.length > 0) {
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length
        // Negate: positive dx (drag right) → negative scroll delta (scroll left)
        // Cap to MAX_VELOCITY_PER_FRAME
        const clamped = Math.max(-MAX_VELOCITY_PER_FRAME, Math.min(MAX_VELOCITY_PER_FRAME, -avg))
        runDeceleration(clamped)
      }

      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
      window.removeEventListener("pointercancel", handleUp)
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
    window.addEventListener("pointercancel", handleUp)
  }

  return { isDragging, scrollDelta, dragDistance, onPointerDown }
}
