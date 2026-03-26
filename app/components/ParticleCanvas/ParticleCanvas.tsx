"use client"

import { useRef } from "react"
import styles from "./ParticleCanvas.module.scss"
import { ParticleShape, useParticleEngine } from "./useParticleEngine"

interface ParticleCanvasProps {
  width: number
  height: number
  activeShape?: ParticleShape
}

export default function ParticleCanvas({ width, height, activeShape = null }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useParticleEngine(canvasRef, width, height, activeShape)

  return <canvas ref={canvasRef} className={styles.canvas} />
}
