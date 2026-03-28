"use client"

import { useEffect, useRef, useState } from "react"
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

const PREFETCH_PATHS = SOCIAL_LINKS.map((l) => l.iconPath)

export default function HomePage() {
  const particleContainer = useRef<HTMLDivElement>(null)
  const [particleContainerDimensions, setParticleContainerDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [activeIconPath, setActiveIconPath] = useState<string | null>(null)

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
      <section className="flex flex-col justify-center gap-8 absolute top-5 left-5 max-w-4/12 z-10 glass-panel p-5">
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
        <ul className="flex gap-5">
          <li>
            <figure>
              <img src="/placeholders/600x600.png" alt="Portrait of Sebastián" />
            </figure>
          </li>

          <li>
            <figure>
              <img src="/placeholders/600x600.png" alt="Portrait of Sebastián" />
            </figure>
          </li>

          <li>
            <figure>
              <img src="/placeholders/600x600.png" alt="Portrait of Sebastián" />
            </figure>
          </li>

          <li>
            <figure>
              <img src="/placeholders/600x600.png" alt="Portrait of Sebastián" />
            </figure>
          </li>

          <li>
            <figure>
              <img src="/placeholders/600x600.png" alt="Portrait of Sebastián" />
            </figure>
          </li>

          <li>
            <figure>
              <img src="/placeholders/600x600.png" alt="Portrait of Sebastián" />
            </figure>
          </li>
        </ul>
      </section>

      <section ref={particleContainer} className="w-full h-full">
        {hasDimensions && (
          <ParticleCanvas
            width={particleContainerDimensions.width}
            height={particleContainerDimensions.height}
            iconPath={activeIconPath}
            prefetchIconPaths={PREFETCH_PATHS}
          />
        )}
      </section>
    </main>
  )
}
