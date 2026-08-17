import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BRAND, HERO, INDUSTRIES } from '../../config/copy'
import { EASE } from '../../lib/motion'
import { PALETTE } from '../../config/palette'
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

/** Seconds each sector is held before the next takes its place. */
const SECTOR_HOLD = 2.4

export function LivingHero({
  ready,
  onColdOpenComplete,
}: {
  ready: boolean
  onColdOpenComplete: () => void
}) {
  /** True when motion is turned down: everything renders, nothing moves. */
  const [still, setStill] = useState(false)
  /** Which sector is named beneath the headline. */
  const [sector, setSector] = useState(0)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setStill(quiet.matches)
    read()
    quiet.addEventListener('change', read)
    return () => quiet.removeEventListener('change', read)
  }, [])

  /*
   * The sector cycles only while the hero is on screen and motion is allowed.
   * Off screen it is a timer re-rendering a line nobody is reading.
   */
  useEffect(() => {
    if (still) return

    let visible = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.05 },
    )
    if (root.current) observer.observe(root.current)

    const id = window.setInterval(() => {
      if (visible) setSector((i) => (i + 1) % INDUSTRIES.length)
    }, SECTOR_HOLD * 1000)

    return () => {
      observer.disconnect()
      window.clearInterval(id)
    }
  }, [still])

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-svh flex-col overflow-hidden"
      style={{ backgroundColor: PALETTE.paper }}
    >
      {/* The bar is fixed and lives outside this section now, so the hero opens
          its own top clearance rather than having the navigation in flow. */}
      {/*
        Side by side only from the extra-large width, not from large.
        1024px is both the `lg` breakpoint and the width of a portrait tablet,
        so splitting there put the copy and the field into two columns inside a
        1024x1366 window: the field got about 435px, its three belts shrank to
        134px cards, and the pair sat in a band of empty space top and bottom.
        A tall narrow screen wants the two stacked, whatever its pixel width.
      */}
      <div className="relative z-10 mx-auto grid w-full max-w-[88rem] flex-1 items-center gap-12 px-6 pb-16 pt-28 md:px-10 md:pt-32 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] xl:gap-16 xl:pb-20">
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

          {/* The sectors the practice works across, named one at a time. */}
          <motion.div {...rise(0.24, ready)} className="mt-9">
            <p
              className="mb-2 text-[0.55rem] font-light uppercase sm:text-[0.6rem]"
              style={{ color: PALETTE.steel, letterSpacing: '0.32em' }}
            >
              We work across
            </p>
            {/*
              Fixed height, so nothing below moves as the names change —
              "Professional Services" is three times the width of "Luxury" and
              would otherwise shunt the buttons down the page every few seconds.
            */}
            <p
              className="flex h-[1.35em] items-center font-serif italic leading-none"
              style={{ color: PALETTE.ink, fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)' }}
            >
              {/* Keyed on the sector, so the line is replaced and re-enters
                  rather than cross-fading against itself. */}
              <span key={sector} className={still ? undefined : 'industry-swap'}>
                {INDUSTRIES[sector].name}
              </span>
            </p>
          </motion.div>

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
          Shown at every width, not just the wide one. It was `hidden lg:block`,
          so between a phone and 1024px the work simply was not there — the
          hero's whole right-hand half was empty and the six cards the section
          exists to show never appeared.

          Three heights, because the field does three different jobs. Beside the
          copy on a wide screen it is the other half of the composition and
          wants the full run. Stacked under the copy on a tablet it has the
          whole width to itself and a tall screen to fill, so it takes more than
          a phone would. On a phone it is a footer to the hero, and the wide
          height would push everything else off the screen.

          Given a fixed height and its own overflow in every case: left to grow,
          the belts push the section past the viewport and the lowest cards are
          cut off by the fold.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.45, duration: 1.1, ease: EASE }}
          className="h-[clamp(260px,40vh,340px)] overflow-hidden md:h-[clamp(340px,42vh,540px)] xl:h-[min(72vh,640px)]"
        >
          <WorkField still={still} />
        </motion.div>
      </div>

      {/* The landing screen, over everything until it lifts. */}
      <ColdOpen onComplete={onColdOpenComplete} />
    </section>
  )
}
