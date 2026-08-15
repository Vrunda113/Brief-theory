import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BRAND, HERO } from '../../config/copy'
import { EASE } from '../../lib/motion'
import { PALETTE } from '../../config/palette'
import { Navbar } from '../hero/Navbar'
import { ColdOpen } from '../cold-open/ColdOpen'
import { ContactButton } from '../shared/Buttons'
import { WorkField } from './WorkField'

/**
 * The homepage hero.
 *
 * What this replaces was the wordmark extruded into geometry and lit — and
 * extruded lettering is the oldest tell in the book. Depth belongs to objects
 * and photographs; on type it reads as an effect applied to a logo rather than
 * as a brand with a point of view. It also said nothing: a marketing hero that
 * only shows its own name has spent a whole screen introducing itself.
 *
 * So the screen leads with the claim, and the depth moved to the one thing
 * that earns it — the work. Type is flat and crisp on the left; three plates of
 * real client work sit at three depths on the right and part against each other
 * as the pointer moves.
 */

const rise = (delay: number, ready: boolean) => ({
  initial: { opacity: 0, y: 22 },
  animate: ready ? { opacity: 1, y: 0 } : {},
  transition: { delay, duration: 0.85, ease: EASE },
})

export function LivingHero({
  ready,
  onColdOpenComplete,
}: {
  ready: boolean
  onColdOpenComplete: () => void
}) {
  /** True when motion is turned down: everything renders, nothing moves. */
  const [still, setStill] = useState(false)

  useEffect(() => {
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setStill(quiet.matches)
    read()
    quiet.addEventListener('change', read)
    return () => quiet.removeEventListener('change', read)
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden"
      style={{ backgroundColor: PALETTE.paper }}
    >
      <Navbar />

      <div className="relative z-10 mx-auto grid w-full max-w-[88rem] flex-1 items-center gap-12 px-6 pb-16 pt-10 md:px-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20">
        {/* ------------------------------------------------------- the claim */}
        <div className="max-w-[38rem]">
          <motion.p
            {...rise(0.05, ready)}
            className="mb-7 text-[0.6rem] font-light uppercase sm:text-[0.68rem]"
            style={{ color: PALETTE.steel, letterSpacing: '0.34em' }}
          >
            Strategy-led creative practice — {BRAND.location}
          </motion.p>

          {/* The brand line, set as the display. Two weights in one sentence:
              the claim in roman, the turn in italic. */}
          <motion.h1
            {...rise(0.14, ready)}
            className="font-serif font-medium leading-[1.02]"
            style={{ color: PALETTE.ink, fontSize: 'clamp(2.6rem, 5.4vw, 5rem)' }}
          >
            Where every brief
            <br />
            finds its <em className="font-serif italic" style={{ color: PALETTE.steel }}>theory.</em>
          </motion.h1>

          <motion.p
            {...rise(0.24, ready)}
            className="mt-8 max-w-[30rem] font-light leading-relaxed"
            style={{ color: PALETTE.slate, fontSize: 'clamp(0.92rem, 1.15vw, 1.05rem)' }}
          >
            {HERO.intro}
          </motion.p>

          <motion.div {...rise(0.34, ready)} className="mt-10 flex items-center gap-8">
            <ContactButton on="cream" magnetic={false}>
              {HERO.cta}
            </ContactButton>

            <a
              href="#case-studies"
              className="group text-[0.6rem] font-light uppercase tracking-[0.26em] transition-opacity duration-300 hover:opacity-100"
              style={{ color: PALETTE.slate }}
            >
              <span className="border-b pb-1" style={{ borderColor: `${PALETTE.slate}55` }}>
                See the work
              </span>
            </a>
          </motion.div>
        </div>

        {/* -------------------------------------------------------- the work */}
        {/*
          Given a fixed height and its own overflow rather than letting the
          cards size it: left to grow, the belts pushed the section past the
          viewport and the lowest cards were cut off by the fold.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.45, duration: 1.1, ease: EASE }}
          className="hidden overflow-hidden lg:block"
          style={{ height: 'min(72vh, 640px)' }}
        >
          <WorkField still={still} />
        </motion.div>
      </div>

      {/* The landing screen, over everything until it lifts. */}
      <ColdOpen onComplete={onColdOpenComplete} />
    </section>
  )
}
