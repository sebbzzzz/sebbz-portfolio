"use client"

import { useEffect, useRef, useState } from "react"

import BackgroundVideoOverlay from "./components/BackgroundVideoOverlay/BackgroundVideoOverlay"
import CarouselItemInfoPanel from "./components/CarouselItemInfoPanel/CarouselItemInfoPanel"
import InfiniteCarousel from "./components/InfiniteCarousel/InfiniteCarousel"
import type { ParticleEngineAPI } from "./components/ParticleCanvas/ParticleCanvas"
import ParticleCanvas from "./components/ParticleCanvas/ParticleCanvas"
import SocialLinks, { SocialLink } from "./components/SocialLinks/SocialLinks"
import { useCarouselTransition } from "./use-carousel-transition"
import type { PortfolioItem } from "@/types/portfolio"

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Linkedin",
    href: "https://www.linkedin.com/in/sebbz/",
    iconPath: "/icons/linkedin.svg",
  },
  {
    label: "Github",
    href: "https://github.com/sebbz",
    iconPath: "/icons/github.svg",
  },
  {
    label: "Email",
    href: "mailto:sebastian.1546@gmail.com",
    iconPath: "/icons/mail.svg",
  },
]

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "escalar",
    title: "Escalar",
    description: "Full-stack web platform built for a growing brand.",
    link: "https://escalarveinte18.com",
    thumbnailSrc: "/portfolio/escalar/escalar-thumbnail.png",
    mediaSrc: "/portfolio/escalar/escalar-demo.webm",
    mediaType: "video",
    iconPath: "/icons/linkedin.svg",
  },
  {
    id: "hearst",
    title: "Hearst",
    description: "Advertising platform for Hearst Magazines digital properties.",
    link: "https://advertising.hearstmagazines.com",
    thumbnailSrc: "/portfolio/hearst/hearst-thumbnail.png",
    mediaSrc: "/portfolio/hearst/hearst-demo.mov",
    mediaType: "video",
    iconPath: "/icons/github.svg",
  },
  {
    id: "petgold",
    title: "Petgold",
    description: "E-commerce experience for a premium pet care brand.",
    link: "https://petgold.com.co",
    thumbnailSrc: "/portfolio/petgold/petgold-thumbnail.png",
    mediaSrc: "/portfolio/petgold/petgold-demo.mov",
    mediaType: "video",
    iconPath: "/icons/mail.svg",
  },
  {
    id: "tinta-impresa",
    title: "Tinta Impresa",
    description: "Editorial web presence for a Colombian print and design studio.",
    link: "https://tintaimpresa.com.co",
    thumbnailSrc: "/portfolio/tinta-impresa/tinta-impresa-thumbnail.png",
    mediaSrc: "/portfolio/tinta-impresa/tinta-impresa-demo.mov",
    mediaType: "video",
    iconPath: "/icons/linkedin.svg",
  },
  {
    id: "del-vecchio",
    title: "Del Vecchio",
    description: "Luxury occasions catalogue with immersive product presentation.",
    link: "https://delvecchio.com.co",
    thumbnailSrc: "/portfolio/del-vecchio/del-vecchio-thumbnail.png",
    mediaSrc: "/portfolio/del-vecchio/del-vecchio-demo.mov",
    mediaType: "video",
    iconPath: "/icons/github.svg",
  },
  {
    id: "sibs",
    title: "Sibs",
    description: "High-performance marketing site with custom interactive elements.",
    link: "https://maspxr.com",
    thumbnailSrc: "/portfolio/sibs/sibs-thumbnail.png",
    mediaSrc: "/portfolio/sibs/sibs-demo.mov",
    mediaType: "video",
    iconPath: "/icons/mail.svg",
  },
  {
    id: "sumotype",
    title: "Sumo Type",
    description: "Type foundry showcase — expressive typography meets clean interaction design.",
    link: "https://sumotype.com",
    thumbnailSrc: "/portfolio/sumotype/sumotype-thumbnail.png",
    mediaSrc: "/portfolio/sumotype/sumotype-demo.mov",
    mediaType: "video",
    iconPath: "/icons/linkedin.svg",
  },
]

const PREFETCH_PATHS = [
  ...SOCIAL_LINKS.map((l) => l.iconPath),
  ...PORTFOLIO_ITEMS.flatMap((item) => (item.iconPath ? [item.iconPath] : [])),
]

