import { useLayoutEffect, useRef } from 'react'
import { METHOD_STAGES } from '../../config/copy'
import { gsap, prefersReducedMotion } from '../../lib/motion'

/**
 * Three consecutive spreads from the brand profile, delivered under one pin:
 * what the practice believes, the questions beneath every engagement, then how
 * an engagement actually unfolds.
 *
 * Every point is shown exactly once, all of it on screen at the same time, in
 * one navy panel ruled into equal columns. Nothing moves on its own; scroll
 * only advances from one spread to the next.
 */

/** Scroll distance each spread holds for, as a share of the pinned timeline. */
const DWELL = 1.6

/** Lean of the outermost cards, in degrees. Small: the copy has to stay readable. */
const MAX_TILT = 4.5
/** How far the outermost cards drop, in px, to carry the tilt into a curve. */
const MAX_SAG = 26

/** Tilt and drop for card `i` of `n`, measured out from the centre of the row. */
function arc(i: number, n: number) {
  const t = n < 2 ? 0 : (i - (n - 1) / 2) / ((n - 1) / 2)
  return { tilt: t * MAX_TILT, sag: t * t * MAX_SAG }
}

/**
 * Columns lighten left to right, navy into navy-mid, so the row reads as a
 * progression rather than six identical blocks. It stops well short of
 * navy-mid: past roughly this point cream type starts losing its bite against
 * the lighter end of the row.
 */
const TINT_FROM = [0x16, 0x30, 0x5c]
const TINT_TO = [0x2e, 0x4a, 0x75]
const TINT_REACH = 0.6

function tint(i: number, n: number) {
  const t = n < 2 ? 0 : (i / (n - 1)) * TINT_REACH
  const [r, g, b] = TINT_FROM.map((from, k) => Math.round(from + (TINT_TO[k] - from) * t))
  return `rgb(${r}, ${g}, ${b})`
}

export function Method() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>('[data-stage]')
      const bars = gsap.utils.toArray<HTMLElement>('[data-bar]')

      gsap.set(stages, { autoAlpha: 0 })
      gsap.set(stages[0], { autoAlpha: 1 })
      gsap.set(bars[0], { scaleX: 1 })
      gsap.set(bars.slice(1), { scaleX: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${stages.length * 130}%`,
          pin: true,
          scrub: 0.8,
        },
      })

      stages.forEach((stage, i) => {
        if (i > 0) {
          const prev = stages[i - 1]
          timeline
            .to(prev.querySelectorAll('[data-card]'), {
              autoAlpha: 0,
              duration: 0.3,
              stagger: 0.02,
            })
            .to(prev.querySelector('[data-head]'), { autoAlpha: 0, y: -22, duration: 0.3 }, '<')
            .to(bars[i - 1], { scaleX: 0.25, duration: 0.35 }, '<')
            .set(prev, { autoAlpha: 0 })
            .set(stage, { autoAlpha: 1 })
            .fromTo(
              stage.querySelector('[data-head]'),
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.35 },
            )
            .fromTo(
              stage.querySelectorAll('[data-card]'),
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04 },
              '<0.1',
            )
            .to(bars[i], { scaleX: 1, duration: 0.4 }, '<')
        }

        // Nothing animates while a spread is up; it simply holds the pin for a
        // stretch of scroll so the reader has time with it.
        timeline.to({}, { duration: DWELL })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="method"
      ref={root}
      data-sequence
      className="relative h-svh overflow-hidden bg-cream"
    >
      <div data-sequence-track className="relative h-full">
        {METHOD_STAGES.map((stage) => {
          const n = stage.items.length
          return (
            <div key={stage.heading} data-stage className="absolute inset-0">
              <div className="flex h-full flex-col justify-center px-6 pb-10 md:px-10">
                <div data-head className="mx-auto w-full max-w-5xl">
                  <p className="mb-3 text-[0.65rem] font-light uppercase tracking-[0.45em] text-navy/60 sm:text-xs">
                    {stage.eyebrow}
                  </p>
                  <h2
                    className="headline-gradient-ink font-black uppercase leading-none tracking-tight"
                    style={{ fontSize: 'clamp(1.7rem, 5vw, 3.6rem)' }}
                  >
                    {stage.heading}
                  </h2>
                  {stage.lede && (
                    <p className="mt-3 text-xs font-light italic text-navy/60 sm:text-sm">
                      {stage.lede}
                    </p>
                  )}
                </div>

                {/* Same container as the headline, so the row starts on the
                    same line the H2 does rather than floating centred inside it. */}
                <div className="mx-auto mt-12 w-full max-w-5xl">
                  <div className="method-row gap-3 sm:gap-4">
                    {stage.items.map((item, i) => {
                      const { tilt, sag } = arc(i, n)
                      return (
                      <article
                        key={item.index}
                        data-card
                        className="method-card flex flex-col rounded-2xl px-4 pb-9 pt-6 shadow-[0_18px_40px_-24px_rgba(15,47,94,0.75)] sm:rounded-3xl sm:px-5 sm:pb-11 sm:pt-7"
                        style={{
                          minHeight: 'clamp(190px, 19vw, 246px)',
                          backgroundColor: tint(i, n),
                          ['--tilt' as string]: `${tilt}deg`,
                          ['--sag' as string]: `${sag}px`,
                        }}
                      >
                        <p className="mb-5 text-[0.7rem] font-light tracking-[0.3em] text-slate-steel">
                          {item.index}
                        </p>
                        <h3
                          className="mb-2.5 font-medium leading-snug text-cream"
                          style={{ fontSize: 'clamp(0.95rem, 1.35vw, 1.15rem)' }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs font-light leading-relaxed text-slate-pale/75 sm:text-[0.8rem]">
                          {item.body}
                        </p>
                      </article>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Which of the three spreads is on screen. */}
      <div className="absolute inset-x-0 bottom-8 px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-5xl gap-2">
          {METHOD_STAGES.map((stage) => (
            <div key={stage.heading} className="h-px flex-1 bg-navy/15">
              <div data-bar className="h-full origin-left bg-navy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
