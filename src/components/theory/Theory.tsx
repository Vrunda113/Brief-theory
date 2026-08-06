import { CASE_LOGIC, CASE_LOGIC_LETTERS } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

/** One engagement reduced to its logic, now given room to stand on its own. */
export function Theory() {
  return (
    <section id="theory" className="relative z-20 bg-navy-deep px-6 py-24 md:px-10 md:py-32 lg:py-36">
      <div className="mx-auto grid max-w-[1480px] gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(440px,1fr)] lg:gap-24">
        <div>
          <FadeIn y={20}>
            <p className="mb-5 text-[0.65rem] font-light uppercase tracking-[0.42em] text-slate-steel sm:text-xs">
              {CASE_LOGIC.eyebrow}
            </p>
          </FadeIn>

          <FadeIn y={28} delay={0.05}>
            <h2
              className="max-w-3xl font-serif font-medium leading-[1.02] text-cream"
              style={{ fontSize: 'clamp(2.6rem, 6.5vw, 6.2rem)' }}
            >
              From brief to <em className="font-serif italic text-slate-pale">theory.</em>
            </h2>
          </FadeIn>

          <FadeIn y={18} delay={0.1}>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-slate-steel/85 sm:text-base">
              {CASE_LOGIC.lede}
            </p>
          </FadeIn>
        </div>

        <ol className="border-t border-cream/20">
          {CASE_LOGIC.steps.map((step, index) => (
            <FadeIn key={step.index} as="li" y={20} delay={0.06 + index * 0.055}>
              <div className="group grid grid-cols-[2.5rem_1fr] gap-4 border-b border-cream/20 py-6 sm:grid-cols-[3.25rem_8rem_1fr] sm:items-center sm:gap-6 md:py-7">
                <span
                  data-cursor-grow
                  className={`flex h-9 w-9 items-center justify-center rounded-full border font-serif text-xs transition-colors duration-300 ${
                    step.turn
                      ? 'border-cream bg-cream text-navy-deep'
                      : 'border-slate-steel/45 text-slate-pale group-hover:border-cream group-hover:text-cream'
                  }`}
                >
                  {CASE_LOGIC_LETTERS[index]}
                </span>

                <p className="col-start-2 text-[0.58rem] font-light uppercase tracking-[0.25em] text-slate-steel sm:col-start-auto sm:text-[0.64rem]">
                  {step.label}
                </p>

                <p
                  className={`col-start-2 font-serif italic leading-snug sm:col-start-auto ${
                    step.turn ? 'text-cream' : 'text-slate-pale/90'
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
