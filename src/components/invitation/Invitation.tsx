import { BRAND, INVITATION } from '../../config/copy'
import { PALETTE } from '../../config/palette'
import { AnimatedText } from '../shared/AnimatedText'
import { FadeIn } from '../shared/FadeIn'
import { ContactButton } from '../shared/Buttons'
import { Wordmark } from '../shared/Wordmark'

export function Invitation() {
  return (
    <section id="invitation" className="relative scroll-mt-4 border-t border-navy/15 bg-cream pt-20 md:pt-24">
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-10 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-20">
          <div>
            <FadeIn y={20}>
              <p className="mb-5 text-[0.65rem] font-light uppercase tracking-[0.42em] text-navy/70 sm:text-xs">
                {INVITATION.eyebrow}
              </p>
            </FadeIn>

            <FadeIn y={26} delay={0.05}>
              <h2
                className="max-w-2xl font-black uppercase leading-[0.98] tracking-tight text-navy"
                style={{ fontSize: 'clamp(2rem, 4.1vw, 3.7rem)' }}
              >
                {INVITATION.headline}
              </h2>
            </FadeIn>

            <FadeIn y={18} delay={0.1}>
              <p className="mt-6 max-w-xl font-light leading-relaxed text-navy/72 sm:text-base">
                {INVITATION.body}
              </p>
            </FadeIn>

            <FadeIn y={18} delay={0.16}>
              <div className="mt-7">
                <ContactButton href={`mailto:${BRAND.email}`} on="cream">{INVITATION.cta}</ContactButton>
              </div>
            </FadeIn>
          </div>

          <div className="grid gap-9 border-t border-navy/15 pt-7 sm:grid-cols-2 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-1">
            <FadeIn y={18}>
              <p className="mb-4 text-[0.6rem] font-light uppercase tracking-[0.3em] text-navy/70">
                Who we work with
              </p>
              <ul className="space-y-2">
                {INVITATION.audience.map((line) => (
                  <li key={line} className="text-sm font-light text-navy/72 sm:text-base">
                    {line}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn y={18} delay={0.08}>
              <p className="mb-4 text-[0.6rem] font-light uppercase tracking-[0.3em] text-navy/70">
                Reach us
              </p>
              <ul className="space-y-2 text-sm font-light sm:text-base">
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="text-navy/72 transition-colors hover:text-navy"
                >
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-navy/72 transition-colors hover:text-navy"
                >
                  {BRAND.instagram}
                </a>
              </li>
              <li>
                <a
                  href={BRAND.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-navy/72 transition-colors hover:text-navy"
                >
                  LinkedIn
                </a>
              </li>
              <li className="text-navy/70">{BRAND.location}</li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* The last frame: their own closing line, earned by everything above it.
          A full-bleed band rather than a block inside the gutter — the page
          closes on the brand's own ground, and the colour change is the only
          boundary it needs. */}
      <div
        className="border-t px-6 py-24 text-center md:px-10 md:py-32"
        // Border set here rather than as a utility: the class form fell back to
        // the framework's default grey, which drew a light rule across the top
        // of a navy band.
        style={{ backgroundColor: PALETTE.ink, borderTopColor: `${PALETTE.paper}1F` }}
      >
        <div className="mx-auto max-w-4xl">
          {INVITATION.closing.map((line, i) => (
            <AnimatedText
              key={line}
              text={line}
              dim={0.12}
              offset={['start 0.95', 'end 0.75']}
              // The first line sets it up and the second lands it, so the
              // second is the brighter of the two — the emphasis has to survive
              // the inversion, not just the colours.
              className="font-light italic leading-tight"
              style={{
                fontSize: 'clamp(1.3rem, 3.4vw, 2.6rem)',
                color: i === 0 ? PALETTE.mist : PALETTE.paper,
              }}
            />
          ))}

          <FadeIn y={20} delay={0.2}>
            <div className="mt-7 flex justify-center">
              {/* On navy the mark carries its own cream plate rather than
                  inverting to a cream glyph — same file either way. */}
              <Wordmark className="h-14 md:h-16" />
            </div>
            <p
              className="mt-8 text-[0.6rem] font-light uppercase tracking-[0.3em]"
              // The paler blue, not the mid one: at this size and tracking the
              // mid blue came out at 3.3:1 on the navy, which is under the
              // readable floor for text this small.
              style={{ color: PALETTE.mist }}
            >
              {BRAND.tagline}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
