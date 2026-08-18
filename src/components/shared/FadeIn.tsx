import { motion } from 'framer-motion'
import { useMemo, type ElementType, type ReactNode } from 'react'
import { EASE } from '../../lib/motion'

type FadeInProps = {
  children: ReactNode
  as?: ElementType
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: React.CSSProperties
  id?: string
}

export function FadeIn({
  children,
  as = 'div',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  id,
}: FadeInProps) {
  /*
   * Held across renders, and keyed only on the tag.
   *
   * Built inline, `motion.create` returned a brand new component type every
   * render — and a new type is a different component as far as React is
   * concerned, so it tore the subtree down and built it again on each pass,
   * discarding the DOM underneath. Anything wrapped in a FadeIn that sits near
   * changing state paid for it: the case studies heading was rebuilt on every
   * swipe of the track, which also re-armed the entrance animation this is
   * supposed to play once.
   */
  const Component = useMemo(() => motion.create(as as ElementType), [as])

  return (
    <Component
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: EASE }}
    >
      {children}
    </Component>
  )
}
