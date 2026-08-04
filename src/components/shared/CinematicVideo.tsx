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

    // The observer stays connected after the source is attached, so clips that
    // have scrolled out of frame stop decoding instead of running unseen — a
    // page with three case cards holds a dozen of them.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          void el.play().catch(() => {
            /* autoplay can be refused; the poster still shows */
          })
        } else {
          el.pause()
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
