"use client"

import { useEffect, useState } from "react"
import { PARTICLE_CONFIG, type ParticleConfig } from "./particleConfig"

const MOBILE_CONFIG: ParticleConfig = {
  ...PARTICLE_CONFIG,
  fontSize: 10,
  charCellHeight: 20,
  logoScale: 0.3,
  mouseRadius: 60,
}

const SM_CONFIG: ParticleConfig = {
  ...PARTICLE_CONFIG,
  fontSize: 12,
  charCellHeight: 24,
  logoScale: 0.38,
  mouseRadius: 80,
}

function getConfig(): ParticleConfig {
  if (typeof window === "undefined") return PARTICLE_CONFIG
  if (window.matchMedia("(min-width: 1024px)").matches) return PARTICLE_CONFIG
  if (window.matchMedia("(min-width: 640px)").matches) return SM_CONFIG
  return MOBILE_CONFIG
}

export function useResponsiveParticleConfig(): ParticleConfig {
  const [config, setConfig] = useState<ParticleConfig>(() => getConfig())

  useEffect(() => {
    const lgQuery = window.matchMedia("(min-width: 1024px)")
    const smQuery = window.matchMedia("(min-width: 640px)")
    const update = () => setConfig(getConfig())
    lgQuery.addEventListener("change", update)
    smQuery.addEventListener("change", update)
    return () => {
      lgQuery.removeEventListener("change", update)
      smQuery.removeEventListener("change", update)
    }
  }, [])

  return config
}
