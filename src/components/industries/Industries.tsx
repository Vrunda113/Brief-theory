import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CASE_LOGIC, CASE_LOGIC_LETTERS, HERO, INDUSTRIES } from '../../config/copy'
import { EASE, gsap, prefersReducedMotion } from '../../lib/motion'
import { ContactButton } from '../shared/Buttons'
import { Navbar } from '../hero/Navbar'

/**
 * The opening screen: one piece of film running full bleed, the brand set over
 * it on the left, and the sectors the practice works across turning past on an
 * arch along the bottom.
 *
 * The cards ride the rim of a very large circle whose centre sits far below the
 * viewport, so a small rotation reads as a horizontal sweep with a gentle lean —
 * upright at the apex, tilting away toward the edges. Whichever card is nearest
 * the apex is the live one: its name is what appears on the left, so the arch
 * and the type are one system rather than two things that happen to move.
 */

/**
 * Circle radius in px. Flatter than it looks it needs to be: cards away from
 * the apex ride lower by RADIUS x (1 - cos of their angle), and that drop is
 * what decides how tall the band must be to show a whole card. Widening the
 * circle shrinks the drop without touching the spacing between cards.
 */
const RADIUS = 5000
/** Degrees between adjacent cards — arc spacing is RADIUS x this in radians. */
const STEP = 2.8
/** Seconds a card takes to travel one position. */
const TRAVEL = 0.85
/** Seconds a sector is held at the apex before the arch moves on. */
const HOLD = 2
/** Copies of the set, enough to keep the visible arc filled through a loop. */
const COPIES = 3
/** Card face. Kept portrait so the arch reads as a row of stills. */
const CARD_W = 'clamp(140px, 12.8vw, 190px)'
const CARD_H = 'clamp(170px, 15vw, 222px)'
/**
 * The band the arch lives in, sized to hold a whole card plus the drop of the
 * outermost one — otherwise the foot of the section crops them. Measured in its
 * own right rather than as a share of the viewport, so the section can grow
 * when the columns stack without the arch drifting off the bottom edge.
 */
const ARCH_BAND = 'clamp(250px, 32svh, 312px)'
/** Lifts the arch clear of the very bottom, so the cards sit rather than hang. */
const ARCH_LIFT = 'clamp(0.75rem, 2.5vh, 1.75rem)'

const N = INDUSTRIES.length
/** The set starts one full turn to the left, so the middle copy holds the apex. */
const FIRST_ANGLE = -(N * STEP)
const LOOP = Array.from({ length: COPIES }, () => INDUSTRIES).flat()

/**
 * The film behind the opening screen, changing with the sector at the apex.
 *
 * Two layers rather than one: swapping the source of a single video blanks it
 * while the new file opens, which reads as a flicker between every sector. The
 * outgoing film holds until the incoming one has covered it.
 */
