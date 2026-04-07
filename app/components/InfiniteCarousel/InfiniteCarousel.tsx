"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { useDragMomentum } from "@/hooks/use-drag-momentum"
import type { PortfolioItem } from "@/types/portfolio"
import Skeleton from "../UI/Skeleton/Skeleton"

interface InfiniteCarouselProps {
  items: PortfolioItem[]
  pinnedIndex?: number | null
  onHoverChange?: (index: number | null) => void
  onPinChange?: (index: number | null) => void
  onContainerHoverChange?: (hovered: boolean) => void
  onLoadProgress?: (percent: number) => void
}

const CLICK_THRESHOLD_PX = 5

export default function InfiniteCarousel({
  items,
  pinnedIndex = null,
  onHoverChange,
  onPinChange,
  onContainerHoverChange,
  onLoadProgress,
}: InfiniteCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Cache track width to avoid reading scrollWidth (forces reflow) in the animation hot path
  const trackWidthRef = useRef(0)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredRealIndex, setHoveredRealIndex] = useState<number | null>(null)
  // Tracks the "active" item index for keyboard navigation (Arrow keys advance, Enter/Space pins)
  const keyboardIndexRef = useRef(0)
  // Tracks which realIndex values have fired onLoad — ref avoids re-render on every load event,
  // state (shallow-copied Set) triggers re-render only once per new realIndex
  const loadedIndicesRef = useRef<Set<number>>(new Set())
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set())

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
        let sl = el.scrollLeft + 0.3
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

  function handleImageLoad(realIndex: number) {
    if (loadedIndicesRef.current.has(realIndex)) return
    loadedIndicesRef.current.add(realIndex)
    setLoadedIndices(new Set(loadedIndicesRef.current))
    onLoadProgress?.(Math.round((loadedIndicesRef.current.size / items.length) * 100))
  }

  function handleItemClick(realIndex: number) {
    // Only treat as a click if the pointer barely moved (not a drag)
    if (dragDistance.current >= CLICK_THRESHOLD_PX) return
    onPinChange?.(realIndex === pinnedIndex ? null : realIndex)
  }

  function handleContainerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const el = containerRef.current
    if (!el) return

    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      const firstItem = el.firstElementChild as HTMLElement | null
      // gap-5 = 20px; add to item width to advance by one full slot
      const itemWidth = firstItem ? firstItem.offsetWidth + 20 : 200
      const direction = e.key === "ArrowRight" ? 1 : -1
      el.scrollLeft += direction * itemWidth
      keyboardIndexRef.current =
        (keyboardIndexRef.current + direction + items.length) % items.length
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const idx = keyboardIndexRef.current
      onPinChange?.(idx === pinnedIndex ? null : idx)
    }
  }

  // Render three copies of the items for seamless infinite looping.
  // Middle copy (i >= items.length && i < items.length * 2) is the canonical set;
  // the first and last copies are clones hidden from assistive technology.
  const tripled = [...items, ...items, ...items]

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Portfolio projects"
      tabIndex={0}
      className="flex gap-5 overflow-x-hidden cursor-grab active:cursor-grabbing select-none py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      onPointerDown={onPointerDown}
      onKeyDown={handleContainerKeyDown}
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
        // First and last copies are scroll clones — hide from assistive technology
        const isClone = i < items.length || i >= items.length * 2

        return (
          <figure
            key={i}
            role="listitem"
            aria-label={isClone ? undefined : item.title}
            aria-pressed={isClone ? undefined : isPinned}
            aria-hidden={isClone ? true : undefined}
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
            className={`relative shrink-0 w-[calc(72vw-16px)] sm:w-[calc(40vw-16px)] md:w-[calc(28vw-16px)] lg:w-[calc(20vw-16px)] aspect-video overflow-hidden rounded-card transition-all duration-200 cursor-pointer ${
              isActive
                ? "grayscale-0 brightness-105"
                : isDimmed
                  ? "grayscale brightness-50 opacity-40"
                  : "grayscale brightness-75"
            } ${isPinned ? "ring-2 ring-white/60 scale-[1.02]" : ""} ${isActive && !isPinned ? "ring-1 ring-white/30" : ""}`}
          >
            <Image
              src={item.thumbnailSrc ?? "/placeholders/600x600.png"}
              alt={item.title}
              fill
              priority={!isClone && realIndex < 3}
              draggable={false}
              sizes="(max-width: 639px) 72vw, (max-width: 767px) 40vw, (max-width: 1023px) 28vw, 20vw"
              loading="eager"
              className="object-cover"
              onLoad={() => handleImageLoad(realIndex)}
            />
            <Skeleton
              className={`absolute inset-0 rounded-card transition-opacity duration-300 ${
                loadedIndices.has(realIndex) ? "opacity-0" : "opacity-100"
              }`}
            />
            {isPinned && (
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl transition-opacity duration-200 hover:bg-black/55"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </figure>
        )
      })}
    </div>
  )
}
