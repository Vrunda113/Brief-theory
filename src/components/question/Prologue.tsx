import { QUESTION_INTRO } from '../../config/copy'
import { AnimatedText } from '../shared/AnimatedText'
import { FadeIn } from '../shared/FadeIn'

/**
 * The turn into the argument: names the problem the rest of the film answers.
 */
export function Prologue() {
  return (
    <section className="relative px-6 py-14 md:px-10 md:py-48">
      <div className="mx-auto max-w-4xl">
        <FadeIn y={20}>
          <p className="mb-7 text-[0.65rem] font-light uppercase tracking-[0.45em] text-slate-brand sm:text-xs">
            {QUESTION_INTRO.eyebrow}
          </p>
        </FadeIn>

        <AnimatedText
          text={QUESTION_INTRO.headline}
          className="font-light leading-[1.15] text-cream"
          style={{ fontSize: 'clamp(1.4rem, 3.4vw, 2.7rem)' }}
        />

        <FadeIn y={24} delay={0.1}>
          <p
            className="mt-6 font-medium italic leading-[1.15] text-slate-steel"
            style={{ fontSize: 'clamp(1.4rem, 3.4vw, 2.7rem)' }}
          >
            {QUESTION_INTRO.emphasis}
          </p>
        </FadeIn>

        <FadeIn y={20} delay={0.2}>
          <p className="mt-9 max-w-xl text-sm font-light leading-relaxed text-slate-steel/70 sm:text-base">
            {QUESTION_INTRO.body}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
