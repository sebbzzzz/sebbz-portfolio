import React from "react"

interface LinkProps {
  label: string
  href: string
  target: "_blank" | "_self" | "_parent" | "_top"
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
      className="text-md font-bold hover:underline"
    >
      {props.label}
    </a>
  )
}

export default Link
