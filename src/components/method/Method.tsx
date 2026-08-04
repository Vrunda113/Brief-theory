import { useLayoutEffect, useRef } from 'react'
import { METHOD_STAGES } from '../../config/copy'
import { gsap, prefersReducedMotion } from '../../lib/motion'

/**
 * Three consecutive spreads from the brand profile, delivered under one pin:
 * what the practice believes, the questions beneath every engagement, then how
 * an engagement actually unfolds.
 *
 * Every point is shown exactly once, all of it on screen at the same time. The
 * cards sit in a fixed row with a slight arc — outer cards lean away from the
 * middle and ride a little lower — so the set reads as a considered spread
 * rather than a grid, without anything moving on its own.
 */

/** Lean of the outermost cards, in degrees. Small on purpose: the copy has to stay readable. */
const MAX_TILT = 4.5
/** How far the outermost cards drop, in px, to carry the tilt into a curve. */
const MAX_SAG = 26
/** Scroll distance each spread holds for, as a share of the pinned timeline. */
const DWELL = 1.6

/** Tilt and drop for card `i` of `n`, measured out from the centre of the row. */
function arc(i: number, n: number) {
  const t = n < 2 ? 0 : (i - (n - 1) / 2) / ((n - 1) / 2)
  return { tilt: t * MAX_TILT, sag: t * t * MAX_SAG }
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
              <div className="flex h-full flex-col justify-center pb-10">
                <div data-head className="mx-auto w-full max-w-6xl px-6 md:px-10">
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

                {/* Below the arc breakpoint the row scrolls sideways instead of
                    squeezing six cards into a phone. */}
                <div className="method-row mt-8 flex snap-x gap-3 overflow-x-auto px-6 pb-4 pt-6 sm:mt-10 sm:gap-4 md:justify-center md:overflow-visible md:px-10">
                  {stage.items.map((item, i) => {
                    const { tilt, sag } = arc(i, n)
                    return (
                      <article
                        key={item.index}
                        data-card
                        className="method-card flex flex-none snap-start flex-col rounded-2xl border border-slate-steel/25 bg-navy p-5 shadow-[0_18px_40px_-24px_rgba(15,47,94,0.7)] sm:rounded-3xl sm:p-6"
                        style={{
                          width: 'clamp(158px, 15.5vw, 202px)',
                          height: 'clamp(206px, 24vw, 272px)',
                          ['--tilt' as string]: `${tilt}deg`,
                          ['--sag' as string]: `${sag}px`,
                        }}
                      >
                        <p className="mb-4 text-[0.7rem] font-light tracking-[0.3em] text-slate-steel">
                          {item.index}
                        </p>
                        <h3
                          className="mb-3 font-medium leading-snug text-cream"
                          style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)' }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs font-light leading-relaxed text-slate-pale/85 sm:text-[0.8rem]">
                          {item.body}
                        </p>
                      </article>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Which of the three spreads is on screen. */}
      <div className="absolute inset-x-0 bottom-8 mx-auto flex w-full max-w-6xl gap-2 px-6 md:px-10">
        {METHOD_STAGES.map((stage) => (
          <div key={stage.heading} className="h-px flex-1 bg-navy/15">
            <div data-bar className="h-full origin-left bg-navy" />
          </div>
        ))}
      </div>
    </section>
  )
}