export default function HomePage() {
  const particleContainer = useRef<HTMLDivElement>(null)
  const particleEngineRef = useRef<ParticleEngineAPI | null>(null)

  const [particleContainerDimensions, setParticleContainerDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [activeIconPath, setActiveIconPath] = useState<string | null>(null)
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number | null>(null)
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null)

  // Info panel — shown only on pin (click), hidden on unpin
  const [revealedItem, setRevealedItem] = useState<PortfolioItem | null>(null)
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(false)

  // displayedPinnedIndex lags behind pinnedIndex during a cross-fade so the
  // overlay src only swaps at the midpoint (when opacity is 0).
  const [displayedPinnedIndex, setDisplayedPinnedIndex] = useState<number | null>(null)
  const [isCrossFading, setIsCrossFading] = useState(false)
  const crossFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only a pin (click) triggers the particle escape + media reveal.
  // Hover only forms the SVG shape — no escape.
  const isTransitionActive = pinnedIndex !== null
  const { isMediaVisible } = useCarouselTransition(isTransitionActive, particleEngineRef)
  // Hide the overlay briefly at the mid-point of an item switch so the src swap is invisible
  const overlayVisible = isMediaVisible && !isCrossFading

  // Media sources driven by displayedPinnedIndex (not pinnedIndex) so they
  // only update after the fade-out completes.
  const displayedItem = displayedPinnedIndex !== null ? PORTFOLIO_ITEMS[displayedPinnedIndex] : null
  const overlayVideoSrc = displayedItem?.mediaType === "video" ? displayedItem.mediaSrc : undefined
  const overlayImageSrc = displayedItem?.mediaType === "image" ? displayedItem.mediaSrc : undefined

  // When a carousel item is hovered — form its SVG shape in the particle canvas.
  // Don't clear the icon on item-leave (only on container-leave) to avoid
  // disperse/reform jank when moving between items.
  function handleCarouselHoverChange(index: number | null) {
    setActiveCarouselIndex(index)
    if (index !== null && pinnedIndex === null) {
      setActiveIconPath(PORTFOLIO_ITEMS[index].iconPath ?? null)
    }
  }

  // When the carousel container is entered/left
  function handleContainerHoverChange(hovered: boolean) {
    if (!hovered && pinnedIndex === null) {
      // Mouse left the carousel — clear the icon so particles disperse
      setActiveCarouselIndex(null)
      setActiveIconPath(null)
    }
  }

  const CROSSFADE_MS = 500

  // When a carousel item is clicked to pin / unpin
  function handlePinChange(index: number | null) {
    const prevPinnedIndex = pinnedIndex

    // Cancel any in-flight cross-fade timer
    if (crossFadeTimerRef.current !== null) {
      clearTimeout(crossFadeTimerRef.current)
      crossFadeTimerRef.current = null
    }

    setPinnedIndex(index)

    if (index !== null) {
      if (prevPinnedIndex !== null && prevPinnedIndex !== index) {
        // Switching between two pinned items — fade old out, swap, fade new in
        setIsCrossFading(true)
        setIsInfoPanelVisible(false)
        crossFadeTimerRef.current = setTimeout(() => {
          setDisplayedPinnedIndex(index)
          setRevealedItem(PORTFOLIO_ITEMS[index])
          setIsCrossFading(false)
          setIsInfoPanelVisible(true)
          crossFadeTimerRef.current = null
        }, CROSSFADE_MS)
      } else {
        // First pin (null → index) — src set before particles escape so it's ready
        setDisplayedPinnedIndex(index)
        setRevealedItem(PORTFOLIO_ITEMS[index])
        setIsInfoPanelVisible(true)
      }
    } else {
      // Unpin — clear the icon immediately so particles return to idle grid,
      // not back to the SVG shape they were forming
      setActiveIconPath(null)
      setActiveCarouselIndex(null)
      setIsInfoPanelVisible(false)
      crossFadeTimerRef.current = setTimeout(() => {
        setDisplayedPinnedIndex(null)
        setRevealedItem(null)
        crossFadeTimerRef.current = null
      }, CROSSFADE_MS)
    }
  }

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

  return (
    <main className="relative w-svw h-svh">
      <section
        className={`flex flex-col justify-center gap-8 absolute top-5 left-5 right-5 max-w-4/12 z-10 glass-panel p-5 transition-opacity duration-500 ${
          pinnedIndex !== null ? "opacity-0 pointer-events-none" : "opacity-100"
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

      {/* Portfolio item info panel — fades in/out with the intro panel */}
      {revealedItem && <CarouselItemInfoPanel item={revealedItem} isVisible={isInfoPanelVisible} />}

      <section className="absolute bottom-10 inset-x-0 z-10">
        <InfiniteCarousel
          items={PORTFOLIO_ITEMS}
          pinnedIndex={pinnedIndex}
          onHoverChange={handleCarouselHoverChange}
          onPinChange={handlePinChange}
          onContainerHoverChange={handleContainerHoverChange}
        />
      </section>

      {/* Background media overlay — fades in after particles escape */}
      <BackgroundVideoOverlay
        isVisible={overlayVisible}
        src={overlayVideoSrc}
        imageSrc={overlayImageSrc}
      />

      {/* Particle canvas — always full opacity; escape/return animations handle visibility */}
      <div ref={particleContainer} className="w-full h-full">
        {hasDimensions && (
          <ParticleCanvas
            ref={particleEngineRef}
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
