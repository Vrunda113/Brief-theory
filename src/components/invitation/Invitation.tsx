import { BRAND, INVITATION } from '../../config/copy'
import { AnimatedText } from '../shared/AnimatedText'
import { FadeIn } from '../shared/FadeIn'
import { ContactButton } from '../shared/Buttons'
import { Wordmark } from '../shared/Wordmark'

export function Invitation() {
  return (
    <section id="invitation" className="relative bg-cream pt-28 md:pt-40">
      <div className="mx-auto max-w-5xl px-6 pb-20 md:px-10 md:pb-28">
        <FadeIn y={20}>
          <p className="mb-6 text-[0.65rem] font-light uppercase tracking-[0.45em] text-navy/70 sm:text-xs">
            {INVITATION.eyebrow}
          </p>
        </FadeIn>

        <FadeIn y={30} delay={0.05}>
          <h2
            className="mb-8 font-black uppercase leading-[0.95] tracking-tight text-navy"
            style={{ fontSize: 'clamp(1.8rem, 6vw, 4.75rem)' }}
          >
            {INVITATION.headline}
          </h2>
        </FadeIn>

        <FadeIn y={20} delay={0.12}>
          <p className="mb-9 max-w-xl font-light leading-relaxed text-navy/72 sm:text-lg">
            {INVITATION.body}
          </p>
        </FadeIn>

        <FadeIn y={20} delay={0.2}>
          <ContactButton href={`mailto:${BRAND.email}`} on="cream">{INVITATION.cta}</ContactButton>
        </FadeIn>

        <div className="mt-7 grid gap-7 border-t border-navy/12 pt-12 sm:grid-cols-2 md:mt-18">
          <FadeIn y={20}>
            <p className="mb-5 text-[0.6rem] font-light uppercase tracking-[0.3em] text-navy/70">
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

          <FadeIn y={20} delay={0.1} className="sm:justify-self-end sm:text-right">
            <p className="mb-5 text-[0.6rem] font-light uppercase tracking-[0.3em] text-navy/70">
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

      {/* The last frame: their own closing line, earned by everything above it.
          A full-bleed band rather than a block inside the gutter — the page
          closes on the brand's own ground, and the colour change is the only
          boundary it needs. */}
      <div className="bg-navy px-6 py-24 text-center md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          {INVITATION.closing.map((line, i) => (
            <AnimatedText
              key={line}
              text={line}
              dim={0.12}
              offset={['start 0.95', 'end 0.75']}
              className={`font-light italic leading-tight ${
                i === 0 ? 'text-slate-steel' : 'text-cream'
              }`}
              style={{ fontSize: 'clamp(1.3rem, 3.4vw, 2.6rem)' }}
            />
          ))}

          <FadeIn y={20} delay={0.2}>
            <div className="mt-7 flex justify-center">
              {/* Back on navy, so the mark carries its own cream plate. */}
              <Wordmark className="h-16 md:h-20" />
            </div>
            <p className="mt-8 text-[0.6rem] font-light uppercase tracking-[0.3em] text-slate-steel">
              {BRAND.tagline}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
