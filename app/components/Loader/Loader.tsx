"use client"

import { useEffect, useRef, useState } from "react"

interface LoaderProps {
  progress: number
  onComplete: () => void
}

const SEGMENTS = 20

export default function Loader({ progress, onComplete }: LoaderProps) {
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const completeCalled = useRef(false)

  useEffect(() => {
    if (progress >= 100 && !isFadingOut) {
      setIsFadingOut(true)
    }
  }, [progress, isFadingOut])

  function handleTransitionEnd() {
    if (isFadingOut && !completeCalled.current) {
      completeCalled.current = true
      setIsHidden(true)
      onComplete()
    }
  }

  if (isHidden) return null

  const filledSegments = Math.floor(progress / 5)
  const bar = Array.from({ length: SEGMENTS }, (_, i) => (i < filledSegments ? "▓" : "░")).join("")

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="font-mono text-white text-center text-sm select-none">
        <div>[{bar}]</div>
        <div className="mt-2">{progress}%</div>
      </div>
    </div>
  )
}
