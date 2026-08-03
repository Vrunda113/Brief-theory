import { useLayoutEffect, useRef } from 'react'
import { BELIEFS } from '../../config/copy'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import { FadeIn } from '../shared/FadeIn'

/**
 * Six beliefs, held one at a time. The agency's own line is "depth creates
 * distinction, not volume" — so these are deliberately not a grid you can skim.
 * Each one occupies the screen alone until you've scrolled past it.
 */
export function Beliefs() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-belief]')

      gsap.set(items, { autoAlpha: 0, y: 60 })
      gsap.set(items[0], { autoAlpha: 1, y: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${items.length * 80}%`,
          pin: true,
          scrub: 0.7,
          // Derived from the same progress that drives the cards, so the
          // readout can never disagree with the belief on screen.
          onUpdate: (self) => {
            const active = Math.min(
              items.length,
              Math.floor(self.progress * items.length) + 1,
            )
            // Queried per tick: a reference captured at setup goes stale when
            // React remounts the tree.
            const el = root.current?.querySelector('[data-counter]')
            if (el) el.textContent = String(active).padStart(2, '0')
          },
        },
      })

      items.forEach((item, i) => {
        if (i === 0) return
        timeline
          .to(items[i - 1], { autoAlpha: 0, y: -60, filter: 'blur(6px)', duration: 0.45 })
          .fromTo(
            item,
            { autoAlpha: 0, y: 60, filter: 'blur(6px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.45 },
            '<0.2',
          )
          .to({}, { duration: 0.3 })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="context"
      ref={root}
      data-sequence
      className="relative h-svh overflow-hidden"
    >
      <div className="absolute inset-0 bg-navy-deep" />

      <div className="relative z-10 flex h-full flex-col px-6 py-16 md:px-10 md:py-20">
        <FadeIn y={0} className="flex items-baseline justify-between">
          <p className="text-[0.65rem] font-light uppercase tracking-[0.45em] text-slate-brand sm:text-xs">
            Six things we hold to
          </p>
          <p className="text-xs font-light tabular-nums tracking-[0.2em] text-slate-brand sm:text-sm">
            <span data-counter className="text-cream">
              01
            </span>
            <span className="opacity-50"> / {String(BELIEFS.length).padStart(2, '0')}</span>
          </p>
        </FadeIn>

        <div data-sequence-track className="relative flex-1">
          {BELIEFS.map((belief) => (
            <div
              key={belief.index}
              data-belief
              className="absolute inset-0 flex flex-col justify-center"
            >
              <p
                className="mb-8 font-black leading-none text-cream/10"
                style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}
              >
                {belief.index}
              </p>
              <h3
                className="mb-6 max-w-4xl font-black uppercase leading-[0.95] tracking-tight text-cream"
                style={{ fontSize: 'clamp(2rem, 6.5vw, 5.5rem)' }}
              >
                {belief.title}
              </h3>
              <p
                className="max-w-xl font-light leading-relaxed text-slate-steel"
                style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.4rem)' }}
              >
                {belief.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
