"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { useDragMomentum } from "@/hooks/use-drag-momentum"
import type { PortfolioItem } from "@/types/portfolio"

interface InfiniteCarouselProps {
  items: PortfolioItem[]
  pinnedIndex?: number | null
  onHoverChange?: (index: number | null) => void
  onPinChange?: (index: number | null) => void
  onContainerHoverChange?: (hovered: boolean) => void
}

const CLICK_THRESHOLD_PX = 5

export default function InfiniteCarousel({
  items,
  pinnedIndex = null,
  onHoverChange,
  onPinChange,
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

  const { isDragging, dragDistance, onPointerDown } = useDragMomentum(containerRef, {
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

  // Autoplay: constant slow scroll, pauses on hover, drag, or pin
  useEffect(() => {
    if (isHovered || isDragging || pinnedIndex !== null) return

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
  }, [isDragging, isHovered, pinnedIndex])

  function handleItemClick(realIndex: number) {
    // Only treat as a click if the pointer barely moved (not a drag)
    if (dragDistance.current >= CLICK_THRESHOLD_PX) return
    onPinChange?.(realIndex === pinnedIndex ? null : realIndex)
  }

  // Render three copies of the items for seamless infinite looping
  const tripled = [...items, ...items, ...items]

  return (
    <div
      ref={containerRef}
      className="flex gap-5 overflow-x-hidden cursor-grab active:cursor-grabbing select-none py-2"
      onPointerDown={onPointerDown}
      onMouseEnter={() => {
        setIsHovered(true)
        onContainerHoverChange?.(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setHoveredRealIndex(null)
        onContainerHoverChange?.(false)
        onHoverChange?.(null)
      }}
    >
      {tripled.map((item, i) => {
        const realIndex = i % items.length
        const isPinned = pinnedIndex === realIndex
        const isActive = hoveredRealIndex === realIndex || isPinned
        const isDimmed =
          (hoveredRealIndex !== null || pinnedIndex !== null) &&
          hoveredRealIndex !== realIndex &&
          pinnedIndex !== realIndex

        return (
          <figure
            key={i}
            onMouseEnter={() => {
              if (!isDragging) {
                setHoveredRealIndex(realIndex)
                onHoverChange?.(realIndex)
              }
            }}
            onMouseLeave={() => {
              if (!isDragging) {
                setHoveredRealIndex(null)
                onHoverChange?.(null)
              }
            }}
            onClick={() => handleItemClick(realIndex)}
            className={`relative shrink-0 w-[calc(20vw-16px)] aspect-video overflow-hidden rounded-card transition-all duration-200 cursor-pointer ${
              isDimmed ? "opacity-30" : "opacity-100"
            } ${isPinned ? "ring-2 ring-white/60 scale-[1.02]" : ""} ${isActive && !isPinned ? "ring-1 ring-white/30" : ""}`}
          >
            <Image
              src={item.thumbnailSrc ?? "/placeholders/600x600.png"}
              alt={item.title}
              fill
              draggable={false}
              sizes="20vw"
              className="object-cover"
            />
            {isPinned && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPinChange?.(null)
                }}
                aria-label="Close"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl transition-opacity duration-200 hover:bg-black/55"
              >
                ✕
              </button>
            )}
          </figure>
        )
      })}
    </div>
  )
}
