"use client"

export interface SocialLink {
  label: string
  href: string
  /** Path to the SVG icon shown in the particle canvas on hover */
  iconPath: string
  target?: string
}

interface SocialLinksProps {
  links: SocialLink[]
  onHoverChange: (iconPath: string | null) => void
}

export default function SocialLinks({ links, onHoverChange }: SocialLinksProps) {
  return (
    <ul className="flex gap-3">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target={link.target}
            onMouseEnter={() => onHoverChange(link.iconPath)}
            onMouseLeave={() => onHoverChange(null)}
            className="text-md font-bold"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
