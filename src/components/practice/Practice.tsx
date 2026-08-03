import { PRACTICE } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

/**
 * The light panel — the film's one change of stock. Everything before and after
 * is navy, so this reads as a deliberate cut to the practical.
 */
export function Practice() {
  return (
    <section
      id="practice"
      className="relative z-10 rounded-t-[40px] bg-cream px-6 py-24 sm:rounded-t-[50px] md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn y={20}>
          <p className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.45em] text-navy/50 sm:text-xs">
            Where strategy becomes tangible
          </p>
        </FadeIn>

        <FadeIn y={30} delay={0.05}>
          <h2
            className="mb-6 font-black uppercase leading-none tracking-tight text-navy"
            style={{ fontSize: 'clamp(2.75rem, 12vw, 10rem)' }}
          >
            {PRACTICE.headline}
          </h2>
        </FadeIn>

        <FadeIn y={20} delay={0.12}>
          <p
            className="mb-16 max-w-2xl font-light italic leading-snug text-navy/70 md:mb-24"
            style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.8rem)' }}
          >
            {PRACTICE.lede}
          </p>
        </FadeIn>

        <div>
          {PRACTICE.pillars.map((pillar, i) => (
            <FadeIn
              key={pillar.index}
              y={30}
              delay={i * 0.1}
              className="group flex flex-col gap-4 border-t border-navy/15 py-8 sm:flex-row sm:gap-10 sm:py-10 md:py-12"
            >
              <p
                className="shrink-0 font-black leading-none text-navy transition-opacity duration-500 group-hover:opacity-40"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
              >
                {pillar.index}
              </p>

              <div className="flex-1 pt-1 sm:pt-3">
                <h3
                  className="mb-3 font-medium uppercase tracking-wide text-navy"
                  style={{ fontSize: 'clamp(1.05rem, 2.2vw, 2.1rem)' }}
                >
                  {pillar.name}
                </h3>
                <p
                  className="mb-5 max-w-2xl font-light leading-relaxed text-navy/60"
                  style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)' }}
                >
                  {pillar.body}
                </p>
                <ul className="flex flex-wrap gap-x-3 gap-y-2">
                  {pillar.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-navy/20 px-3 py-1 text-[0.6rem] font-light uppercase tracking-[0.15em] text-navy/60 sm:text-[0.7rem]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
