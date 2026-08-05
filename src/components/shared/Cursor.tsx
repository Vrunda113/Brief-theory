import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../lib/motion'

/**
 * A two-part pointer: a dot that sits exactly under the mouse, and a ring that
 * trails it and catches up. The lag is the whole effect — the ring reads as
 * weight being dragged, which a single element moving in lockstep never does.
 *
 * Both are drawn in `difference` blend, so the pointer inverts whatever is
 * behind it. That matters on this page in particular: it alternates navy and
 * cream sections, and a fixed-colour pointer would disappear into one of them.
 *
 * Only mounted for a real mouse — a touch screen has no cursor to replace, and
 * a reader who has asked for less motion should not be given a trailing object.
 */

/** Share of the remaining distance the ring closes each frame. */
const EASE = 0.16

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !prefersReducedMotion(),
  )

  useEffect(() => {
    if (!enabled) return

    const root = document.documentElement
    root.classList.add('has-cursor')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0

    const move = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      }
      root.classList.add('cursor-on')
    }

    const loop = () => {
      rx += (mx - rx) * EASE
      ry += (my - ry) * EASE
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Anything clickable widens the ring; the dot shrinks into it.
    const TARGETS = 'a, button, [data-cursor-grow], input, textarea, select'
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(TARGETS)
      root.classList.toggle('cursor-wide', Boolean(hit))
    }
    const leave = () => root.classList.remove('cursor-on')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerleave', leave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
      root.classList.remove('has-cursor', 'cursor-on', 'cursor-wide')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor-ring" />
      <div ref={dot} aria-hidden="true" className="cursor-dot" />
    </>
  )
}
