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
      className="relative z-20 bg-navy px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* The rule and the chapter number are the whole boundary here: the
            section above is navy too, so without them the work simply runs on
            from the argument that precedes it. */}
        <div className="h-px w-full bg-cream/15" />

        <FadeIn y={20}>
          <p className="mb-4 mt-14 text-[0.65rem] font-light uppercase tracking-[0.45em] text-slate-brand sm:text-xs md:mt-20">
            05 — The expression
          </p>
        </FadeIn>

        <FadeIn y={30} delay={0.05}>
          <h2
            className="headline-gradient mb-11 font-black uppercase leading-none tracking-tight md:mb-11"
            style={{ fontSize: 'clamp(2.1rem, 8.5vw, 6.5rem)' }}
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
