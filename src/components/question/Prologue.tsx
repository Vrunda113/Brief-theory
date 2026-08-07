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
    <section id="letter" className="relative border-t border-navy/15 bg-cream px-6 py-20 md:px-10 md:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn y={20}>
          <p className="mb-8 text-[0.65rem] font-light uppercase tracking-[0.42em] text-navy/70 sm:text-xs">
            {LETTER.eyebrow}
          </p>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <AnimatedText
              text={LETTER.heading}
              className="font-light leading-[1.06] text-navy"
              style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)' }}
            />

            <FadeIn y={22} delay={0.1}>
              <p
                className="mt-7 max-w-md font-light leading-[1.5] text-navy/80"
                style={{ fontSize: 'clamp(1rem, 1.55vw, 1.3rem)' }}
              >
                {LETTER.lede}
              </p>
            </FadeIn>
          </div>

          <div>
            <div className="space-y-5">
              {LETTER.body.map((para, i) => (
                <FadeIn key={para.slice(0, 24)} y={20} delay={0.14 + i * 0.06}>
                  <p className="max-w-2xl text-sm font-light leading-relaxed text-navy/72 sm:text-base">
                    {para}
                  </p>
                </FadeIn>
              ))}
            </div>

            <FadeIn y={20} delay={0.36}>
              <div className="mt-8 border-t border-navy/15 pt-6">
                <p className="font-light italic leading-relaxed text-navy/72 sm:text-base">
                  {LETTER.close}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
