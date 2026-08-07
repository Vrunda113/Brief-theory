import { Bot, Compass, Monitor, PenTool, Play, TrendingUp, type LucideIcon } from 'lucide-react'
import { PRACTICE } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

/**
 * Section 03 — the service offer, from page 8 of the brand profile.
 *
 * It used to be three full-bleed bands stacked on three different grounds:
 * a pale-blue header, a navy film strip, then pale-blue accordion rows. Each
 * band read as its own section, which is why the section as a whole read as
 * unrelated pieces. It is now one ground with the film and the disciplines
 * side by side — a single object rather than a stack of them.
 */
const PILLAR_ICONS: Record<string, LucideIcon> = {
  Strategy: Compass,
  Identity: PenTool,
  Digital: Monitor,
  'AI Systems': Bot,
  Growth: TrendingUp,
}

export function Services() {
  return (
    <section
      id="services"
      className="relative z-20 scroll-mt-4 border-t border-navy/15 bg-cream px-6 py-20 md:px-10 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 md:mb-16">
          <FadeIn y={20}>
            <p className="mb-5 text-[0.65rem] font-light uppercase tracking-[0.42em] text-navy/70 sm:text-xs">
              03 — Where strategy becomes tangible
            </p>
          </FadeIn>

          <FadeIn y={28} delay={0.05}>
            <h2
              className="max-w-3xl font-serif font-medium leading-[1.04] text-navy"
              style={{ fontSize: 'clamp(2.15rem, 4vw, 3.65rem)' }}
            >
              We don’t create deliverables.{' '}
              <em className="font-serif italic text-slate-brand">We build brand systems.</em>
            </h2>
          </FadeIn>
        </header>

        {/* Film and disciplines side by side from tablet up. The film takes its
            whole column rather than sitting in a capped box inside it. */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.46fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
          <FadeIn y={24} delay={0.1} className="flex md:sticky md:top-24 md:self-start">
            <FilmFrame />
          </FadeIn>

          <div className="border-t border-navy/20">
            {PRACTICE.pillars.map((pillar, index) => {
              const Icon = PILLAR_ICONS[pillar.name]

              return (
                <FadeIn key={pillar.name} y={20} delay={0.12 + index * 0.05}>
                  <article className="border-b border-navy/20 py-6 md:py-7">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <p className="w-7 shrink-0 text-[0.6rem] font-light tracking-[0.25em] text-navy/70 sm:text-xs">
                        {pillar.index}
                      </p>

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy/25 text-navy sm:h-11 sm:w-11">
                        <Icon aria-hidden="true" strokeWidth={1.35} className="h-[1.05rem] w-[1.05rem]" />
                      </span>

                      <h3
                        className="font-medium leading-none text-navy"
                        style={{ fontSize: 'clamp(1.2rem, 2vw, 1.75rem)' }}
                      >
                        {pillar.name}
                      </h3>
                    </div>

                    {/* Everything visible rather than behind a disclosure: this
                        is the offer, and a reader should not have to open five
                        rows to find out what is on it. */}
                    <ul className="mt-4 grid gap-x-8 gap-y-1.5 pl-[3.6rem] sm:grid-cols-2 sm:pl-[3.9rem]">
                      {pillar.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-2.5 text-[0.82rem] font-light leading-relaxed text-navy/72 sm:text-[0.9rem]"
                        >
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 shrink-0 translate-y-[-0.15em] rounded-full bg-navy/40"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Placeholder until real footage lands — marked as one, not dressed up. */
function FilmFrame() {
  return (
    <div
      aria-label="Brand film placeholder"
      className="relative flex w-full flex-1 items-center justify-center overflow-hidden rounded-[26px] bg-navy-deep"
      style={{ aspectRatio: '4 / 5', minHeight: '300px' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(107,129,160,0.30) 0%, rgba(14,47,91,0) 55%)',
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-cream/35 text-cream sm:h-[4.5rem] sm:w-[4.5rem]">
          <Play aria-hidden="true" strokeWidth={1.25} className="ml-1 h-5 w-5" />
        </span>
        <p className="text-[0.6rem] font-light uppercase tracking-[0.4em] text-slate-pale sm:text-[0.65rem]">
          Brand film
        </p>
        <p className="mt-2 text-xs font-light text-slate-steel/80">Video coming soon</p>
      </div>
    </div>
  )
}
