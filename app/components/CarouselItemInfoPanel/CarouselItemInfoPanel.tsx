"use client"

import type { PortfolioItem } from "@/types/portfolio"
import Link from "../UI/Link/Link"

interface CarouselItemInfoPanelProps {
  item: PortfolioItem
  isVisible: boolean
}

export default function CarouselItemInfoPanel({ item, isVisible }: CarouselItemInfoPanelProps) {
  return (
    <section
      className={`flex flex-col absolute top-3 left-3 right-3 md:top-5 md:left-5 md:right-5 w-auto md:max-w-5/12 lg:max-w-5/12 z-20 glass-panel p-5 transition-opacity duration-500 gap-8 ${
        isVisible && item ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="grid gap-2">
        <h2 className="text-xl lg:text-2xl mb-1 font-bold">{item.title}</h2>
        <p className="text-sm md:text-base leading-relaxed">{item.description}</p>
      </div>

      {item.link && <Link label="View project" href={item.link} target="_blank" />}
    </section>
  )
}
