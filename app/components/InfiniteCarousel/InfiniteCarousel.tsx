"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { useDragMomentum } from "@/hooks/use-drag-momentum"

export interface CarouselItem {
  src: string
  alt: string
}

interface InfiniteCarouselProps {
  items: CarouselItem[]
  onHoverChange?: (index: number | null) => void
  onContainerHoverChange?: (hovered: boolean) => void
}

export default function InfiniteCarousel({
  items,
  onHoverChange,
  onContainerHoverChange,
}: InfiniteCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Cache track width to avoid reading scrollWidth (forces reflow) in the animation hot path
  const trackWidthRef = useRef(0)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredRealIndex, setHoveredRealIndex] = useState<number | null>(null)

  // Boundary jump: receives the value just written — zero DOM reads, zero reflows
  function handleBoundaryJump(newScrollLeft: number) {
    const tw = trackWidthRef.current
    if (tw === 0) return
    const el = containerRef.current
    if (!el) return
    if (newScrollLeft >= tw * 2) {
      el.scrollLeft = newScrollLeft - tw
    } else if (newScrollLeft < tw) {
      el.scrollLeft = newScrollLeft + tw
    }
  }

  const { isDragging, onPointerDown } = useDragMomentum(containerRef, {
    onAfterScroll: handleBoundaryJump,
  })

  // Compute and cache trackWidth once; update on resize via ResizeObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      trackWidthRef.current = el.scrollWidth / 3
    }
    update()
    if (trackWidthRef.current > 0) {
      el.scrollLeft = trackWidthRef.current
    }

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Autoplay: constant slow scroll, pauses on hover or drag
  useEffect(() => {
    if (isHovered || isDragging) return

    let rafId: number

    const tick = () => {
      const el = containerRef.current
      const tw = trackWidthRef.current
      if (el && tw > 0) {
        // Read BEFORE write — layout is clean at rAF start, no forced reflow
        let sl = el.scrollLeft + 1
        if (sl >= tw * 2) {
          sl -= tw
        } else if (sl < tw) {
          sl += tw
        }
        el.scrollLeft = sl // ONE write, no subsequent reads
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isDragging, isHovered])

  // Render three copies of the items for seamless infinite looping
  const tripled = [...items, ...items, ...items]

  return (
    <div
      ref={containerRef}
      className="flex gap-5 overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
      onPointerDown={onPointerDown}
      onMouseEnter={() => {
        setIsHovered(true)
        onContainerHoverChange?.(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setHoveredRealIndex(null)
        onContainerHoverChange?.(false)
      }}
    >
      {tripled.map((item, i) => (
        <figure
          key={i}
          onMouseEnter={() => {
            if (!isDragging) {
              setHoveredRealIndex(i % items.length)
              onHoverChange?.(i % items.length)
            }
          }}
          onMouseLeave={() => {
            if (!isDragging) {
              setHoveredRealIndex(null)
              onHoverChange?.(null)
            }
          }}
          className={`relative shrink-0 w-[calc(20vw-16px)] aspect-video overflow-hidden rounded-card transition-opacity duration-200 ${
            hoveredRealIndex !== null && hoveredRealIndex !== i % items.length
              ? "opacity-30"
              : "opacity-100"
          }`}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            draggable={false}
            sizes="20vw"
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  )
}
