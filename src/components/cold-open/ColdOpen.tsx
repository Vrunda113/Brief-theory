import { memo, useEffect, useState } from 'react'
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

/**
 * What the mark settles back to once the page takes over. Low enough that the
 * opening argument reads over it, high enough that it is plainly the logo and
 * not a smudge.
 */
const BACKDROP_OPACITY = 0.11

/** How long the sheet takes to clear and the mark to fall back. */
const SETTLE = 1.4

/** Paper grain — a turbulence tile, multiplied over the cream so it reads as stock. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")"

/**
 * The opening title, which does not leave.
 *
 * It used to be a fixed overlay that blurred itself away, handing the screen to
 * a separate copy of the logo sitting in the home page behind it. Now there is
 * one mark: the sheet it is written on clears, the mark itself falls back to a
 * watermark, and the home page rises through it. The landing screen and the
 * home page are the same screen in two states.
 *
 * It lives inside the opening section and is positioned against it rather than
 * against the viewport, so it cannot outstay the first screen — `fixed` would
 * have followed the reader down the whole page. The two coincide while it is
 * up, because the scroll is locked at the top until it settles.
 *
 * Memoised for the same reason as the navbar: the section around it re-renders
 * on every turn of the sector deck, and rebuilding the wordmark's nine masked
 * letterforms on each one is real work for no change at all.
 */
export const ColdOpen = memo(function ColdOpen({ onComplete }: ColdOpenProps) {
  const [phase, setPhase] = useState<'write' | 'settle' | 'resolve' | 'backdrop'>('write')
  /**
   * Dropped behind the page only once the sheet has fully cleared. Sinking it
   * at the start of the settle would put the mark behind a sheet that is still
   * opaque, and it would vanish for a beat before reappearing.
   */
  const [sunk, setSunk] = useState(false)

  const settled = phase === 'backdrop'
  const totalWrite = WRITE_START + WRITE_STEP * (BRIEF_LETTERS.length - 1) + WRITE_DUR

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('backdrop')
      setSunk(true)
      onComplete()
      return
    }

    const settleAt = totalWrite * 1000 + 2900
    const timers = [
      window.setTimeout(() => setPhase('settle'), totalWrite * 1000),
      window.setTimeout(() => setPhase('resolve'), totalWrite * 1000 + 900),
      // The page starts its own entrance as the sheet begins to clear, so the
      // two are one movement rather than a wait followed by a reveal.
      window.setTimeout(() => {
        setPhase('backdrop')
        onComplete()
      }, settleAt),
      window.setTimeout(() => setSunk(true), settleAt + SETTLE * 1000 + 150),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [onComplete, totalWrite])

  useEffect(() => {
    document.body.style.overflow = settled ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [settled])

  return (
    <div
      data-cold-open
      aria-hidden={settled}
      className={`pointer-events-none absolute inset-x-0 top-0 h-svh overflow-hidden ${
        sunk ? 'z-0' : 'z-[100]'
      }`}
    >
      {/* The sheet the mark is written on. It clears rather than blurring away,
          and everything that belongs to the paper goes with it. */}
      <motion.div
        className="absolute inset-0 bg-cream"
        animate={{ opacity: settled ? 0 : 1 }}
        transition={{ duration: prefersReducedMotion() ? 0 : SETTLE, ease: EASE }}
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
      </motion.div>

      {/* The camera: opens tight on the type, then settles back. */}
      <motion.div
        className="relative flex h-full w-full items-center justify-center px-6"
        initial={{ scale: 2.5, y: 26 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: totalWrite + 1.9, ease: [0.22, 0.62, 0.2, 1] }}
      >
        <motion.div
          className="relative w-full max-w-[420px] sm:max-w-[500px] md:max-w-[580px]"
          animate={{ opacity: settled ? BACKDROP_OPACITY : 1 }}
          transition={{ duration: prefersReducedMotion() ? 0 : SETTLE, ease: EASE }}
        >
          <svg
            viewBox={LOGO_VIEWBOX}
            className="w-full"
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

          {/* Set in the wordmark's own serif rather than the page's sans, and
              tracked to about the same rhythm as the THEORY line above it, so
              the two read as one lockup. In Kanit it sat under a serif mark as
              an unrelated second voice.

              Held out of the mark's flow: in it, the tagline arriving and
              leaving would shift the mark up and back down, and the mark has
              to stay perfectly still through the settle. */}
          <AnimatePresence>
            {phase === 'resolve' && (
              <motion.p
                // The mark's own ink, so the caption belongs to it.
                className="absolute inset-x-0 top-full mt-6 text-center font-serif uppercase leading-relaxed text-[#16305C]/80 sm:mt-8"
                style={{
                  fontSize: 'clamp(0.8rem, 1.45vw, 1.08rem)',
                  letterSpacing: '0.42em',
                  // Tracking pads the right of the last letter too, which
                  // throws a centred line visibly off-axis at this width.
                  textIndent: '0.42em',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                {BRAND.tagline}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dust catching the light, late in the frame. */}
      {phase !== 'write' && !settled && (
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
    </div>
  )
})

const DUST = [
  { l: '18%', t: '32%', s: 4, d: 0.1 },
  { l: '27%', t: '68%', s: 3, d: 0.7 },
  { l: '44%', t: '24%', s: 3, d: 0.35 },
  { l: '63%', t: '71%', s: 5, d: 0.2 },
  { l: '72%', t: '38%', s: 3, d: 0.9 },
  { l: '84%', t: '60%', s: 4, d: 0.5 },
]
