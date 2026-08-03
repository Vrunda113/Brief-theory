import { useLayoutEffect, useRef } from 'react'
import { BACKGROUND_PLATES, QUESTIONS } from '../../config/copy'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import { CinematicVideo } from '../shared/CinematicVideo'

/**
 * The four questions beneath every engagement, delivered one at a time against
 * a held frame. Pinning is what makes this read as a cut rather than a scroll:
 * the viewer stops travelling and the content changes around them.
 */
export function QuestionSequence() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-question]')
      const bars = gsap.utils.toArray<HTMLElement>('[data-bar]')

      gsap.set(cards, { autoAlpha: 0, y: 40 })
      gsap.set(cards[0], { autoAlpha: 1, y: 0 })
      gsap.set(bars[0], { scaleX: 1 })
      gsap.set(bars.slice(1), { scaleX: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${cards.length * 90}%`,
          pin: true,
          scrub: 0.8,
        },
      })

      cards.forEach((card, i) => {
        if (i === 0) return
        timeline
          .to(cards[i - 1], { autoAlpha: 0, y: -40, duration: 0.4 })
          .to(bars[i - 1], { scaleX: 0.25, duration: 0.4 }, '<')
          .to(card, { autoAlpha: 1, y: 0, duration: 0.4 }, '<0.15')
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
          end: `+=${cards.length * 90}%`,
          scrub: true,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="question"
      ref={root}
      data-sequence
      className="relative h-svh overflow-hidden"
    >
      <div data-plate className="absolute inset-0" style={{ willChange: 'transform' }}>
        <CinematicVideo
          src={BACKGROUND_PLATES.wide.src}
          poster={BACKGROUND_PLATES.wide.poster}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Sink the footage into brand navy while leaving enough of the frame
          visible to read as film rather than texture. */}
      <div className="absolute inset-0 bg-navy/55 mix-blend-multiply" />
      <div className="absolute inset-0 bg-navy/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/70" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-10">
        <div className="mx-auto w-full max-w-5xl">
          <p className="mb-7 text-[0.65rem] font-light uppercase tracking-[0.45em] text-slate-brand sm:text-xs">
            Four questions sit beneath every engagement
          </p>

          <div
            data-sequence-track
            className="relative min-h-[280px] sm:min-h-[320px] md:min-h-[360px]"
          >
            {QUESTIONS.map((q) => (
              <div key={q.index} data-question className="absolute inset-0">
                <p className="mb-5 text-xs font-light tracking-[0.3em] text-slate-brand sm:text-sm">
                  {q.index}
                </p>
                <h3
                  className="headline-gradient mb-6 font-black uppercase leading-none tracking-tight"
                  style={{ fontSize: 'clamp(1.9rem, 6vw, 4.75rem)' }}
                >
                  {q.title}
                </h3>
                <p
                  className="max-w-2xl font-light leading-snug text-cream"
                  style={{ fontSize: 'clamp(0.95rem, 1.95vw, 1.45rem)' }}
                >
                  {q.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex gap-2">
            {QUESTIONS.map((q) => (
              <div key={q.index} className="h-px flex-1 bg-cream/15">
                <div data-bar className="h-full origin-left bg-cream" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
