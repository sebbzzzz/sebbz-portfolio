"use client"

import { useEffect } from "react"

/**
 * Eagerly preloads an image or video resource before it is displayed.
 *
 * - Images: injects a `<link rel="preload" as="image" fetchpriority="high">` into <head>
 * - Videos: constructs a detached HTMLVideoElement with `preload="auto"` and calls .load()
 *
 * Cleans up (removes link / nulls video) when src changes or component unmounts.
 */
export function useMediaPreload(src: string | undefined, type: "image" | "video" | undefined) {
  useEffect(() => {
    if (!src || !type) return

    if (type === "image") {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = src
      link.setAttribute("fetchpriority", "high")
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }

    if (type === "video") {
      const video = document.createElement("video")
      video.preload = "auto"
      video.src = src
      video.load()

      return () => {
        video.src = ""
      }
    }
  }, [src, type])
}
