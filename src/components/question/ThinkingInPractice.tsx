import { useLayoutEffect, useRef } from 'react'
import { BACKGROUND_PLATES, CASE_LOGIC } from '../../config/copy'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import { CinematicVideo } from '../shared/CinematicVideo'

/**
 * One engagement, reduced to its logic, delivered a line at a time against a
 * held frame. Pinning is what makes this read as a cut rather than a scroll:
 * the viewer stops travelling and the argument advances around them.
 */
export function ThinkingInPractice() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]')
      const bars = gsap.utils.toArray<HTMLElement>('[data-bar]')

      gsap.set(steps, { autoAlpha: 0, y: 40 })
      gsap.set(steps[0], { autoAlpha: 1, y: 0 })
      gsap.set(bars[0], { scaleX: 1 })
      gsap.set(bars.slice(1), { scaleX: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${steps.length * 90}%`,
          pin: true,
          scrub: 0.8,
        },
      })

      steps.forEach((step, i) => {
        if (i === 0) return
        timeline
          .to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.4 })
          .to(bars[i - 1], { scaleX: 0.25, duration: 0.4 }, '<')
          .to(step, { autoAlpha: 1, y: 0, duration: 0.4 }, '<0.15')
          .to(bars[i], { scaleX: 1, duration: 0.4 }, '<')
          .to({}, { duration: 0.35 })
      })

      // Slow push on the plate so the held frame still breathes.
      gsap.to('[data-plate]', {
        scale: 1.14,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${steps.length * 90}%`,
          scrub: true,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="thinking"
      ref={root}
      data-sequence
      className="relative h-svh overflow-hidden bg-cream"
    >
      <div data-plate className="absolute inset-0" style={{ willChange: 'transform' }}>
        <CinematicVideo
          src={BACKGROUND_PLATES.wide.src}
          poster={BACKGROUND_PLATES.wide.poster}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Wash the footage up into cream, leaving enough of the frame visible to
          read as film rather than texture. This is the opposite operation to
          the navy sections: there the plate is multiplied down into the dark,
          here it has to be lifted into the light so navy type can sit on it —
          which needs more coverage, since ink on a busy mid-tone is far less
          forgiving than light type on a dark one. */}
      <div className="absolute inset-0 bg-cream/70" />
      <div className="absolute inset-0 bg-cream/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-cream/70" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-10">
        <div className="mx-auto w-full max-w-5xl">
          <p className="mb-3 text-[0.65rem] font-light uppercase tracking-[0.45em] text-navy/75 sm:text-xs">
            {CASE_LOGIC.eyebrow}
          </p>
          <h2
            className="headline-gradient-ink mb-2 font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3.4rem)' }}
          >
            {CASE_LOGIC.heading}
          </h2>
          <p className="mb-9 text-xs font-light italic text-navy/70 sm:text-sm">
            {CASE_LOGIC.lede}
          </p>

          <div
            data-sequence-track
            className="relative min-h-[220px] sm:min-h-[250px] md:min-h-[280px]"
          >
            {CASE_LOGIC.steps.map((step) => (
              <div key={step.index} data-step className="absolute inset-0">
                <p className="mb-4 text-xs font-light uppercase tracking-[0.3em] text-navy/75 sm:text-sm">
                  {step.label}
                </p>
                <p
                  className={`max-w-3xl leading-tight ${
                    step.turn
                      ? 'headline-gradient-ink font-black uppercase tracking-tight'
                      : 'font-light text-navy'
                  }`}
                  style={{
                    fontSize: step.turn
                      ? 'clamp(1.6rem, 5vw, 3.8rem)'
                      : 'clamp(1.3rem, 3.6vw, 2.7rem)',
                  }}
                >
                  {step.line}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Same chrome, in the same place, as the other pinned sequence. */}
      <div className="absolute inset-x-0 bottom-8 z-10 px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-5xl gap-2">
          {CASE_LOGIC.steps.map((step) => (
            <div key={step.index} className="h-px flex-1 bg-navy/15">
              <div data-bar className="h-full origin-left bg-navy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
