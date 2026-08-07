import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { FOUNDER } from '../../config/copy'
import { EASE } from '../../lib/motion'
import { FadeIn } from '../shared/FadeIn'

/**
 * Section 14 of the brand profile — the person behind the practice.
 *
 * The portrait arrives by being uncovered rather than by fading: a panel wipes
 * up off the frame while the photograph itself settles from a slight scale.
 * A fade would make it a slide transition; an uncover makes it a print being
 * revealed, which is the register the rest of the page is written in.
 *
 * Inside its frame the photograph drifts a little against the scroll. The frame
 * is fixed and clipped, so the drift reads as depth rather than as the layout
 * moving — the section stays perfectly still while the image does not.
 */
/**
 * How far the photograph drifts against the scroll, and how much it is
 * oversized to pay for it. The overscan has to exceed the drift or the frame
 * runs off the edge of the picture: 12% larger leaves 6% of slack at each edge,
 * against 4% of travel.
 */
const DRIFT = 4
const OVERSCAN = 1.12

export function Founder() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ['start end', 'end start'],
  })
  const drift = useTransform(scrollYProgress, [0, 1], [`-${DRIFT}%`, `${DRIFT}%`])

  return (
    <section
      id="founder"
      ref={root}
      className="relative border-t border-navy/15 bg-cream px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
        {/* ------------------------------------------------------- portrait */}
        <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div className="relative overflow-hidden rounded-t-[140px] rounded-b-2xl bg-cream">
            <motion.img
              src={FOUNDER.portrait}
              srcSet={`${FOUNDER.portraitSmall} 600w, ${FOUNDER.portrait} 1200w`}
              sizes="(min-width: 1024px) 42vw, (min-width: 640px) 24rem, 80vw"
              alt={`${FOUNDER.name}, ${FOUNDER.role}`}
              loading="lazy"
              width={1200}
              height={1800}
              className="h-full w-full object-cover"
              // Only the drift lives in `style`. Putting `scale` here as well
              // would fight the settle below for the same value — style wins on
              // every re-render, and the animation silently stops arriving.
              style={reduced ? undefined : { y: drift }}
              initial={reduced ? false : { scale: 1.2 }}
              whileInView={reduced ? undefined : { scale: OVERSCAN }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: EASE }}
            />

            {/* The uncover. Sits over the frame and wipes upward off it. */}
            {!reduced && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 origin-bottom bg-cream"
                initial={{ scaleY: 1 }}
                whileInView={{ scaleY: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            )}

            {/* Settles the foot of the picture into the ground it sits on. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-cream/80 to-transparent" />
          </div>
        </div>

        {/* ----------------------------------------------------------- copy */}
        <div>
          <FadeIn y={20}>
            <p className="mb-6 text-[0.65rem] font-light uppercase tracking-[0.45em] text-navy/70 sm:text-xs">
              {FOUNDER.eyebrow}
            </p>
          </FadeIn>

          <FadeIn y={26} delay={0.08}>
            <h2
              className="font-serif font-medium leading-[1.05] text-navy"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3.4rem)' }}
            >
              {FOUNDER.name}
            </h2>
          </FadeIn>

          <FadeIn y={18} delay={0.16}>
            <p className="mt-3 text-[0.62rem] font-light uppercase tracking-[0.32em] text-navy/70 sm:text-[0.72rem]">
              {FOUNDER.role}
            </p>
          </FadeIn>

          <FadeIn y={22} delay={0.24}>
            <blockquote className="mt-8 border-l border-navy/20 pl-6 sm:mt-10 sm:pl-7">
              <p
                className="font-serif italic leading-snug text-navy/85"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}
              >
                “{FOUNDER.quote}”
              </p>
            </blockquote>
          </FadeIn>

          <div className="mt-8 space-y-5 sm:mt-10">
            {FOUNDER.body.map((para, i) => (
              <FadeIn key={para.slice(0, 24)} y={20} delay={0.32 + i * 0.08}>
                <p className="max-w-xl text-sm font-light leading-relaxed text-navy/72 sm:text-base">
                  {para}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
