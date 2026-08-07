import { Bot, Compass, Monitor, PenTool, TrendingUp, type LucideIcon } from 'lucide-react'
import { PRACTICE } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

/** Section 03 — the service offer, presented as one horizontal practice atlas. */
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
      className="relative z-20 scroll-mt-4 border-t border-navy/15 bg-cream-dim px-6 py-20 md:px-10 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
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

        <FadeIn y={24} delay={0.1}>
          <div className="overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid min-w-max auto-cols-[minmax(270px,78vw)] grid-flow-col border-y border-navy/20 lg:min-w-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-5">
              {PRACTICE.pillars.map((pillar, index) => {
                const Icon = PILLAR_ICONS[pillar.name]

                return (
                  <article
                    key={pillar.name}
                    className={`group relative min-h-[360px] overflow-hidden px-6 py-7 transition-colors duration-500 hover:bg-navy/[0.035] focus-within:bg-navy/[0.035] lg:min-h-[390px] lg:px-5 xl:px-7 ${
                      index > 0 ? 'border-l border-navy/20' : ''
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-navy transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <p className="font-serif text-[2.7rem] font-medium leading-none text-navy/16 transition-colors duration-500 group-hover:text-navy/30">
                        {pillar.index}
                      </p>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/25 text-navy transition-all duration-500 group-hover:border-navy group-hover:bg-navy group-hover:text-cream">
                        <Icon aria-hidden="true" strokeWidth={1.35} className="h-[1.05rem] w-[1.05rem]" />
                      </span>
                    </div>

                    <h3
                      className="mt-12 font-medium leading-none text-navy lg:mt-14"
                      style={{ fontSize: 'clamp(1.25rem, 1.65vw, 1.7rem)' }}
                    >
                      {pillar.name}
                    </h3>

                    <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2.5">
                      {pillar.items.map((item, itemIndex) => (
                        <span key={item} className="contents">
                          <span className="whitespace-nowrap text-[0.78rem] font-light leading-relaxed text-navy/72 xl:text-[0.84rem]">
                            {item}
                          </span>
                          {itemIndex < pillar.items.length - 1 && (
                            <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-navy/30" />
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="absolute inset-x-6 bottom-7 flex items-center gap-3 lg:inset-x-5 xl:inset-x-7">
                      <span className="h-px flex-1 bg-navy/15 transition-colors duration-500 group-hover:bg-navy/35" />
                      <span className="text-[0.52rem] font-light uppercase tracking-[0.28em] text-navy/40">
                        {pillar.index} / 05
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
