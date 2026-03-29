"use client"

import { useImperativeHandle, useRef, type Ref } from "react"
import styles from "./ParticleCanvas.module.scss"
import { type ParticleEngineAPI, useParticleEngine } from "./useParticleEngine"

export type { ParticleEngineAPI }

interface ParticleCanvasProps {
  width: number
  height: number
  /** SVG path of the icon to form on hover, e.g. "/icons/linkedin.svg" */
  iconPath?: string | null
  /** SVG paths to prefetch on mount so first hover has no loading delay */
  prefetchIconPaths?: string[]
  /** Ref to access the particle engine's imperative escape/return API */
  ref?: Ref<ParticleEngineAPI>
}

export default function ParticleCanvas({
  width,
  height,
  iconPath = null,
  prefetchIconPaths = [],
  ref,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const api = useParticleEngine(canvasRef, width, height, iconPath, prefetchIconPaths)

  useImperativeHandle(ref, () => api)

  return <canvas ref={canvasRef} className={styles.canvas} />
}
