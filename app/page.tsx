"use client"

import { useEffect, useRef, useState } from "react"

import BackgroundVideoOverlay from "./components/BackgroundVideoOverlay/BackgroundVideoOverlay"
import InfiniteCarousel from "./components/InfiniteCarousel/InfiniteCarousel"
import type { CarouselItem } from "./components/InfiniteCarousel/InfiniteCarousel"
import ParticleCanvas from "./components/ParticleCanvas/ParticleCanvas"
import SocialLinks, { SocialLink } from "./components/SocialLinks/SocialLinks"

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Linkedin",
    href: "https://www.linkedin.com/in/sebbz/",
    target: "_blank",
    iconPath: "/icons/linkedin.svg",
  },
  {
    label: "Github",
    href: "https://github.com/sebbz",
    target: "_blank",
    iconPath: "/icons/github.svg",
  },
  {
    label: "Email",
    href: "mailto:sebastian.1546@gmail.com",
    iconPath: "/icons/mail.svg",
  },
]

const CAROUSEL_ITEMS: CarouselItem[] = Array.from({ length: 6 }, (_, i) => ({
  src: "/placeholders/600x600.png",
  alt: `Portfolio item ${i + 1}`,
}))

const PREFETCH_PATHS = SOCIAL_LINKS.map((l) => l.iconPath)

export default function HomePage() {
  const particleContainer = useRef<HTMLDivElement>(null)
  const [particleContainerDimensions, setParticleContainerDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [activeIconPath, setActiveIconPath] = useState<string | null>(null)
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number | null>(null)
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)

  useEffect(() => {
    if (!particleContainer.current) return

    const handleResize = () => {
      if (!particleContainer.current) return

      const { width, height } = particleContainer.current.getBoundingClientRect()
      const style = getComputedStyle(particleContainer.current)
      const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)

      setParticleContainerDimensions({
        width: width - paddingX,
        height: height - paddingY,
      })
    }

    handleResize() // Initial size

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [particleContainer])

  const hasDimensions =
    particleContainerDimensions.width > 0 && particleContainerDimensions.height > 0

  const isVideoOverlayVisible = activeCarouselIndex !== null

  return (
    <main className="relative w-svw h-svh">
      <section
        className={`flex flex-col justify-center gap-8 absolute top-5 left-5 max-w-4/12 z-10 glass-panel p-5 transition-opacity duration-300 ${
          isCarouselHovered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="grid gap-2">
          <h1 className="text-2xl">
            Hello! <strong>I&apos;m Sebastián,</strong>
          </h1>

          <p className="text-md">
            I really enjoy creating visually captivating projects that adhere to rigorous standards
            of performance, accessibility, and coding best practices.
          </p>
        </div>

        <SocialLinks links={SOCIAL_LINKS} onHoverChange={setActiveIconPath} />
      </section>

      <section className="absolute bottom-10 inset-x-0 z-10">
        <InfiniteCarousel
          items={CAROUSEL_ITEMS}
          onHoverChange={setActiveCarouselIndex}
          onContainerHoverChange={setIsCarouselHovered}
        />
      </section>

      {/* Background video overlay — fades in over the particle canvas on carousel item hover */}
      <BackgroundVideoOverlay isVisible={isVideoOverlayVisible} />

      {/* Particle canvas — fades out while carousel item is hovered */}
      <div
        ref={particleContainer}
        className={`w-full h-full transition-opacity duration-300 ${
          isVideoOverlayVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        {hasDimensions && (
          <ParticleCanvas
            width={particleContainerDimensions.width}
            height={particleContainerDimensions.height}
            iconPath={activeIconPath}
            prefetchIconPaths={PREFETCH_PATHS}
          />
        )}
      </div>
    </main>
  )
}
