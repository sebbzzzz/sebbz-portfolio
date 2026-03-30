"use client"

import Link from "../UI/Link/Link"

export interface SocialLink {
  label: string
  href: string
  /** Path to the SVG icon shown in the particle canvas on hover */
  iconPath: string
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
          <Link
            label={link.label}
            href={link.href}
            target={"_blank"}
            onMouseEnter={() => onHoverChange(link.iconPath)}
            onMouseLeave={() => onHoverChange(null)}
          />
        </li>
      ))}
    </ul>
  )
}
