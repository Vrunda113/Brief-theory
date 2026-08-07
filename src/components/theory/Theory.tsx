import { CASE_LOGIC, CASE_LOGIC_LETTERS } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

/** One engagement reduced to its logic, now given room to stand on its own. */
export function Theory() {
  return (
    <section id="theory" className="relative z-20 border-t border-navy/15 bg-cream px-6 py-20 md:px-10 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(440px,1.2fr)] lg:items-start lg:gap-20">
        <div>
          <FadeIn y={20}>
            <p className="mb-5 text-[0.65rem] font-light uppercase tracking-[0.42em] text-navy/70 sm:text-xs">
              {CASE_LOGIC.eyebrow}
            </p>
          </FadeIn>

          <FadeIn y={28} delay={0.05}>
            <h2
              className="max-w-3xl font-serif font-medium leading-[1.04] text-navy"
              style={{ fontSize: 'clamp(2.15rem, 4vw, 3.65rem)' }}
            >
              From brief to <em className="font-serif italic text-slate-brand">theory.</em>
            </h2>
          </FadeIn>

          <FadeIn y={18} delay={0.1}>
            <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-navy/72 sm:text-base">
              {CASE_LOGIC.lede}
            </p>
          </FadeIn>
        </div>

        <ol className="border-t border-navy/18">
          {CASE_LOGIC.steps.map((step, index) => (
            <FadeIn key={step.index} as="li" y={20} delay={0.06 + index * 0.055}>
              <div className="group grid grid-cols-[2.5rem_1fr] gap-4 border-b border-navy/18 py-4 sm:grid-cols-[3.25rem_7.5rem_1fr] sm:items-center sm:gap-5 md:py-5">
                <span
                  data-cursor-grow
                  className={`flex h-9 w-9 items-center justify-center rounded-full border font-serif text-xs transition-colors duration-300 ${
                    step.turn
                      ? 'border-navy bg-navy text-cream'
                      : 'border-navy/30 text-navy/70 group-hover:border-navy group-hover:text-navy'
                  }`}
                >
                  {CASE_LOGIC_LETTERS[index]}
                </span>

                <p className="col-start-2 text-[0.58rem] font-light uppercase tracking-[0.25em] text-navy/70 sm:col-start-auto sm:text-[0.64rem]">
                  {step.label}
                </p>

                <p
                  className={`col-start-2 font-serif italic leading-snug sm:col-start-auto ${
                    step.turn ? 'text-navy' : 'text-navy/75'
                  }`}
                  style={{ fontSize: 'clamp(1rem, 1.65vw, 1.4rem)' }}
                >
                  {step.line}
                </p>
              </div>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  )
}
