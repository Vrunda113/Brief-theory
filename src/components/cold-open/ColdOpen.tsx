import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND } from '../../config/copy'
import { BRIEF_LETTERS, THEORY_PATHS, LOGO_VIEWBOX } from '../../config/logoPaths'
import { EASE, prefersReducedMotion } from '../../lib/motion'

type ColdOpenProps = {
  onComplete: () => void
}

/** Each letterform is drawn by its own stroke sweep, in the order a hand writes. */
const WRITE_START = 0.15
const WRITE_STEP = 0.42
const WRITE_DUR = 0.62

/** Paper grain — a turbulence tile, multiplied over the cream so it reads as stock. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")"

export function ColdOpen({ onComplete }: ColdOpenProps) {
  const [phase, setPhase] = useState<'write' | 'settle' | 'resolve' | 'done'>('write')

  const totalWrite = WRITE_START + WRITE_STEP * (BRIEF_LETTERS.length - 1) + WRITE_DUR

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('done')
      onComplete()
      return
    }

    const timers = [
      window.setTimeout(() => setPhase('settle'), totalWrite * 1000),
      window.setTimeout(() => setPhase('resolve'), totalWrite * 1000 + 900),
      window.setTimeout(() => setPhase('done'), totalWrite * 1000 + 2900),
      window.setTimeout(onComplete, totalWrite * 1000 + 3500),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [onComplete, totalWrite])

  useEffect(() => {
    document.body.style.overflow = phase === 'done' ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [phase])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          data-cold-open
          className="fixed inset-0 z-[100] overflow-hidden bg-cream"
          exit={{ opacity: 0, filter: 'blur(14px)' }}
          // The reduced-motion CSS rule collapses transitions, but Framer
          // animates in JS and ignores it — so the exit has to be zeroed here
          // or the overlay still blurs away for most of a second.
          transition={{ duration: prefersReducedMotion() ? 0 : 0.85, ease: EASE }}
        >
          {/* Window light drifting across the paper. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-1/2"
            style={{
              background:
                'repeating-linear-gradient(114deg, rgba(22,48,92,0) 0px, rgba(22,48,92,0) 150px, rgba(22,48,92,0.055) 190px, rgba(22,48,92,0.075) 250px, rgba(22,48,92,0) 300px, rgba(22,48,92,0) 470px)',
            }}
            initial={{ x: '-6%', y: '-3%' }}
            animate={{ x: '4%', y: '3%' }}
            transition={{ duration: 11, ease: 'linear' }}
          />

          {/* Paper grain. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
            style={{ backgroundImage: GRAIN }}
          />

          {/* The camera: opens tight on the type, then settles back. */}
          <motion.div
            className="relative flex h-full w-full flex-col items-center justify-center px-6"
            initial={{ scale: 2.5, y: 26 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: totalWrite + 1.9, ease: [0.22, 0.62, 0.2, 1] }}
          >
            <svg
              viewBox={LOGO_VIEWBOX}
              className="w-full max-w-[420px] sm:max-w-[500px] md:max-w-[580px]"
              role="img"
              aria-label={BRAND.name}
            >
              <defs>
                {BRIEF_LETTERS.map((l, i) => {
                  // A white panel growing across the letter's own box. The ink
                  // arrives as a moving edge, which is what sells the stroke.
                  const pad = 14
                  return (
                    // The mask region must be stated explicitly: the default is
                    // -10%/120% of the viewport, which lands nowhere near the
                    // wordmark's coordinates and masks it away entirely.
                    <mask
                      key={l.name}
                      id={`w-${i}`}
                      maskUnits="userSpaceOnUse"
                      x="190"
                      y="590"
                      width="460"
                      height="280"
                    >
                      <motion.rect
                        x={l.x0 - pad}
                        y={l.y0 - pad}
                        width={l.x1 - l.x0 + pad * 2}
                        height={l.y1 - l.y0 + pad * 2}
                        fill="white"
                        style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: WRITE_DUR,
                          delay: WRITE_START + i * WRITE_STEP,
                          ease: [0.55, 0.02, 0.35, 1],
                        }}
                      />
                    </mask>
                  )
                })}
              </defs>

              {BRIEF_LETTERS.map((l, i) => (
                <path
                  key={l.name}
                  d={l.d}
                  fill="#16305C"
                  fillRule="evenodd"
                  mask={`url(#w-${i})`}
                />
              ))}

              {THEORY_PATHS.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="#16305C"
                  fillRule="evenodd"
                  initial={{ opacity: 0 }}
                  animate={phase === 'write' ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                />
              ))}
            </svg>

            <AnimatePresence>
              {phase === 'resolve' && (
                <motion.p
                  className="mt-7 text-center text-[0.6rem] font-light uppercase tracking-[0.42em] text-navy/60 sm:mt-9 sm:text-[0.7rem]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  {BRAND.tagline}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Dust catching the light, late in the frame. */}
          {phase !== 'write' && (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {DUST.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-navy/25"
                  style={{ left: p.l, top: p.t, width: p.s, height: p.s }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.7, 0], y: -26 }}
                  transition={{ duration: 4.2, delay: p.d, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const DUST = [
  { l: '18%', t: '32%', s: 4, d: 0.1 },
  { l: '27%', t: '68%', s: 3, d: 0.7 },
  { l: '44%', t: '24%', s: 3, d: 0.35 },
  { l: '63%', t: '71%', s: 5, d: 0.2 },
  { l: '72%', t: '38%', s: 3, d: 0.9 },
  { l: '84%', t: '60%', s: 4, d: 0.5 },
]
