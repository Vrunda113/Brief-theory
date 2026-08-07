import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { TESTIMONIALS } from '../../config/copy'
import { EASE } from '../../lib/motion'
import { FadeIn } from '../shared/FadeIn'

/**
 * One quote at a time, advancing on its own clock. Navy, so it separates the
 * two cream sections it sits between — the work above and the invitation
 * below — without needing a rule to do the job.
 *
 * No hover-pause: the page settled that question for the industries arch, and
 * the answer was to let auto-motion run. Only leaving the viewport stops it,
 * which is a decoding concern rather than a reading one.
 */
const HOLD_MS = 6000

export function Testimonials() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), {
      threshold: 0.35,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!live || reduced) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % TESTIMONIALS.length)
    }, HOLD_MS)
    return () => window.clearInterval(id)
  }, [live, reduced])

  return (
    <section
      id="testimonials"
      ref={root}
      className="relative z-20 scroll-mt-4 border-t border-cream/15 bg-navy px-6 py-20 md:px-10 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <FadeIn y={20}>
          <p className="mb-5 text-center text-[0.65rem] font-light uppercase tracking-[0.42em] text-slate-steel sm:text-xs">
            07 — Client voices
          </p>
        </FadeIn>

        <FadeIn y={28} delay={0.05}>
          <h2
            className="mb-12 text-center font-serif font-medium leading-[1.04] text-cream md:mb-16"
            style={{ fontSize: 'clamp(1.9rem, 3.4vw, 3rem)' }}
          >
            What they’re saying.
          </h2>
        </FadeIn>

        {reduced ? (
          // Nothing auto-advances here — the honest fallback is all three, not
          // a carousel frozen on the first.
          <ul className="space-y-12">
            {TESTIMONIALS.map((t) => (
              <li key={t.quote} className="text-center">
                <Quote {...t} />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className="relative min-h-[230px] sm:min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0 text-center"
                >
                  <Quote {...TESTIMONIALS[active]} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-center gap-2.5 md:mt-10">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.quote}
                  type="button"
                  data-cursor-grow
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS.length}`}
                  aria-current={i === active}
                  className="p-1.5"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 ${
                      i === active ? 'w-6 bg-cream' : 'w-1.5 bg-cream/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function Quote({ quote, role, sector }: { quote: string; role: string; sector: string }) {
  return (
    <>
      <p
        className="mx-auto max-w-2xl font-serif italic leading-snug text-cream"
        style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)' }}
      >
        “{quote}”
      </p>
      <p className="mt-6 text-[0.62rem] font-light uppercase tracking-[0.28em] text-slate-steel sm:text-[0.7rem]">
        {role} · {sector}
      </p>
    </>
  )
}
