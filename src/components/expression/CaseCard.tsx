import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { CaseStudy } from '../../config/work'
import { CinematicVideo } from '../shared/CinematicVideo'
import { GhostButton } from '../shared/Buttons'

type CaseCardProps = {
  study: CaseStudy
  index: number
  total: number
}

export function CaseCard({ study, index, total }: CaseCardProps) {
  /** Phones only: the body is folded to three lines until it is asked for. */
  const [expanded, setExpanded] = useState(false)
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
      {/*
        A column with ordered parts, so the work can come before the writing on
        a phone and after it from medium up. Spacing is carried by the gap
        rather than by margins on the children — with the order swapping, a
        margin-bottom belongs to whichever block happens to be last.
      */}
      <motion.article
        style={{ scale }}
        className="relative flex flex-col gap-6 overflow-hidden rounded-[32px] border border-cream/20 bg-navy-deep p-5 sm:rounded-[44px] sm:p-7 md:gap-9 md:rounded-[52px] md:p-9"
      >
        {/* Wrapping is a medium-and-up behaviour now. On a phone there was
            never room for the link beside the client name, so it dropped to a
            line of its own and read as something left over rather than placed.
            Below that width the header is a column and the link sits under the
            name on purpose. */}
        <header className="order-1 flex flex-col items-start gap-4 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-5">
          <div className="flex items-start gap-4 md:gap-8">
            <p
              aria-hidden="true"
              className="font-black leading-none text-cream/15"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 4.25rem)' }}
            >
              {study.index}
            </p>
            <div className="pt-0.5 md:pt-3">
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

        {/* Third on a phone, second from medium up: the work leads on a small
            screen, where there is only room to look at one thing first. */}
        <div className="order-3 grid gap-4 md:order-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-7">
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
          {/* Folded to three lines on a phone rather than cut.
              These cards stack sticky, so one taller than the screen is covered
              by the next before it can be read — the card was 971px against an
              896px handset. Folding keeps it well inside that, and opening it
              is the reader's call. */}
          <div className="self-end">
            <p
              className={`max-w-2xl text-sm font-light leading-relaxed text-cream/60 sm:line-clamp-none sm:text-base ${
                expanded ? 'line-clamp-none' : 'line-clamp-3'
              }`}
            >
              {study.body}
            </p>

            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              className="mt-3 text-[0.58rem] font-light uppercase tracking-[0.28em] text-slate-steel underline underline-offset-4 transition-colors duration-300 hover:text-cream sm:hidden"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          </div>
        </div>

        <div className="order-2 md:order-3">
          <MediaStrip study={study} />
        </div>
      </motion.article>
    </div>
  )
}

/**
 * Reels play at their native 9:16 — the format the work was made for.
 *
 * The strip is five columns, so it takes the first five whatever the set
 * holds: a sixth would drop to a row of its own and read as an accident.
 *
 * Four of them on a phone, in one row rather than two. At two columns the tiles
 * came out 156x277 and the strip stood 554px tall — more than half a card that
 * was already 971px against an 896px screen, so the sticky stack slid the next
 * card over the top before this one had been read. Narrower tiles at the same
 * ratio show more of the work for less of the card: four across cost less
 * height than three, because the height follows the width.
 */
const STRIP = 5
const STRIP_NARROW = 4

function MediaStrip({ study }: { study: CaseStudy }) {
  return (
    /*
     * Two across on a phone and five from the medium width, with nothing in
     * between. At three columns the strip showed three of five tiles, which
     * left a row of two and a row of one — the odd tile read as a mistake
     * rather than as an edit.
     */
    <div className="grid grid-cols-4 gap-2 md:grid-cols-5 md:gap-3">
      {study.media.slice(0, STRIP).map((item, i) => (
        <div
          key={item.src}
          /*
           * Shaped by ratio, not by a fixed height.
           *
           * The height used to be clamped, and on a phone it bottomed out at
           * 140px inside a tile ~170px wide — a landscape box holding a 9:16
           * reel, so `object-cover` threw away most of the frame and left a
           * band across the middle. The footage is 720x1280; giving the tile
           * that same ratio means nothing is cropped at any width.
           */
          className={`relative aspect-[9/16] overflow-hidden rounded-xl bg-navy sm:rounded-2xl md:rounded-3xl ${
            i >= STRIP_NARROW ? 'hidden md:block' : ''
          }`}
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
