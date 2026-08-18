import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { CASE_STUDIES } from '../../config/caseStudies'
import type { CaseStudy, Media } from '../../config/work'
import { FadeIn } from '../shared/FadeIn'

/**
 * The cards run on a horizontal track rather than a vertical stack.
 *
 * Stacking was the wrong instrument here: Selected Work already stacks sticky
 * cards that overlap and recede, so this read as a second helping of the same
 * idea. A track also answers the other problem directly — a card is either on
 * screen or off it, never half-visible behind the one in front.
 *
 * Each card owns an equal slot of the scroll: the track travels during the
 * lead-in to a slot, then holds still for the rest of it.
 */
const LEAD_IN = 0.16

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/**
 * How far the track has travelled, in card widths — 0 to N-1. It moves only
 * during each lead-in and rests in between, so every card gets a dwell.
 */
function trackOffset(p: number, total: number) {
  let offset = 0
  for (let i = 1; i < total; i += 1) {
    offset += clamp01((p - (i / total - LEAD_IN)) / LEAD_IN)
  }
  return offset
}

/**
 * The studies, in the order the file lists them.
 *
 * This used to pick them out of the Selected Work array by matching client
 * names against a hardcoded order, and that is exactly how the section came to
 * render empty: the names were removed from that array, the lookup returned
 * nothing, and the headings stood over a blank track with the counter reading
 * 01 / 00. Nothing threw and nothing logged.
 *
 * Case Studies has its own file now, so there is no second list of names to
 * fall out of step with. Reordering the section means reordering that file.
 */
const FEATURED_CASES = CASE_STUDIES

type CaseDetail = {
  period: string
  media: Media[]
  metrics: Array<{ value: string; label: string }>
}

const CASE_DETAILS: Record<string, CaseDetail> = {
  'Super Munchies': {
    period: 'December 2024',
    media: [
      { type: 'image', src: '/images/super-munchies/01.webp' },
      { type: 'image', src: '/images/super-munchies/02.webp' },
      { type: 'image', src: '/images/super-munchies/04.webp' },
    ],
    metrics: [
      { value: '12,839', label: 'Impressions' },
      { value: '3,720', label: 'Reach' },
      { value: '3,519', label: 'Followers' },
    ],
  },
  HUFT: {
    period: 'Paid media strategy',
    media: [
      // Lowercase .jpg throughout: the originals were 4–10 MB PNGs at around
      // 2400px square, against plates that render a few hundred pixels wide.
      { type: 'image', src: '/images/huft/picture1.jpg' },
      { type: 'image', src: '/images/huft/picture3.jpg' },
      { type: 'image', src: '/images/huft/picture6.jpg' },
    ],
    metrics: [
      { value: 'Awareness', label: 'Store visits' },
      { value: 'Traffic', label: 'Website' },
      { value: 'Conversion', label: 'App + remarketing' },
    ],
  },
  'Mason Home': {
    period: '#YourSignatureSpace',
    media: [
      { type: 'image', src: '/images/mason-home/01.webp' },
      { type: 'image', src: '/images/mason-home/02.webp' },
      { type: 'image', src: '/images/mason-home/03.webp' },
    ],
    metrics: [
      { value: '297K', label: 'Instagram' },
      { value: '14K', label: 'Facebook' },
      { value: '806', label: 'YouTube' },
    ],
  },
}

