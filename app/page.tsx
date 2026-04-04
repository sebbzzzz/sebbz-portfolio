"use client"

import { useEffect, useRef, useState } from "react"

import BackgroundVideoOverlay from "./components/BackgroundVideoOverlay/BackgroundVideoOverlay"
import CarouselItemInfoPanel from "./components/CarouselItemInfoPanel/CarouselItemInfoPanel"
import InfiniteCarousel from "./components/InfiniteCarousel/InfiniteCarousel"
import type { ParticleEngineAPI } from "./components/ParticleCanvas/ParticleCanvas"
import ParticleCanvas from "./components/ParticleCanvas/ParticleCanvas"
import SocialLinks, { SocialLink } from "./components/SocialLinks/SocialLinks"
import { useCarouselTransition } from "./use-carousel-transition"
import { useMediaPreload } from "@/hooks/use-media-preload"
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
    title: "Escalar Veinte18",
    description:
      "Custom WordPress website built from scratch for Escalar Veinte18, a Colombian and Spanish real estate design and construction firm. Crafted to reflect their multidisciplinary approach, combining architecture, project management, and creative problem-solving into a compelling digital presence.",
    link: "https://escalarveinte18.com",
    thumbnailSrc: "/portfolio/escalar/escalar-thumbnail.png",
    mediaSrc: "/portfolio/escalar/escalar-video.webm",
    mediaType: "video",
    iconPath: "/icons/eye.svg",
  },
  {
    id: "hearst",
    title: "Hearst Advertising",
    description:
      "High-performance advertising platform for Hearst Magazines, built with Next.js and Sanity CMS. Developed alongside <a href='https://www.stinkstudios.com/' target='_blank' rel='noopener noreferrer'>Stink Studios</a> and <a href='https://www.studiocontra.co/' target='_blank' rel='noopener noreferrer'>Studio Contra</a>, featuring fluid animations and a tailored content management system to showcase one of the world's most iconic media portfolios.",
    link: "https://advertising.hearstmagazines.com",
    thumbnailSrc: "/portfolio/hearst/hearst-thumbnail.png",
    mediaSrc: "/portfolio/hearst/hearst-video.webm",
    mediaType: "video",
    iconPath: "/icons/eye.svg",
  },
  {
    id: "petgold",
    title: "Petgold",
    description:
      "Custom WordPress and WooCommerce storefront built from scratch for Petgold, a complete e-commerce destination for pet lovers. Designed and developed to deliver a smooth shopping experience across a wide catalog of pet food, accessories, and everyday essentials for every kind of animal companion.",
    link: "https://petgold.com.co",
    thumbnailSrc: "/portfolio/petgold/petgold-thumbnail.png",
    mediaSrc: "/portfolio/petgold/petgold-video.webm",
    mediaType: "video",
    iconPath: "/icons/eye.svg",
  },
  {
    id: "tinta-impresa",
    title: "Tinta Impresa",
    description:
      "Award-winning digital platform for Fundación para el fomento de la lectura, built from scratch on WordPress — custom theme, content management system, and full UI/UX. Crafted in collaboration with <a href='https://www.studiocontra.co/' target='_blank' rel='noopener noreferrer'>Studio Contra</a> to promote reading culture across Latin America. Recognized with a Silver at the Latin America Design Awards 2024.",
    link: "https://tintaimpresa.com.co",
    thumbnailSrc: "/portfolio/tinta-impresa/tinta-impresa-thumbnail.png",
    mediaSrc: "/portfolio/tinta-impresa/tinta-impresa-video.webm",
    mediaType: "video",
    iconPath: "/icons/eye.svg",
  },
  {
    id: "del-vecchio",
    title: "Quesos Del Vecchio",
    description:
      "Custom WordPress theme and full digital experience built from scratch in collaboration with <a href='https://www.studiocontra.co/' target='_blank' rel='noopener noreferrer'>Studio Contra</a>, translating a century-old cheese brand's identity into a rich, story-driven website with custom templates, content structure, and UI components.",
    link: "https://delvecchio.com.co",
    thumbnailSrc: "/portfolio/del-vecchio/del-vecchio-thumbnail.png",
    mediaSrc: "/portfolio/del-vecchio/del-vecchio-video.webm",
    mediaType: "video",
    iconPath: "/icons/eye.svg",
  },
  {
    id: "sumotype",
    title: "Sumotype",
    description:
      "Custom Shopify storefront built from scratch for Sumotype, a Bogotá-based type foundry and design studio. Every detail — theme, UX, and commerce system — crafted to reflect their historically rooted, high-quality typefaces designed for branding and communication environments across Latin America.",
    link: "https://sumotype.com",
    thumbnailSrc: "/portfolio/sumotype/sumotype-thumbnail.png",
    mediaSrc: "/portfolio/sumotype/sumotype-video.webm",
    mediaType: "video",
    iconPath: "/icons/eye.svg",
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

  // Preload the hovered item's media so it is buffered before the user pins it
  const hoveredItem =
    activeCarouselIndex !== null ? PORTFOLIO_ITEMS[activeCarouselIndex] : undefined
  useMediaPreload(hoveredItem?.mediaSrc, hoveredItem?.mediaType)

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
        className={`flex flex-col justify-center gap-8 absolute top-3 left-3 right-3 md:top-5 md:left-5 md:right-5 w-auto md:max-w-6/12 lg:max-w-5/12 z-10 glass-panel p-5 transition-opacity duration-500 ${
          pinnedIndex !== null ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="grid gap-2">
          <h1 className="text-xl lg:text-2xl">
            Hello! <strong>I&apos;m Sebastián,</strong>
          </h1>

          <p className="text-sm md:text-base leading-relaxed">
            Full-stack engineer with seven years of experience who genuinely loves building things
            that look great and work even better. I bring a background in animation and creative
            production into every interface I craft — pairing that eye for detail with React,
            TypeScript, and AI-powered workflows to ship faster, prototype smarter, and push ideas
            further.
          </p>
        </div>

        <SocialLinks links={SOCIAL_LINKS} onHoverChange={setActiveIconPath} />
      </section>

      {/* Portfolio item info panel — fades in/out with the intro panel */}
      {revealedItem && <CarouselItemInfoPanel item={revealedItem} isVisible={isInfoPanelVisible} />}

      <section
        aria-label="Portfolio projects"
        className="absolute bottom-6 md:bottom-10 inset-x-0 z-10"
      >
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
