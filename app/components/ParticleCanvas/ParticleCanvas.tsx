"use client"

import { useRef } from "react"
import styles from "./ParticleCanvas.module.scss"
import { useParticleEngine } from "./useParticleEngine"

interface ParticleCanvasProps {
  width: number
  height: number
  /** SVG path of the icon to form on hover, e.g. "/icons/linkedin.svg" */
  iconPath?: string | null
  /** SVG paths to prefetch on mount so first hover has no loading delay */
  prefetchIconPaths?: string[]
}

export default function ParticleCanvas({
  width,
  height,
  iconPath = null,
  prefetchIconPaths = [],
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useParticleEngine(canvasRef, width, height, iconPath, prefetchIconPaths)

  return <canvas ref={canvasRef} className={styles.canvas} />
}
