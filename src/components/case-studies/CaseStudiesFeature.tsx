import { useRef, useState } from 'react'
import {
  motion,
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
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  })

  /*
   * No spring here. Lenis already smooths the scroll for the whole page, so a
   * spring on top of it smooths a smoothed value — the transform lags the
   * scroll and never catches up before the section ends.
   */
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const nextIndex = Math.min(FEATURED_CASES.length - 1, Math.floor(value * FEATURED_CASES.length))
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex))
  })

  return (
    <section
      id="case-studies"
      ref={section}
      // Three screens of scroll at every width now, not only the wide one.
      // Below it the section used to be an ordinary block and the studies
      // simply sat there, so the one thing this section is built to do — turn
      // the cards over as you scroll — was the one thing a phone never got.
      className="relative h-[300svh] border-y border-navy/15 bg-cream px-6 md:px-10"
    >
      <div className="sticky top-0 mx-auto flex h-svh max-w-7xl flex-col justify-center">
        <SectionHead activeIndex={activeIndex} />

        <CaseTrack scrollProgress={scrollYProgress} />

        <ProgressDots activeIndex={activeIndex} />
      </div>
    </section>
  )
}

/**
 * Which study is on stage, for the narrow layout where the counter is hidden.
 *
 * Indicative only — the track is turned by scrolling, so there is nothing to
 * tap. It exists because on a phone the running count in the heading is not
 * shown, and without it there is no sign that two more studies follow.
 */
function ProgressDots({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="mt-6 flex shrink-0 items-center justify-center gap-2 md:hidden" aria-hidden="true">
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
          {/*
            One line, at every width.

            The line is 13.68 times its own font size wide, so the size has to
            come off the viewport rather than sit at a fixed 2rem — at 32px it
            wanted 438px of a 327px column and broke in two. The vw term keeps
            it inside the column; the cap stops it from turning into a poster on
            a wide screen. `max-w-2xl` went with it: at the full size the line
            is about 766px and that cap was 672px, so the desktop layout was
            wrapping it too.
          */}
          {/* Two rates, because the room changes at medium: the running count
              appears beside the heading there and takes about 115px out of the
              line, so a single vw figure either wrapped at 768 or wasted the
              width a phone actually has. */}
          <h2 className="whitespace-nowrap font-serif font-medium leading-[1.04] text-navy text-[clamp(1rem,6.2vw,3.5rem)] md:text-[clamp(1rem,4.6vw,3.5rem)]">
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
    /* Below the wide layout the stage simply takes whatever height the heading
       and dots leave behind, and the card fills it — so a study is always
       exactly one screen and never has to be scrolled past to reach the next.
       The wide layout keeps its tuned height. */
    <div className="relative min-h-0 flex-1 overflow-hidden lg:h-[min(560px,62svh)] lg:min-h-[480px] lg:flex-none">
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
    <div className="flex h-full flex-col gap-5 lg:grid lg:grid-cols-[minmax(190px,0.32fr)_minmax(0,1fr)] lg:gap-7">
      {/* Both plates stay on a phone — three pieces of the campaign, not one.
          Given a band of the screen's own height rather than their own square
          shape: at 1:1 the pair stood 153px tall and, on a card that has only
          one screen to spend, that came out of the campaign image below. */}
      <div className="grid h-[clamp(68px,13svh,110px)] shrink-0 grid-cols-2 gap-3 lg:h-auto lg:grid-cols-1 lg:grid-rows-2 lg:gap-5">
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
            className="relative min-h-0 overflow-hidden rounded-2xl border border-navy/10 bg-cream shadow-[0_14px_35px_rgba(4,46,105,0.08)] lg:min-h-0"
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

      <article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-navy/10 bg-[#fffdf9] shadow-[0_18px_50px_rgba(4,46,105,0.09)] lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
        {/* The image takes whatever the writing does not. Given a fixed height
            instead, the card came to whatever it came to — 917px against a
            686px stage — and the foot of it was simply cut off. */}
        <div className="relative min-h-0 flex-1 overflow-hidden lg:flex-none">
          <motion.img
            style={{ y: heroY }}
            src={hero.type === 'video' ? hero.poster ?? hero.src : hero.src}
            alt={`${study.client} campaign`}
            loading="lazy"
            decoding="async"
            className="absolute -inset-y-[4%] inset-x-0 h-[108%] w-full object-cover"
          />
        </div>

        <div className="flex min-h-0 shrink-0 flex-col justify-between p-5 sm:p-9 lg:p-8 xl:p-9">
          <div>
            <p className="mb-3 text-[0.58rem] font-light uppercase tracking-[0.32em] text-navy/70 sm:mb-5 lg:mb-3">
              {[study.index, study.sector, detail?.period].filter(Boolean).join(' · ')}
            </p>
            <h3 className="font-serif text-2xl font-medium leading-tight text-navy sm:text-4xl lg:text-3xl xl:text-4xl">
              {study.client}
            </h3>
            <p className="mt-3 font-serif text-base italic leading-snug text-navy/85 sm:mt-5 sm:text-2xl lg:mt-4 lg:text-[1.35rem] xl:text-2xl">
              {study.theory}
            </p>
            {/* Held to three lines on a phone. The card is one screen there and
                the writing was taking it all, leaving the campaign image a
                147px strip — the full paragraph returns as soon as there is
                room for it. */}
            <p className="mt-3 line-clamp-2 text-sm font-light leading-relaxed text-navy/75 sm:mt-6 sm:line-clamp-none sm:text-[0.95rem] lg:mt-4 lg:text-[0.86rem] lg:leading-[1.65] xl:text-[0.92rem]">
              {study.body}
            </p>
          </div>

          {/* Figures are reported, not decorative — shown only where real ones
              are held for that client, never invented to fill the row. */}
          {detail?.metrics?.length ? (
            <dl className="mt-4 grid grid-cols-3 border-t border-navy/15 pt-4 sm:mt-8 sm:pt-6 lg:mt-5 lg:pt-4">
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