function Backdrop({ active }: { active: number }) {
  // Which layer is in front, and what each is showing. Only the two are ever
  // mounted, so this never holds nine films open at once.
  const [layers, setLayers] = useState(() => ({ a: 0, b: -1, front: 'a' as 'a' | 'b' }))
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLayers((prev) => {
      if (prev[prev.front] === active) return prev
      const next = prev.front === 'a' ? 'b' : 'a'
      return { ...prev, [next]: active, front: next }
    })
  }, [active])

  /*
   * Released once the opening screen is scrolled past. Two clips decoding
   * behind a page nobody is looking at is two fewer the work section can have,
   * and that section is already at the browser's limit.
   */
  useEffect(() => {
    const el = box.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.querySelectorAll('video').forEach((v) => {
          if (entry.isIntersecting) void v.play().catch(() => {})
          else v.pause()
        })
      },
      { threshold: 0.01 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={box} className="absolute inset-0 bg-navy">
      {(['a', 'b'] as const).map((slot) => {
        const i = layers[slot]
        if (i < 0) return null
        const item = INDUSTRIES[i]
        return (
          <video
            // Keyed on the source so a change mounts a fresh element and starts
            // it from its first frame rather than mid-shot.
            key={`${slot}-${item.video}`}
            src={item.video}
            poster={item.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
              layers.front === slot ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )
      })}
    </div>
  )
}

/** The face of a card. Positioning is the caller's business. */
function CardFace({ item }: { item: (typeof INDUSTRIES)[number] }) {
  return (
    <>
      <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" />
      {/* Wash runs from the top, and the caption sits with it: on the arch the
          foot of every card is cropped by the viewport, so anything anchored to
          the bottom edge is never seen. */}
      <div className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-navy-deep/90 via-navy-deep/35 to-transparent" />

      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-cream/30 font-serif text-[0.6rem] text-cream/80">
        {item.index}
      </span>

      <p className="absolute left-3 right-11 top-3 font-serif text-[0.82rem] leading-tight text-cream sm:text-[0.95rem]">
        {item.name}
      </p>
    </>
  )
}

const CARD_SHELL =
  'overflow-hidden rounded-[22px] border border-cream/15 bg-navy-deep shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] sm:rounded-[28px]'
const CARD_SIZE = { width: CARD_W, height: CARD_H }

type IndustriesProps = {
  /** True once the cold open has lifted. */
  ready: boolean
}

export function Industries({ ready }: IndustriesProps) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const wheel = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  /*
   * Two reasons to hold the arch still: the cold open is still up, or the
   * screen has scrolled away. Holding them as state rather than calling
   * play/pause directly means they cannot fight each other. Hovering is
   * deliberately not one of them — the arch never stops under the cursor.
   */
  const gates = useRef({ ready: false, visible: false })
  const sync = useRef<() => void>(() => {})

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !wheel.current) return

    const cards = gsap.utils.toArray<HTMLElement>('[data-arch-card]')

    /*
     * A sector arriving at the apex has to land, not sweep past: the name and
     * the backdrop both change with it, and neither reads at speed. So the
     * arch steps — one position, then a beat — rather than turning evenly.
     */
    const land = (k: number) => {
      const el = k + N
      cards.forEach((card, j) => card.classList.toggle('is-live', j === el))
      setActive(k % N)
    }
    land(0)

    const steps = gsap.timeline({ repeat: -1, paused: true })
    for (let k = 1; k <= N; k++) {
      steps
        .to(wheel.current, { rotation: -k * STEP, duration: TRAVEL, ease: 'power2.inOut' })
        .call(() => land(k % N))
        .to({}, { duration: HOLD })
    }

    sync.current = () => {
      const { ready: r, visible } = gates.current
      if (r && visible) steps.play()
      else steps.pause()
    }

    const el = root.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        gates.current.visible = entry.isIntersecting
        sync.current()
      },
      { threshold: 0.05 },
    )
    if (el) observer.observe(el)

    return () => {
      observer.disconnect()
      steps.kill()
    }
  }, [])

  // The arch holds at its first sector until the cold open lifts, so the screen
  // is never revealed part-way through a step.
  useEffect(() => {
    gates.current.ready = ready
    sync.current()
  }, [ready])

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.9, ease: EASE },
  })

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-svh flex-col overflow-hidden bg-navy"
    >
      {/* The film, full bleed, with enough wash over it that cream type holds. */}
      <Backdrop active={active} />
      {/* Type sits on both sides now, so the wash has to be even across the
          width rather than heavy at the left edge — with the foot darkened so
          the arch reads against it. */}
      <div className="absolute inset-0 bg-navy/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-navy/45" />

      <Navbar />

      {/* Sector on the left, the argument on the right. */}
      <div
        className="relative z-10 grid flex-1 items-center gap-x-16 gap-y-12 px-6 pt-6 md:px-10 lg:grid-cols-2"
        style={{
          paddingBottom: reduced ? '2rem' : `calc(${ARCH_BAND} + ${ARCH_LIFT} + 1rem)`,
        }}
      >
        <motion.div {...rise(0.15)}>
          <p className="mb-1.5 text-[0.58rem] font-light uppercase tracking-[0.34em] text-slate-brand sm:text-[0.66rem]">
            We work across
          </p>
          {/* Fixed height, so the button below never shifts as names of
              different lengths cycle through. */}
          <p
            className="flex h-[1.3em] items-center font-serif italic leading-none text-cream"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3.1rem)' }}
          >
            <span key={active} className="industry-swap">
              {INDUSTRIES[active].name}
            </span>
          </p>

          <div className="mt-7 sm:mt-8">
            <ContactButton>{HERO.cta}</ContactButton>
          </div>
        </motion.div>

        {/* Section 09 of the profile: one engagement reduced to its logic. It
            sits here rather than later in the page because it is the shortest
            complete demonstration of the practice — the argument, on arrival.
            Flushed to the right margin so it answers the sector block on the
            left rather than drifting toward the middle. */}
        <motion.div {...rise(0.45)} className="w-full max-w-2xl lg:w-fit lg:justify-self-end">
          <p className="mb-3 text-[0.58rem] font-light uppercase tracking-[0.34em] text-slate-brand sm:text-[0.66rem]">
            {CASE_LOGIC.eyebrow}
          </p>

          <h2
            className="font-serif font-medium leading-[1.1] text-cream"
            style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.5rem)' }}
          >
            From brief to <em className="font-serif italic text-slate-pale">theory.</em>
          </h2>

          <p className="mt-2 text-[0.78rem] font-light italic leading-relaxed text-slate-steel/80 sm:text-[0.88rem]">
            {CASE_LOGIC.lede}
          </p>

          <ol className="seq mt-6 sm:mt-7">
            {CASE_LOGIC.steps.map((step, i) => (
              <li
                key={step.index}
                className="seq-step relative flex gap-4 pb-[clamp(0.7rem,1.8vh,1.15rem)] sm:gap-5"
              >
                {/* Thread down the margin, stopping at the last letter. */}
                {i < CASE_LOGIC.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[0.86rem] top-[1.75rem] w-px bg-slate-steel/25"
                  />
                )}
                <span
                  data-cursor-grow
                  className="seq-dot relative z-10 flex h-[1.72rem] w-[1.72rem] flex-none items-center justify-center rounded-full border border-slate-steel/45 font-serif text-[0.72rem] text-slate-pale"
                >
                  {CASE_LOGIC_LETTERS[i]}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="seq-tag mb-0.5 text-[0.55rem] font-light uppercase tracking-[0.22em] text-slate-brand sm:text-[0.62rem]">
                    {step.label}
                  </p>
                  <p
                    className="seq-line font-serif italic leading-snug text-cream"
                    style={{ fontSize: 'clamp(0.9rem, 1.25vw, 1.1rem)' }}
                  >
                    {step.line}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>

      {/*
        The arch. Anchored to the section rather than the flow, so it hangs off
        the bottom edge and is cropped by it. With motion turned down it is a
        plain row instead — a wheel cannot be talked into being a list, so the
        two cases are rendered separately rather than fought over in CSS.
      */}
      {reduced ? (
        <ul className="relative z-10 mb-8 flex snap-x gap-4 overflow-x-auto px-6 pb-2 md:px-10">
          {INDUSTRIES.map((item) => (
            <li
              key={item.index}
              className={`relative flex-none snap-start ${CARD_SHELL}`}
              style={CARD_SIZE}
            >
              <CardFace item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 1.1, ease: EASE }}
          className="pointer-events-none absolute inset-x-0 z-10 overflow-hidden"
          style={{ height: ARCH_BAND, bottom: ARCH_LIFT }}
        >
          <div className="absolute h-0 w-0" style={{ left: '50%', top: `${RADIUS}px` }}>
            <div
              ref={wheel}
              className="absolute h-0 w-0"
              style={{ transformOrigin: '0 0', willChange: 'transform' }}
            >
              {LOOP.map((item, i) => (
                <article
                  key={`${item.index}-${i}`}
                  data-arch-card
                  className={`arch-card absolute left-0 top-0 ${CARD_SHELL}`}
                  style={{
                    ...CARD_SIZE,
                    transform: `rotate(${FIRST_ANGLE + i * STEP}deg) translateY(-${RADIUS}px) translateX(-50%)`,
                  }}
                >
                  <CardFace item={item} />
                </article>
              ))}
            </div>
          </div>
        </motion.div>
      )}

    </section>
  )
}
