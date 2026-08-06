import { LETTER } from '../../config/copy'
import { AnimatedText } from '../shared/AnimatedText'
import { FadeIn } from '../shared/FadeIn'

/**
 * The opening letter — section 01 of the brand profile. It is prose, so it is
 * set as prose: a narrow measure, a lede carrying more weight than the body
 * beneath it, and the closing line held apart under a rule.
 */
export function Prologue() {
  return (
    <section id="letter" className="relative bg-navy px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-3xl">
        <FadeIn y={20}>
          <p className="mb-7 text-[0.65rem] font-light uppercase tracking-[0.45em] text-slate-steel sm:text-xs">
            {LETTER.eyebrow}
          </p>
        </FadeIn>

        <AnimatedText
          text={LETTER.heading}
          className="font-light leading-[1.08] text-cream"
          style={{ fontSize: 'clamp(2.1rem, 6vw, 4.4rem)' }}
        />

        <FadeIn y={22} delay={0.1}>
          <p
            className="mt-9 font-light leading-[1.5] text-slate-pale"
            style={{ fontSize: 'clamp(1.05rem, 2.1vw, 1.55rem)' }}
          >
            {LETTER.lede}
          </p>
        </FadeIn>

        <div className="mt-7 space-y-5 sm:mt-9 sm:space-y-6">
          {LETTER.body.map((para, i) => (
            <FadeIn key={para.slice(0, 24)} y={20} delay={0.16 + i * 0.06}>
              <p className="text-sm font-light leading-relaxed text-slate-steel/85 sm:text-base">
                {para}
              </p>
            </FadeIn>
          ))}
        </div>

        <FadeIn y={20} delay={0.4}>
          <div className="mt-10 border-t border-slate-steel/25 pt-6 sm:mt-12 sm:pt-7">
            <p className="font-light italic leading-relaxed text-slate-steel/85 sm:text-lg">
              {LETTER.close}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
