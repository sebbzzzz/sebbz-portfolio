"use client"

import { useMediaPreload } from "@/hooks/use-media-preload"

interface BackgroundVideoOverlayProps {
  isVisible: boolean
  /** Video source URL — takes precedence over imageSrc when both are provided */
  src?: string
  /** Image source URL — used when no video src is available */
  imageSrc?: string
}

export default function BackgroundVideoOverlay({
  isVisible,
  src,
  imageSrc,
}: BackgroundVideoOverlayProps) {
  // Preload whichever asset is active so there is no loading flash on first display
  const activeSrc = src ?? imageSrc
  const activeType = src ? "video" : imageSrc ? "image" : undefined
  useMediaPreload(activeSrc, activeType)

  return (
    <div
      className={`absolute inset-0 z-[5] transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {src ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-contain sm:object-cover"
        />
      ) : imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          loading="eager"
          decoding="async"
          // @ts-expect-error fetchpriority is a valid HTML attribute not yet in React typings
          fetchpriority="high"
          className="w-full h-full object-contain sm:object-cover"
        />
      ) : (
        // Fallback animated gradient — replace by passing src or imageSrc props
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #1a1040, #0d2a4a, #2a0d1a, #0d3a2a)",
            backgroundSize: "400% 400%",
            animation: "carousel-gradient-shift 6s ease infinite",
          }}
        />
      )}
    </div>
  )
}
