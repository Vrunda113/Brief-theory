import { useLayoutEffect, useRef, type ReactNode } from 'react'
import {
  CASE_LOGIC,
  CASE_LOGIC_LETTERS,
  METHOD_STAGES,
  PERSPECTIVE_TITLES,
  PRACTICE,
  QUESTIONS,
} from '../../config/copy'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion'

/**
 * Chapters 06–09 of the brand profile, each held to a single screen and turned
 * like the leaves of a book: the spread on top hinges at its left edge and
 * swings away, the one beneath coming out of its shadow as it goes.
 *
 * The stock alternates navy, cream, navy, cream, so every turn is also a change
 * of light — the profile itself alternates its spreads the same way. Display
 * type is Playfair here and nowhere else on the page; these four are the
 * printed-profile section, and the serif is what marks them as such.
 */

/**
 * Scroll a spread is held for, relative to one turn. The turn gets the larger
 * share on purpose: at these proportions one fold spans roughly a full screen
 * of scrolling, so it unrolls under the reader's hand instead of snapping
 * between two flicks of the wheel.
 */
const DWELL = 0.7
const TURN = 2
/** How far a leaf swings before it is let go of. */
const FOLD_TO = -96
/**
 * The leaf dissolves over the tail of its own turn. Near edge-on, perspective
 * squeezes the whole spread into a narrow wedge of smeared type at the hinge —
 * accurate to the geometry and ugly on screen. Going dark and releasing before
 * it gets there is what sells it as paper.
 */
const RELEASE_AT = 0.82
/** Shadow the lifting leaf throws on the spread it uncovers. */
const SHADE = 0.55

/** Must match the number of <Page> elements rendered below. */
const PAGE_COUNT = 4
/** Ground of each leaf in order, so the margin rail can invert against it. */
const TONES = ['dark', 'light', 'dark', 'light'] as const
/** The rail reads as ink on cream and as silver on navy. */
const RAIL_INK = { dark: '#D8E3F0', light: '#16305C' }

/**
 * Where each spread begins, as a fraction of the whole pinned run — the rail's
 * tick marks. Derived rather than eyeballed, so changing the pacing above moves
 * the ticks with it.
 */
const RUN = PAGE_COUNT * DWELL + (PAGE_COUNT - 1) * TURN
const TICKS = Array.from({ length: PAGE_COUNT }, (_, i) => (i * (DWELL + TURN)) / RUN)

const beliefs = METHOD_STAGES[0]

