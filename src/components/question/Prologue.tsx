import { LETTER } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

/**
 * The opening letter — section 01 of the brand profile. It is prose, so it is
 * set as prose: a narrow measure, a lede carrying more weight than the body
 * beneath it, and the closing line held apart under a rule.
 */
export function Prologue() {
  return (
    <section id="letter" className="relative border-t border-navy/15 bg-cream-dim px-6 py-20 md:px-10 md:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn y={20}>
          <p className="mb-8 text-[0.65rem] font-light uppercase tracking-[0.42em] text-navy/70 sm:text-xs">
            {LETTER.eyebrow}
          </p>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            {/* A plain heading, not the letter-by-letter reveal the rest of
                the page uses — Playfair Display leans on kerning between its
                letters, and splitting the text into one span per character
                (what the reveal does) breaks that, so it came out visibly
                different from every other serif heading on the page even
                with the same class. Serif here, not the site's default
                Kanit, to match the founder's name and the case-study
                headings. */}
            <FadeIn y={26}>
              <h2
                className="font-serif font-medium leading-[1.06] text-navy"
                style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)' }}
              >
                {LETTER.heading}
              </h2>
            </FadeIn>

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
                  <p className="max-w-2xl font-serif text-sm font-light leading-relaxed text-navy/72 sm:text-base">
                    {para}
                  </p>
                </FadeIn>
              ))}
            </div>

            <FadeIn y={20} delay={0.36}>
              <div className="mt-8 border-t border-navy/15 pt-6">
                <p className="font-serif text-sm font-light leading-relaxed text-navy/72 sm:text-base">
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
