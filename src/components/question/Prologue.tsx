import { QUESTION_INTRO } from '../../config/copy'
import { AnimatedText } from '../shared/AnimatedText'
import { FadeIn } from '../shared/FadeIn'

/**
 * The turn into the argument: names the problem the rest of the film answers.
 */
export function Prologue() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-4xl">
        <FadeIn y={20}>
          <p className="mb-10 text-[0.65rem] font-light uppercase tracking-[0.45em] text-slate-brand sm:text-xs">
            {QUESTION_INTRO.eyebrow}
          </p>
        </FadeIn>

        <AnimatedText
          text={QUESTION_INTRO.headline}
          className="font-light leading-[1.15] text-cream"
          style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.75rem)' }}
        />

        <FadeIn y={24} delay={0.1}>
          <p
            className="mt-6 font-medium italic leading-[1.15] text-slate-steel"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.75rem)' }}
          >
            {QUESTION_INTRO.emphasis}
          </p>
        </FadeIn>

        <FadeIn y={20} delay={0.2}>
          <p className="mt-12 max-w-xl text-sm font-light leading-relaxed text-slate-steel/70 sm:text-base">
            {QUESTION_INTRO.body}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
