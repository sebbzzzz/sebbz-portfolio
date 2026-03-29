"use client"

import type { PortfolioItem } from "@/types/portfolio"

interface CarouselItemInfoPanelProps {
  item: PortfolioItem | null
  isVisible: boolean
}

export default function CarouselItemInfoPanel({ item, isVisible }: CarouselItemInfoPanelProps) {
  return (
    <div
      className={`absolute top-5 left-5 z-20 glass-panel p-5 max-w-4/12 transition-opacity duration-500 ${
        isVisible && item ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      {item && (
        <>
          <h2 className="text-text-strong text-2xl mb-1">{item.title}</h2>
          <p className="text-text-base text-md leading-relaxed">{item.description}</p>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-text-strong underline underline-offset-2 hover:text-text-base transition-colors duration-150"
            >
              View project →
            </a>
          )}
        </>
      )}
    </div>
  )
}
