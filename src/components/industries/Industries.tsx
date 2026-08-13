import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HERO, INDUSTRIES } from '../../config/copy'
import { EASE, prefersReducedMotion } from '../../lib/motion'
import { ContactButton } from '../shared/Buttons'
import { Navbar } from '../hero/Navbar'
import { ColdOpen } from '../cold-open/ColdOpen'

/**
 * The opening screen. The cold open does not lift off this section — it settles
 * into it, its mark staying put and fading back to become the ground the page
 * is set on. So the landing screen and the home page are one screen in two
 * states rather than two screens handed off between.
 *
 * The arch of sector cards that used to turn along the foot has been replaced
 * by a deck held at the right edge: one card per sector, stacked and dealt
 * rather than paraded past. The name under "We work across" is the same index,
 * so the deck and the type are one system rather than two things that happen
 * to move together.
 */

/** Seconds a sector is held before the next one is dealt to the top. */
const HOLD = 3

/** How long the deal itself takes, and on what curve. */
const DEAL = 0.9
/** Eased out hard, so the card leaves quickly and arrives without a bump. */
const DEAL_EASE = [0.22, 1, 0.36, 1] as const

const N = INDUSTRIES.length

/** Card face. Kept portrait, at 3:4 — the art behind it is all vertical. */
const CARD_W = 'clamp(210px, 19vw, 278px)'
const CARD_H = 'clamp(280px, 25.3vw, 370px)'

/** How many of the deck are on show; the rest wait out of sight behind it. */
const DEPTH = 4

/**
 * Where each of the shown cards sits, front first. The offsets alternate side
 * to side rather than stepping evenly, so the stack reads as frames laid down
 * by hand instead of a neat pile — and every card keeps a sliver of its own
 * edge visible, which is what makes the depth legible at this size.
 */
const SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 42, y: -24, rotate: 2.6, scale: 0.95, opacity: 0.62 },
  { x: -33, y: -45, rotate: -2.2, scale: 0.9, opacity: 0.34 },
  { x: 19, y: -63, rotate: 1.8, scale: 0.86, opacity: 0.16 },
]

/** The card just dealt off the top, thrown clear to the right as it goes. */
const EXIT = { x: 108, y: 34, rotate: 7, scale: 0.97, opacity: 0 }

/** Where the rest of the deck waits: the back slot, invisible. */
const PARK = { ...SLOTS[DEPTH - 1], opacity: 0 }

/**
 * The deck. Every sector keeps its own card for the life of the page and is
 * told which slot to be in, rather than the slots being handed fresh content
 * each tick — otherwise the cards would sit still and their faces would swap,
 * which is a slideshow, not a deck.
 *
 * Cards waiting their turn are parked at the back slot with no transition, so
 * a card returning to the deck fades up in place instead of flying the length
 * of the stack to get there.
 */
function IndustryDeck({ active }: { active: number }) {
  return (
    // Padded for the throw and the lean, which reach outside the card box.
    <div className="relative" style={{ width: CARD_W, height: CARD_H }} aria-hidden="true">
      {INDUSTRIES.map((item, i) => {
        const slot = (i - active + N) % N
        const dealt = slot === N - 1
        const target = slot < DEPTH ? SLOTS[slot] : dealt ? EXIT : PARK

        return (
          <motion.article
            key={item.index}
            className="absolute inset-0 overflow-hidden rounded-[18px] border border-navy/25 bg-cream shadow-[0_18px_40px_-24px_rgba(4,46,105,0.55)]"
            // The card being thrown rides over the whole stack on its way out.
            style={{ zIndex: dealt ? N + 1 : N - slot }}
            animate={target}
            transition={{
              duration: slot < DEPTH || dealt ? DEAL : 0,
              ease: DEAL_EASE,
            }}
          >
            {/* Cropped from the top: the art is 9:16 storywork in a squarer
                frame, and what it puts at the top is what it is about.
                Loaded eagerly — the deck is above the fold and turns over the
                whole set inside nine seconds, so deferring any of it only
                buys a hole in the stack. */}
            <img
              src={item.image}
              alt=""
              decoding="async"
              className="h-full w-full object-cover object-top"
            />

            <span className="absolute right-2 top-2 font-serif text-[0.58rem] text-cream/90 mix-blend-difference">
              {item.index}
            </span>
          </motion.article>
        )
      })}
    </div>
  )
}

type IndustriesProps = {
  /** True once the cold open has finished writing and begun settling back. */
  ready: boolean
  /** Called at that moment, so the page can start its own entrance. */
  onColdOpenComplete: () => void
}

export function Industries({ ready, onColdOpenComplete }: IndustriesProps) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  /*
   * Two reasons to hold the cycle still: the cold open is still writing, or the
   * screen has been scrolled past. Both are read at each tick rather than used
   * to start and stop the timer, so they cannot fight each other over it.
   */
  const gates = useRef({ ready: false, visible: true })

  useEffect(() => {
    gates.current.ready = ready
  }, [ready])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const el = root.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        gates.current.visible = entry.isIntersecting
      },
      { threshold: 0.05 },
    )
    if (el) observer.observe(el)

    const id = window.setInterval(() => {
      const { ready: r, visible } = gates.current
      if (r && visible) setActive((i) => (i + 1) % N)
    }, HOLD * 1000)

    return () => {
      observer.disconnect()
      window.clearInterval(id)
    }
  }, [])

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.9, ease: EASE },
  })

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-svh flex-col overflow-hidden bg-cream"
    >
      {/* The mark, held back to a watermark once it has finished writing. It is
          the cold open itself, not a copy of it — see ColdOpen. */}
      <ColdOpen onComplete={onColdOpenComplete} />

      <Navbar />

      {/* Split in half rather than sized to the cards: against the far edge the
          deck left a dead middle, and the mark alone was not enough to hold it.
          An even split brings the deck in to sit over the field. */}
      <div className="relative z-10 grid flex-1 items-center gap-12 px-6 pb-16 pt-6 md:px-10 lg:grid-cols-2 lg:gap-10">
        <motion.div {...rise(0.15)}>
          <p className="mb-1.5 text-[0.58rem] font-light uppercase tracking-[0.34em] text-navy/70 sm:text-[0.66rem]">
            We work across
          </p>
          {/* Fixed height, so the button below never shifts as names of
              different lengths cycle through. */}
          <p
            className="flex h-[1.3em] items-center font-serif italic leading-none text-navy"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3.1rem)' }}
          >
            <span key={active} className="industry-swap">
              {INDUSTRIES[active].name}
            </span>
          </p>

          <div className="mt-7 sm:mt-8">
            {/* Held still. The deck is already turning on this screen, and a
                button drifting after the pointer alongside it was one moving
                thing too many. */}
            <ContactButton on="cream" magnetic={false}>
              {HERO.cta}
            </ContactButton>
          </div>
        </motion.div>

        {/* Centred in its own half, then pushed out past the mark behind it:
            sitting over the wordmark the two read as one muddled object, and
            the mark is the ground, so it is the deck that moves.
            The shift sits on its own element — the entrance animation writes an
            inline transform on the wrapper, which would silently win over a
            translate utility placed there. */}
        <motion.div
          {...rise(0.4)}
          className="justify-self-start pt-10 lg:justify-self-center lg:pt-0"
        >
          <div className="lg:translate-x-20 xl:translate-x-32">
            <IndustryDeck active={active} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