export function CaseStudiesFeature() {
  const section = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  /** True on the wide layout, where the pinned track drives everything. */
  const [wide, setWide] = useState(true)
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const read = () => setWide(query.matches)
    read()
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [])

  /*
   * No spring here. Lenis already smooths the scroll for the whole page, so a
   * spring on top of it smooths a smoothed value — the transform lags the
   * scroll and never catches up before the section ends.
   *
   * Only while the pinned track is the one on show. Below it the section is
   * an ordinary block of page, so this would count studies off against plain
   * vertical scrolling while the swipe track sat on whichever card the reader
   * had actually swiped to.
   */
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!wide) return
    const nextIndex = Math.min(FEATURED_CASES.length - 1, Math.floor(value * FEATURED_CASES.length))
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex))
  })

  const handleActive = useCallback((index: number) => {
    setActiveIndex((current) => (current === index ? current : index))
  }, [])

  return (
    <section
      id="case-studies"
      ref={section}
      className="relative border-y border-navy/15 bg-cream px-6 py-20 md:px-10 md:py-24 lg:h-[300svh] lg:py-0"
    >
      <div className="mx-auto max-w-7xl lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center">
        <SectionHead activeIndex={activeIndex} />

        <CaseTrack scrollProgress={scrollYProgress} />

        <SwipeTrack activeIndex={activeIndex} onActive={handleActive} />
      </div>
    </section>
  )
}

/**
 * The studies on a touch screen: a swipe track under the thumb.
 *
 * Native overflow with scroll snapping, deliberately, rather than extending the
 * pinned track down from the wide layout. Pinning drives sideways movement from
 * vertical scroll, which on a touch screen means taking the scroll away from
 * the finger — and it needs each card to fit inside one viewport, where a study
 * measures about 1.26 screens on a 375px handset. What stood here instead was
 * the three studies simply stacked, so below 1024 there was no sideways
 * movement at all.
 *
 * Cards are bled to the screen edges and snap to centre, so the next one always
 * shows at the margin: the peek is what says this moves sideways.
 */
