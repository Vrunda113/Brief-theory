import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { CaseStudy } from '../../config/copy'
import { CinematicVideo } from '../shared/CinematicVideo'
import { GhostButton } from '../shared/Buttons'

type CaseCardProps = {
  study: CaseStudy
  index: number
  total: number
}

export function CaseCard({ study, index, total }: CaseCardProps) {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  })

  // Cards further down the stack finish slightly smaller, so the pile reads as
  // depth rather than a flat overlap.
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  return (
    // Each card parks a little lower than the one before it, so the finished
    // stack shows its own edges instead of a single flat card.
    <div
      ref={container}
      className="sticky"
      style={{ top: `calc(4.5rem + ${index * 26}px)` }}
    >
      <motion.article
        style={{ scale }}
        className="relative overflow-hidden rounded-[32px] border border-cream/20 bg-navy-deep p-5 sm:rounded-[44px] sm:p-7 md:rounded-[52px] md:p-9"
      >
        <header className="mb-7 flex flex-wrap items-start justify-between gap-5 md:mb-9">
          <div className="flex items-start gap-5 md:gap-8">
            <p
              aria-hidden="true"
              className="font-black leading-none text-cream/15"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.25rem)' }}
            >
              {study.index}
            </p>
            <div className="pt-1 md:pt-3">
              <p className="mb-2 text-[0.6rem] font-light uppercase tracking-[0.3em] text-slate-steel sm:text-[0.7rem]">
                {study.category} · {study.sector}
              </p>
              <h3
                className="font-medium uppercase leading-tight tracking-wide text-cream"
                style={{ fontSize: 'clamp(1rem, 2.1vw, 1.7rem)' }}
              >
                {study.client}
              </h3>
            </div>
          </div>

          {study.live && (
            <GhostButton href={study.live}>Live work</GhostButton>
          )}
        </header>

        <div className="mb-7 grid gap-6 md:mb-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-7">
          <div>
            <p className="mb-2 text-[0.6rem] font-light uppercase tracking-[0.3em] text-slate-steel sm:text-[0.7rem]">
              The theory
            </p>
            <p
              className="mb-5 font-light italic leading-snug text-slate-steel"
              style={{ fontSize: 'clamp(1rem, 2.1vw, 1.55rem)' }}
            >
              {study.theory}
            </p>
          </div>
          <p className="max-w-2xl self-end text-sm font-light leading-relaxed text-cream/60 sm:text-base">
            {study.body}
          </p>
        </div>

        <MediaStrip study={study} />
      </motion.article>
    </div>
  )
}

/**
 * Reels play at their native 9:16 — the format the work was made for.
 *
 * The strip is five columns, so it takes the first five whatever the set
 * holds: a sixth would drop to a row of its own and read as an accident.
 */
const STRIP = 5

function MediaStrip({ study }: { study: CaseStudy }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {study.media.slice(0, STRIP).map((item, i) => (
        <div
          key={item.src}
          className={`relative overflow-hidden rounded-2xl bg-navy sm:rounded-3xl ${
            i > 2 ? 'hidden md:block' : ''
          }`}
          style={{ height: 'clamp(140px, 17vw, 232px)' }}
        >
          {item.type === 'video' ? (
            <CinematicVideo
              src={item.src}
              poster={item.poster}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={item.src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  )
}
