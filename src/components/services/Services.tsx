import {
  Bot,
  Compass,
  Monitor,
  PenTool,
  Play,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { PRACTICE } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  Strategy: Compass,
  Identity: PenTool,
  Digital: Monitor,
  'AI Systems': Bot,
  Growth: TrendingUp,
}

/** One Services destination: statement, film, then the five disciplines. */
export function Services() {
  return (
    <section
      id="services"
      className="relative z-20 scroll-mt-4 bg-cream px-6 py-20 md:px-10 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1480px]">
        <header className="mb-10 md:mb-12 lg:mb-14">
          <FadeIn y={20}>
            <p className="mb-5 text-[0.65rem] font-light uppercase tracking-[0.45em] text-navy/70 sm:text-xs">
              Services
            </p>
          </FadeIn>

          <FadeIn y={28} delay={0.05}>
            <h2
              className="max-w-6xl font-light leading-[1.06] tracking-tight text-navy"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.8rem)' }}
            >
              We don’t create deliverables.{' '}
              <span className="italic">We build brand systems.</span>
            </h2>
          </FadeIn>
        </header>

        <VideoPlaceholder />

        <div className="mt-10 border-t border-navy/20 md:mt-12 lg:mt-14">
          {PRACTICE.pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[pillar.name]

            return (
              <FadeIn key={pillar.name} y={20} delay={index * 0.025}>
                <article
                  tabIndex={0}
                  className="service-row group border-b border-navy/20 outline-none"
                  aria-label={`${pillar.name} services`}
                >
                  <div className="flex min-h-24 items-center gap-4 py-6 sm:min-h-28 sm:gap-6 md:py-7">
                    <p className="w-8 shrink-0 text-[0.62rem] font-light tracking-[0.25em] text-navy/40 sm:w-10 sm:text-xs">
                      {pillar.index}
                    </p>

                    <div className="service-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/25 text-navy transition-colors duration-300 sm:h-12 sm:w-12">
                      <Icon aria-hidden="true" strokeWidth={1.35} className="h-5 w-5" />
                    </div>

                    <h3
                      className="font-medium leading-none text-navy"
                      style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3.35rem)' }}
                    >
                      {pillar.name}
                    </h3>
                  </div>

                  <div className="service-reveal">
                    <div className="overflow-hidden">
                      <ul className="grid gap-x-10 pb-8 pl-12 sm:grid-cols-2 sm:pb-10 sm:pl-16 md:pl-[5.75rem]">
                        {pillar.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 border-t border-navy/10 py-3.5 text-sm font-light text-navy/70 sm:text-base"
                          >
                            <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-navy/45" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function VideoPlaceholder() {
  return (
    <div
      aria-label="Brand film placeholder"
      className="relative flex h-[50vh] min-h-[280px] w-full items-center justify-center overflow-hidden rounded-[24px] bg-navy-deep sm:rounded-[30px] lg:rounded-[36px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(108,130,162,0.28) 0%, rgba(15,47,94,0) 44%), linear-gradient(135deg, rgba(216,227,240,0.04), transparent 55%)',
        }}
      />

      <FadeIn y={14} className="relative flex flex-col items-center text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-cream/35 text-cream sm:h-20 sm:w-20">
          <Play aria-hidden="true" strokeWidth={1.25} className="ml-1 h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <p className="text-[0.6rem] font-light uppercase tracking-[0.42em] text-slate-pale/70 sm:text-xs">
          Brand film
        </p>
        <p className="mt-2 text-xs font-light text-cream/35 sm:text-sm">Video coming soon</p>
      </FadeIn>

      <p className="absolute bottom-5 left-6 text-[0.55rem] font-light uppercase tracking-[0.3em] text-cream/25 md:bottom-8 md:left-10">
        Brief Theory
      </p>
    </div>
  )
}
