const MediaType = { Video: "video", Image: "image" } as const
export type MediaType = (typeof MediaType)[keyof typeof MediaType]

export interface PortfolioItem {
  id: string
  title: string
  description: string
  link?: string
  /** Small image shown inside the carousel card */
  thumbnailSrc?: string
  /** Full-screen media shown as background when the item is pinned */
  mediaSrc?: string
  mediaType?: MediaType
  /** SVG path to form with particles on hover, e.g. "/icons/star.svg" */
  iconPath?: string
}