export function Chapters() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const pages = gsap.utils.toArray<HTMLElement>('[data-page]')
      const lifts = gsap.utils.toArray<HTMLElement>('[data-lift]')
      const shades = gsap.utils.toArray<HTMLElement>('[data-shade]')
      const rail = gsap.utils.toArray<HTMLElement>('[data-rail]')[0]
      const railFill = gsap.utils.toArray<HTMLElement>('[data-rail-fill]')[0]

      gsap.set(rail, { color: RAIL_INK[TONES[0]] })
      gsap.set(railFill, { scaleY: 0, transformOrigin: 'top center' })

      // First spread on top, each one below it in reading order.
      pages.forEach((page, i) => {
        gsap.set(page, { zIndex: pages.length - i, transformOrigin: 'left center' })
      })
      gsap.set(lifts, { opacity: 0 })
      // Every spread but the first starts under the shadow of the one above it.
      gsap.set(shades, { opacity: SHADE })
      gsap.set(shades[0], { opacity: 0 })

      /*
       * The type on a spread does not arrive pre-painted: label, display and
       * items cascade in once the leaf above has cleared it. The cascade runs
       * on its own clock — tying it to the scrub would smear the stagger into
       * the fold. Turns are scrubbed; arrivals are performed.
       */
      const lines = pages.map((page) =>
        Array.from(page.querySelectorAll<HTMLElement>('[data-reveal]')),
      )
      const revealed = pages.map(() => false)

      const show = (i: number) => {
        if (revealed[i]) return
        revealed[i] = true
        gsap.fromTo(
          lines[i],
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.09, overwrite: 'auto' },
        )
      }
      const hide = (i: number) => {
        revealed[i] = false
        gsap.set(lines[i], { autoAlpha: 0, y: 26, overwrite: 'auto' })
      }

      // Everything below the first leaf waits for its page to be uncovered.
      lines.slice(1).forEach((_, i) => hide(i + 1))

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${pages.length * 170}%`,
          pin: true,
          scrub: 1.2,
        },
      })

      // The first spread performs its arrival as the section scrolls into
      // reach, before the pin engages.
      hide(0)
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 60%',
        onEnter: () => show(0),
        onLeaveBack: () => hide(0),
      })

      pages.forEach((page, i) => {
        timeline.to({}, { duration: DWELL })
        if (i === pages.length - 1) return

        const turn = gsap.timeline()
        turn
          // A steady ease: the fold should feel like it is being drawn by the
          // scroll, not sprung by it.
          .to(page, { rotationY: FOLD_TO, duration: TURN, ease: 'power1.inOut' }, 0)
          // The turning face angles out of the light as it goes.
          .to(lifts[i], { opacity: 0.92, duration: TURN, ease: 'power2.in' }, 0)
          // …and the spread underneath comes into it.
          .to(shades[i + 1], { opacity: 0, duration: TURN, ease: 'power1.out' }, 0)
          .to(page, { autoAlpha: 0, duration: TURN * (1 - RELEASE_AT) }, TURN * RELEASE_AT)
          // The rail inverts as the ground under it changes, around the point
          // where the incoming leaf takes over the screen.
          .to(
            rail,
            { color: RAIL_INK[TONES[i + 1]], duration: TURN * 0.4, ease: 'none' },
            TURN * 0.32,
          )
        timeline.add(turn)
        // The next spread's type arrives as the leaf clears it — and is put
        // back to waiting when the reader scrubs the turn open again.
        timeline.call(
          () => {
            const st = timeline.scrollTrigger
            if (st && st.direction < 0) hide(i + 1)
            else show(i + 1)
          },
          [],
          `<+=${TURN * 0.4}`,
        )
      })

      // One continuous fill across the whole run — added last so it can span
      // the timeline's finished length rather than a guessed one.
      timeline.to(railFill, { scaleY: 1, ease: 'none', duration: timeline.duration() }, 0)
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="method"
      ref={root}
      data-sequence
      className="relative h-svh overflow-hidden bg-navy"
    >
      {/*
        Reading rail. Sits outside the perspective container so it stays put
        while the leaves turn past it, and inverts with the ground beneath it.
        Hidden on phones, where the margin is too narrow to hold it clear of
        the text.
      */}
      <div
        data-rail
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-1/2 z-50 hidden h-[38vh] w-[7px] -translate-y-1/2 md:left-10 md:block"
      >
        <div className="absolute left-0 top-0 h-full w-px bg-current opacity-[0.22]" />
        <div
          data-rail-fill
          className="absolute left-0 top-0 h-full w-px bg-current"
        />
        {TICKS.map((t) => (
          <span
            key={t}
            className="absolute left-0 h-px w-[7px] bg-current opacity-40"
            style={{ top: `${t * 100}%` }}
          />
        ))}
      </div>

      {/* One vanishing point for all four leaves, so they turn as a bound set. */}
      <div
        data-sequence-track
        className="relative h-full"
        style={{ perspective: '3200px' }}
      >
        {/* ------------------------------------------------ 06 · Core beliefs */}
        <Page tone="dark" folio="06">
          <Label tone="dark">06 — Core beliefs</Label>
          <Display tone="dark">{beliefs.heading}</Display>

          {/* Two columns even on a phone: this spread is pinned to one screen,
              and six stacked beliefs run past it. */}
          <Body>
          <div className="grid grid-cols-2 gap-x-5 gap-y-[clamp(1.25rem,3.5vh,2.5rem)] sm:gap-x-10 lg:grid-cols-3">
            {beliefs.items.map((item) => (
              <div key={item.index} data-reveal>
                <p className="font-serif text-base text-slate-steel/70 sm:text-lg">{item.index}</p>
                <h3
                  className="mb-1.5 mt-1.5 font-serif font-medium italic leading-snug text-cream"
                  style={{ fontSize: 'clamp(0.92rem, 1.55vw, 1.4rem)' }}
                >
                  {item.title}
                </h3>
                <p className="max-w-[34ch] text-[0.72rem] font-light leading-relaxed text-slate-pale/65 sm:text-[0.85rem]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          </Body>
        </Page>

        {/* ------------------------------ 07 · Where strategy becomes tangible */}
        <Page tone="light" folio="07">
          <Label tone="light">07 — Where strategy becomes tangible</Label>
          <Display tone="light" size="md">
            We don’t create deliverables. We build <Em tone="light">brand systems.</Em>
          </Display>

          <Body>
          <div className="border-t border-navy/15">
            {PRACTICE.pillars.map((pillar) => (
              <div
                key={pillar.index}
                data-reveal
                className="flex items-baseline gap-5 border-b border-navy/15 py-[clamp(0.5rem,1.7vh,1.15rem)] sm:gap-9"
              >
                <p
                  className="w-[2.4rem] flex-none font-serif font-medium leading-none text-slate-brand sm:w-[3.6rem]"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                >
                  {pillar.index}
                </p>
                <div className="min-w-0">
                  <h3 className="mb-1 text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-navy sm:text-[0.95rem]">
                    {pillar.name}
                  </h3>
                  <p className="text-[0.75rem] font-light leading-relaxed text-navy/55 sm:text-[0.85rem]">
                    {pillar.items.join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          </Body>
        </Page>

        {/* ------------------------------------------------- 08 · How we think */}
        <Page tone="dark" folio="08">
          <Label tone="dark">08 — How we think</Label>
          <Display tone="dark">
            Before process, <Em tone="dark">perspective.</Em>
          </Display>

          <Body>
          <div className="grid gap-x-16 gap-y-[clamp(1.5rem,4.5vh,3rem)] sm:grid-cols-2">
            {QUESTIONS.map((q, i) => (
              <div key={q.index} data-reveal className="border-l border-slate-pale/25 pl-5 sm:pl-7">
                <p className="mb-2 font-serif text-[0.72rem] uppercase tracking-[0.2em] text-slate-pale/60 sm:text-[0.8rem]">
                  {q.index} — {q.title}
                </p>
                <h3
                  className="mb-1.5 font-serif font-medium leading-snug text-cream"
                  style={{ fontSize: 'clamp(1.15rem, 1.95vw, 1.75rem)' }}
                >
                  {PERSPECTIVE_TITLES[i]}
                </h3>
                <p className="text-[0.78rem] font-light leading-relaxed text-slate-pale/65 sm:text-[0.87rem]">
                  {q.body}
                </p>
              </div>
            ))}
          </div>
          </Body>
        </Page>

        {/* ------------------------------------------ 09 · Thinking in practice */}
        <Page tone="light" folio="09">
          <Label tone="light">09 — Thinking in practice</Label>
          <Display tone="light">
            From brief to <Em tone="light">theory.</Em>
          </Display>

          <Body>
          <ol className="max-w-2xl">
            {CASE_LOGIC.steps.map((step, i) => (
              <li key={step.index} data-reveal className="relative flex gap-5 pb-[clamp(0.9rem,2.6vh,1.7rem)]">
                {/* Thread down the margin, stopping at the last letter. */}
                {i < CASE_LOGIC.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[0.94rem] top-[1.9rem] w-px bg-navy/20"
                  />
                )}
                <span className="relative z-10 flex h-[1.9rem] w-[1.9rem] flex-none items-center justify-center rounded-full border border-navy/45 bg-cream font-serif text-[0.8rem] text-navy">
                  {CASE_LOGIC_LETTERS[i]}
                </span>
                <div className="pt-0.5">
                  <p className="mb-0.5 text-[0.65rem] font-light uppercase tracking-[0.18em] text-slate-brand sm:text-[0.72rem]">
                    {step.label}
                  </p>
                  <p
                    className="font-serif italic leading-snug text-navy"
                    style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)' }}
                  >
                    {step.line}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          </Body>
        </Page>
      </div>
    </section>
  )
}

/**
 * One leaf. Back-face culling with the default flat transform-style means the
 * whole subtree vanishes once the page passes edge-on, so the reverse of the
 * type is never visible.
 */
function Page({
  tone,
  folio,
  children,
}: {
  tone: 'dark' | 'light'
  folio: string
  children: ReactNode
}) {
  return (
    <article
      data-page
      data-stage
      className={`absolute inset-0 ${tone === 'dark' ? 'bg-navy' : 'bg-cream'}`}
      style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
    >
      {/* Folio numeral, cropped off the fore-edge the way a printed one would
          be. It gives the open side of the spread some weight — the working
          content sits up and left, and this balances the remainder. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-[0.16em] -right-[0.05em] select-none font-serif leading-none ${
          tone === 'dark' ? 'text-cream/[0.045]' : 'text-navy/[0.05]'
        }`}
        style={{ fontSize: 'clamp(13rem, 28vw, 27rem)' }}
      >
        {folio}
      </span>

      {/* Anchored high like an editorial page, not floated in the middle:
          label and display hold a fixed head height, and the body balances
          whatever remains below them. */}
      <div className="relative flex h-full flex-col px-6 pb-[clamp(1.75rem,5vh,3rem)] pt-[clamp(2.75rem,9.5vh,6rem)] md:px-10">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">{children}</div>
      </div>

      {/* Cast by the leaf above while this one is still covered. */}
      <div
        data-shade
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black"
      />
      {/* This leaf angling out of the light as it turns. */}
      <div
        data-lift
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10"
      />
    </article>
  )
}

