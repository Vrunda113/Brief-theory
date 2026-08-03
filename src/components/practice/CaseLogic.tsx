import { CASE_LOGIC } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

/**
 * One engagement reduced to its logic — the clearest demonstration of the
 * method, shown before the disciplines that deliver it. This is the same brief
 * the film opened on, now answered.
 */
export function CaseLogic() {
  return (
    <section className="relative bg-navy px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-5xl">
        <FadeIn y={20}>
          <p className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.45em] text-slate-brand sm:text-xs">
            Thinking in practice
          </p>
        </FadeIn>

        <FadeIn y={30} delay={0.05}>
          <h2
            className="headline-gradient mb-16 font-black uppercase leading-none tracking-tight md:mb-24"
            style={{ fontSize: 'clamp(2.25rem, 7vw, 5.5rem)' }}
          >
            From brief to theory
          </h2>
        </FadeIn>

        <div>
          {CASE_LOGIC.map((row, i) => (
            <FadeIn
              key={row.label}
              y={24}
              delay={i * 0.08}
              className="grid grid-cols-1 gap-2 border-t border-cream/10 py-6 sm:grid-cols-[minmax(0,180px)_1fr] sm:gap-8 sm:py-8"
            >
              <p className="pt-1 text-[0.6rem] font-light uppercase tracking-[0.3em] text-slate-brand sm:text-[0.7rem]">
                {row.label}
              </p>
              <p
                className={`font-light leading-snug ${
                  row.accent ? 'text-slate-steel' : 'text-cream'
                }`}
                style={{ fontSize: 'clamp(1.1rem, 2.6vw, 2rem)' }}
              >
                {row.value}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
