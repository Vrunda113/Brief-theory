import { useEffect, useRef, useState } from 'react'

type CinematicVideoProps = {
  src: string
  poster?: string
  className?: string
  /** Distance from viewport at which the video source is attached. */
  rootMargin?: string
}

/**
 * A background clip that loads late and plays only while it is on screen.
 *
 * Loading and playing are deliberately two different questions. The source is
 * attached early, so the first frame is ready before the clip is reached; but
 * playback is tied to the element genuinely being in view, because a browser
 * will only decode so many videos at once. The work section alone holds ten —
 * start them all and the surplus have play() refused, and a refusal that is
 * merely swallowed leaves a clip frozen on its poster for the rest of the
 * session. So refusals are retried rather than ignored.
 */
export function CinematicVideo({
  src,
  poster,
  className = '',
  rootMargin = '400px',
}: CinematicVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let wanted = false
    let retry = 0

    const attempt = () => {
      if (!wanted) return
      void el.play().catch(() => {
        // Usually the decoder budget rather than autoplay policy. Give the
        // browser a moment and ask again; `canplay` below has another go if
        // the element simply was not ready yet.
        window.clearTimeout(retry)
        retry = window.setTimeout(attempt, 600)
      })
    }

    const onCanPlay = () => attempt()
    el.addEventListener('canplay', onCanPlay)

    // Attach the source as the clip approaches — once.
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setArmed(true)
        loader.disconnect()
      },
      { rootMargin },
    )

    // Play only while actually visible. No margin here — that is the point.
    const player = new IntersectionObserver(
      ([entry]) => {
        wanted = entry.isIntersecting
        if (wanted) attempt()
        else {
          window.clearTimeout(retry)
          el.pause()
        }
      },
      { threshold: 0.2 },
    )

    loader.observe(el)
    player.observe(el)

    return () => {
      window.clearTimeout(retry)
      el.removeEventListener('canplay', onCanPlay)
      loader.disconnect()
      player.disconnect()
    }
  }, [rootMargin])

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={armed ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    />
  )
}
