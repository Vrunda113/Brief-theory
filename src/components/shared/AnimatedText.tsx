import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

type AnimatedTextProps = {
  text: string
  className?: string
  style?: React.CSSProperties
  /** Opacity floor for characters the scroll hasn't reached yet. */
  dim?: number
  /**
   * Scroll window the reveal maps to. Blocks near the end of the page need a
   * range that closes higher in the viewport, since there is no scroll left
   * to carry them any further up.
   */
  offset?: [string, string]
}

/**
 * Reveals text character by character as the element travels through the
 * viewport. Each character keeps an invisible copy in flow so wrapping and
 * layout stay identical to plain text.
 */
export function AnimatedText({
  text,
  className,
  style,
  dim = 0.18,
  offset = ['start 0.85', 'end 0.35'],
}: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  })

  const words = text.split(' ')
  let charIndex = 0
  const total = text.length

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wi) => {
        const chars = word.split('')
        const node = (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {chars.map((char, ci) => {
              const start = charIndex / total
              const end = start + 1 / total
              charIndex += 1
              return (
                <Char key={ci} progress={scrollYProgress} range={[start, end]} dim={dim}>
                  {char}
                </Char>
              )
            })}
            {wi < words.length - 1 && (() => {
              charIndex += 1
              return <span>&nbsp;</span>
            })()}
          </span>
        )
        return node
      })}
    </p>
  )
}

function Char({
  children,
  progress,
  range,
  dim,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  dim: number
}) {
  const opacity = useTransform(progress, range, [dim, 1])

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ opacity: 0 }}>{children}</span>
      <motion.span style={{ position: 'absolute', left: 0, top: 0, opacity }}>
        {children}
      </motion.span>
    </span>
  )
}
