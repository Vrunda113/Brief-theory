import { CASE_STUDIES } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'
import { CaseCard } from './CaseCard'

/**
 * Where thinking becomes visible, audible, usable — the fourth question,
 * answered with the work itself.
 */
export function Expression() {
  return (
    <section
      id="expression"
      className="relative z-20 scroll-mt-4 border-t border-navy/15 bg-cream px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-20"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn y={20}>
          <p className="mb-4 mt-14 text-[0.65rem] font-light uppercase tracking-[0.45em] text-navy/70 sm:text-xs md:mt-20">
            05 — The expression
          </p>
        </FadeIn>

        <FadeIn y={30} delay={0.05}>
          <h2
            className="headline-gradient-ink mb-10 font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.15rem, 5.5vw, 4.75rem)' }}
          >
            Selected work
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-6 md:gap-8">
          {CASE_STUDIES.map((study, i) => (
            <CaseCard
              key={study.index}
              study={study}
              index={i}
              total={CASE_STUDIES.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
