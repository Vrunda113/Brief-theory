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
      { type: 'image', src: '/images/huft/Picture1.png' },
      { type: 'image', src: '/images/huft/Picture3.png' },
      { type: 'image', src: '/images/huft/Picture6.png' },
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
      className="relative border-y border-navy/15 bg-cream px-6 py-20 md:px-10 md:py-24 lg:h-[300svh] lg:py-0"
    >
      <div className="mx-auto max-w-7xl lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center">
        <SectionHead activeIndex={activeIndex} />

        <CaseTrack scrollProgress={scrollYProgress} />

        <div className="space-y-14 lg:hidden">
          {FEATURED_CASES.map((study) => (
            <CaseStudySpread key={study.client} study={study} scrollProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
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
          <p className="text-sm font-light leading-relaxed text-navy/72">
            Real briefs. Clear decisions. Work built from a point of view.
          </p>
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
            className="relative min-h-[170px] overflow-hidden rounded-2xl border border-navy/10 bg-cream shadow-[0_14px_35px_rgba(4,46,105,0.08)] lg:min-h-0"
          >
            <img
              src={media.type === 'video' ? media.poster ?? media.src : media.src}
              alt={`${study.client} campaign visual ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      <article className="grid min-h-[460px] overflow-hidden rounded-[1.75rem] border border-navy/10 bg-[#fffdf9] shadow-[0_18px_50px_rgba(4,46,105,0.09)] md:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] lg:h-full lg:min-h-0">
        <div className="relative min-h-[280px] overflow-hidden md:min-h-0">
          <motion.img
            style={{ y: heroY }}
            src={hero.type === 'video' ? hero.poster ?? hero.src : hero.src}
            alt={`${study.client} campaign`}
            className="absolute -inset-y-[4%] inset-x-0 h-[108%] w-full object-cover"
          />
        </div>

        <div className="flex min-h-0 flex-col justify-between p-7 sm:p-9 lg:p-8 xl:p-9">
          <div>
            <p className="mb-5 text-[0.58rem] font-light uppercase tracking-[0.32em] text-navy/70 lg:mb-3">
              {[study.index, study.sector, detail?.period].filter(Boolean).join(' · ')}
            </p>
            <h3 className="font-serif text-3xl font-medium leading-tight text-navy sm:text-4xl lg:text-3xl xl:text-4xl">
              {study.client}
            </h3>
            <p className="mt-5 font-serif text-xl italic leading-snug text-navy/85 sm:text-2xl lg:mt-4 lg:text-[1.35rem] xl:text-2xl">
              {study.theory}
            </p>
            <p className="mt-6 text-sm font-light leading-relaxed text-navy/75 sm:text-[0.95rem] lg:mt-4 lg:text-[0.86rem] lg:leading-[1.65] xl:text-[0.92rem]">
              {study.body}
            </p>
          </div>

          {/* Figures are reported, not decorative — shown only where real ones
              are held for that client, never invented to fill the row. */}
          {detail?.metrics?.length ? (
            <dl className="mt-8 grid grid-cols-3 border-t border-navy/15 pt-6 lg:mt-5 lg:pt-4">
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
