import React from "react"

interface LinkProps {
  label: string
  href: string
  target: "_blank" | "_self" | "_parent" | "_top"
  icon?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const Link = (props: LinkProps) => {
  return (
    <a
      href={props.href}
      target={props.target}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className="text-md font-bold hover:underline inline-flex items-center gap-1"
    >
      {props.label}
      {props.icon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3"
          stroke="currentColor"
          className="w-3 h-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      )}
    </a>
  )
}

export default Link
