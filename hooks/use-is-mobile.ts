"use client"

import { useEffect, useState } from "react"

const TOUCH_QUERY = "(pointer: coarse)"

/**
 * Returns true when the primary pointing device is coarse (touch/finger).
 * Initialises to false (SSR-safe) and updates reactively if the media query changes.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(TOUCH_QUERY)
    setIsMobile(mq.matches)

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return isMobile
}