/** The spread's working area: takes the room left under the display line and
 * balances its content there, so nothing floats in the dead centre of the
 * screen but nothing crowds the heading either. */
function Body({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 items-center pt-[clamp(1rem,3vh,2.25rem)]">
      <div className="w-full">{children}</div>
    </div>
  )
}

function Display({
  tone,
  size = 'lg',
  children,
}: {
  tone: 'dark' | 'light'
  /** 'md' for headlines that run to two lines — they need the smaller setting. */
  size?: 'lg' | 'md'
  children: ReactNode
}) {
  return (
    <h2
      data-reveal
      className={`font-serif font-medium leading-[1.05] tracking-[-0.01em] ${
        tone === 'dark' ? 'text-cream' : 'text-navy'
      }`}
      style={{
        // The vh term matters: these spreads are pinned to one screen, so on a
        // short laptop the display has to give room back to the content.
        fontSize:
          size === 'lg'
            ? 'clamp(1.85rem, min(4.6vw, 7.4vh), 4.1rem)'
            : 'clamp(1.6rem, min(3.8vw, 5.4vh), 3.15rem)',
      }}
    >
      {children}
    </h2>
  )
}

function Em({ tone, children }: { tone: 'dark' | 'light'; children: ReactNode }) {
  return (
    <em
      className={`font-serif font-normal italic ${
        tone === 'dark' ? 'text-slate-pale' : 'text-slate-brand'
      }`}
    >
      {children}
    </em>
  )
}

function Label({ tone, children }: { tone: 'dark' | 'light'; children: ReactNode }) {
  return (
    <p
      data-reveal
      className={`mb-[clamp(0.85rem,2.5vh,1.6rem)] text-[0.62rem] font-light uppercase tracking-[0.38em] sm:text-[0.7rem] ${
        tone === 'dark' ? 'text-slate-steel/80' : 'text-navy/50'
      }`}
    >
      {children}
    </p>
  )
}
