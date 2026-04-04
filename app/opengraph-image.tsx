import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Sebastián · Full-Stack Engineer & Creative Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ fontSize: 28, color: "#888", margin: 0, letterSpacing: "0.1em" }}>PORTFOLIO</p>
        <h1
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            textAlign: "center",
          }}
        >
          Sebastián
        </h1>
        <p style={{ fontSize: 30, color: "#aaaaaa", margin: 0, textAlign: "center" }}>
          Full-Stack Engineer &amp; Creative Developer
        </p>
      </div>
    ),
    { ...size },
  )
}
