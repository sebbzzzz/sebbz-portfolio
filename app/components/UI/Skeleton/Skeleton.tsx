interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full h-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 [background-size:200%_100%] animate-shimmer pointer-events-none${className ? ` ${className}` : ""}`}
    />
  )
}