function SwipeTrack({
  activeIndex,
  onActive,
}: {
  activeIndex: number
  onActive: (index: number) => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const settle = useRef(0)
  /*
   * The spreads drift their plates against a progress value. Here there is no
   * scroll of their own to read, so they are held at the midpoint and sit
   * still — the movement in this layout is the swipe itself.
   */
  const neutral = useMotionValue(0.5)

  /*
   * Whichever card sits nearest the centre is the one being read. Compared in
   * viewport coordinates on both sides: `offsetLeft` is measured from the
   * nearest positioned ancestor, which is not this scroller, so pitting it
   * against `scrollLeft` compares two different origins and the answer comes
   * back as the first card no matter where the track actually sits.
   */
  const read = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const frame = el.getBoundingClientRect()
    const middle = frame.left + frame.width / 2
    let nearest = 0
    let shortest = Infinity
    Array.from(el.children).forEach((child, index) => {
      const card = child.getBoundingClientRect()
      const distance = Math.abs(card.left + card.width / 2 - middle)
      if (distance < shortest) {
        shortest = distance
        nearest = index
      }
    })
    onActive(nearest)
  }, [onActive])

  // Settled position only: reporting every frame of a flick would re-render the
  // heading several times over one swipe.
  const handleScroll = useCallback(() => {
    window.clearTimeout(settle.current)
    settle.current = window.setTimeout(read, 90)
  }, [read])

  useEffect(() => {
    read()
    return () => window.clearTimeout(settle.current)
  }, [read])

  return (
    <div className="lg:hidden">
      <div
        ref={scroller}
        onScroll={handleScroll}
        // Bled past the section's own padding so a card can reach the screen
        // edge, with the padding given back inside to keep the first card in
        // line with the heading above it.
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-6 md:-mx-10 md:px-10"
      >
        {FEATURED_CASES.map((study) => (
          <div key={study.client} className="w-[86vw] max-w-[34rem] shrink-0 snap-center">
            <CaseStudySpread study={study} scrollProgress={neutral} />
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-center gap-2" aria-hidden="true">
        {FEATURED_CASES.map((study, index) => (
          <span
            key={study.client}
            className="h-[0.3rem] rounded-full bg-navy transition-all duration-500"
            style={{
              width: index === activeIndex ? '1.1rem' : '0.3rem',
              opacity: index === activeIndex ? 0.75 : 0.25,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function SectionHead({ activeIndex }: { activeIndex: number }) {
  return (
    <FadeIn y={18}>
      <div className="mb-9 flex items-end justify-between gap-6 border-b border-navy/20 pb-7 lg:mb-5 lg:pb-5">
        <div>
          <p className="mb-4 text-[0.62rem] font-light uppercase tracking-[0.42em] text-navy/70 sm:text-[0.7rem] lg:mb-2">
            Case studies
          </p>
          <h2
            className="max-w-2xl font-serif font-medium leading-[1.04] text-navy"
            style={{ fontSize: 'clamp(2rem, 3.8vw, 3.5rem)' }}
          >
            The thinking behind <em className="font-serif italic text-slate">the work.</em>
          </h2>
        </div>
        <div className="hidden text-right md:block">
          {/* <p className="text-sm font-light leading-relaxed text-navy/72">
            Real briefs. Clear decisions. Work built from a point of view.
          </p> */}
          <p className="mt-3 text-[0.58rem] font-light uppercase tracking-[0.28em] text-navy/70">
            0{activeIndex + 1} / 0{FEATURED_CASES.length}
          </p>
        </div>
      </div>
    </FadeIn>
  )
}

/**
 * The track. The stage clips, and the flex row is exactly the stage's width
 * with each card `w-full shrink-0` inside it — so translating by 100% moves
 * precisely one card, and every other card is genuinely off-stage rather than
 * sitting behind the visible one.
 */
function CaseTrack({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const total = FEATURED_CASES.length
  const x = useTransform(scrollProgress, (p) => `${-trackOffset(p, total) * 100}%`)

  return (
    <div className="relative hidden overflow-hidden lg:block lg:h-[min(560px,62svh)] lg:min-h-[480px]">
      <motion.div style={{ x }} className="flex h-full w-full will-change-transform">
        {FEATURED_CASES.map((study, index) => (
          <CaseSlide
            key={study.client}
            study={study}
            index={index}
            total={total}
            scrollProgress={scrollProgress}
          />
        ))}
      </motion.div>
    </div>
  )
}

function CaseSlide({
  study,
  index,
  total,
  scrollProgress,
}: {
  study: CaseStudy
  index: number
  total: number
  scrollProgress: MotionValue<number>
}) {
  // Progress through this card's own time on stage, so its images drift with
  // it rather than tracking the whole section and arriving mid-drift.
  const enterFrom = index / total - LEAD_IN
  const local = useTransform(scrollProgress, (p) =>
    clamp01((p - enterFrom) / ((index + 1) / total - enterFrom)),
  )

  return (
    <div className="h-full w-full shrink-0">
      <CaseStudySpread study={study} scrollProgress={local} />
    </div>
  )
}

function CaseStudySpread({ study, scrollProgress }: { study: CaseStudy; scrollProgress: MotionValue<number> }) {
  const firstY = useTransform(scrollProgress, [0, 1], [-16, 16])
  const secondY = useTransform(scrollProgress, [0, 1], [16, -16])
  const heroY = useTransform(scrollProgress, [0, 1], ['-2.5%', '2.5%'])

  /*
   * The spread's own plates and figures are held per client. Where a study has
   * no entry, its own media carries the spread instead — reading `.media[0]`
   * straight off an undefined entry is what would throw the moment a fourth
   * study was added to the file.
   */
  const detail = CASE_DETAILS[study.client] as CaseDetail | undefined
  const plates = detail?.media?.length ? detail.media : study.media
  const first = plates[0]
  const second = plates[1] ?? plates[0]
  const hero = plates[2] ?? plates[plates.length - 1]

  return (
    <div className="grid gap-5 lg:h-full lg:grid-cols-[minmax(190px,0.32fr)_minmax(0,1fr)] lg:gap-7">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2 lg:gap-5">
        {[first, second].map((media, index) => (
          <motion.div
            key={media.src}
            style={{ y: index === 0 ? firstY : secondY }}
            /*
             * Square, because the plates are: these come from the campaign
             * sets, which measure 900x900, 1400x1400 and 1305x1610 — a median
             * ratio of 1.0. A fixed 170px floor made them squat on a phone and
             * cost about half of each frame.
             *
             * Set as a class, not inline. Inline it outranks every breakpoint,
             * so `lg:aspect-auto` could never take it back and the pair went on
             * forcing itself square inside a column that is supposed to fill
             * the row's height.
             */
            className="relative aspect-square overflow-hidden rounded-2xl border border-navy/10 bg-cream shadow-[0_14px_35px_rgba(4,46,105,0.08)] lg:aspect-auto lg:min-h-0"
          >
            {/* Deferred: this section sits several screens down, and fetched
                eagerly its plates were competing with the hero for the first
                connections the page has. */}
            <img
              src={media.type === 'video' ? media.poster ?? media.src : media.src}
              alt={`${study.client} campaign visual ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      <article className="grid min-h-[460px] overflow-hidden rounded-[1.75rem] border border-navy/10 bg-[#fffdf9] shadow-[0_18px_50px_rgba(4,46,105,0.09)] md:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] lg:h-full lg:min-h-0">
        {/* Shorter on a handset. At 280px the hero alone took a third of a
            card that already ran past the fold. */}
        <div className="relative min-h-[210px] overflow-hidden sm:min-h-[260px] md:min-h-0">
          <motion.img
            style={{ y: heroY }}
            src={hero.type === 'video' ? hero.poster ?? hero.src : hero.src}
            alt={`${study.client} campaign`}
            loading="lazy"
            decoding="async"
            className="absolute -inset-y-[4%] inset-x-0 h-[108%] w-full object-cover"
          />
        </div>

        <div className="flex min-h-0 flex-col justify-between p-6 sm:p-9 lg:p-8 xl:p-9">
          <div>
            <p className="mb-5 text-[0.58rem] font-light uppercase tracking-[0.32em] text-navy/70 lg:mb-3">
              {[study.index, study.sector, detail?.period].filter(Boolean).join(' · ')}
            </p>
            <h3 className="font-serif text-3xl font-medium leading-tight text-navy sm:text-4xl lg:text-3xl xl:text-4xl">
              {study.client}
            </h3>
            <p className="mt-4 font-serif text-lg italic leading-snug text-navy/85 sm:mt-5 sm:text-2xl lg:mt-4 lg:text-[1.35rem] xl:text-2xl">
              {study.theory}
            </p>
            <p className="mt-4 text-sm font-light leading-relaxed text-navy/75 sm:mt-6 sm:text-[0.95rem] lg:mt-4 lg:text-[0.86rem] lg:leading-[1.65] xl:text-[0.92rem]">
              {study.body}
            </p>
          </div>

          {/* Figures are reported, not decorative — shown only where real ones
              are held for that client, never invented to fill the row. */}
          {detail?.metrics?.length ? (
            <dl className="mt-6 grid grid-cols-3 border-t border-navy/15 pt-5 sm:mt-8 sm:pt-6 lg:mt-5 lg:pt-4">
              {detail.metrics.map((metric, index) => (
                <Metric key={metric.label} value={metric.value} label={metric.label} bordered={index === 1} />
              ))}
            </dl>
          ) : null}
        </div>
      </article>
    </div>
  )
}

function Metric({ value, label, bordered = false }: { value: string; label: string; bordered?: boolean }) {
  return (
    <div className={bordered ? 'border-x border-navy/15 px-4' : 'px-2 first:pl-0 last:pr-0'}>
      <dt className="font-serif text-lg text-navy sm:text-xl">{value}</dt>
      <dd className="mt-1 text-[0.52rem] font-light uppercase tracking-[0.18em] text-navy/70 sm:text-[0.58rem]">
        {label}
      </dd>
    </div>
  )
}
