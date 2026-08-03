import { useEffect, useRef, useState } from 'react'

type CinematicVideoProps = {
  src: string
  poster?: string
  className?: string
  /** Distance from viewport at which the video source is attached. */
  rootMargin?: string
}

/**
 * Attaches the video source only once the element approaches the viewport, so a
 * page with several background clips doesn't pull megabytes on first paint.
 */
export function CinematicVideo({
  src,
  poster,
  className = '',
  rootMargin = '300px',
}: CinematicVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={visible ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    />
  )
}
