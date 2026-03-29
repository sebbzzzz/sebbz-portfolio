"use client"

import { useEffect, useRef, useState } from "react"

import type { ParticleEngineAPI } from "./components/ParticleCanvas/ParticleCanvas"

const MEDIA_FADE_OUT_MS = 500

/**
 * Orchestrates the particle escape → show media → hide media → particle return sequence.
 *
 * On activate:  escape particles → wait for complete → show media
 * On deactivate: hide media → wait for CSS fade-out → return particles
 */
export function useCarouselTransition(
  isActive: boolean,
  particleEngineRef: React.RefObject<ParticleEngineAPI | null>,
): { isMediaVisible: boolean } {
  const [isMediaVisible, setIsMediaVisible] = useState(false)
  const deactivateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear any pending deactivation timer
    if (deactivateTimerRef.current !== null) {
      clearTimeout(deactivateTimerRef.current)
      deactivateTimerRef.current = null
    }

    if (isActive) {
      const engine = particleEngineRef.current
      if (engine) {
        engine.escape(() => setIsMediaVisible(true))
      } else {
        // No engine available (canvas not mounted yet) — show media immediately
        setIsMediaVisible(true)
      }
    } else {
      // Hide media first, then return particles after CSS fade-out completes
      setIsMediaVisible(false)
      deactivateTimerRef.current = setTimeout(() => {
        particleEngineRef.current?.return()
        deactivateTimerRef.current = null
      }, MEDIA_FADE_OUT_MS)
    }

    return () => {
      if (deactivateTimerRef.current !== null) {
        clearTimeout(deactivateTimerRef.current)
        deactivateTimerRef.current = null
      }
    }
  }, [isActive, particleEngineRef])

  return { isMediaVisible }
}
