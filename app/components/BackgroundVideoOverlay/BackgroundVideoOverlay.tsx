"use client"

interface BackgroundVideoOverlayProps {
  isVisible: boolean
  src?: string
}

export default function BackgroundVideoOverlay({ isVisible, src }: BackgroundVideoOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-[5] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {src ? (
        // Real video — provide a `src` prop when video assets are ready
        <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
      ) : (
        // TODO: replace with real video — pass a `src` prop with the video URL when assets are available
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
