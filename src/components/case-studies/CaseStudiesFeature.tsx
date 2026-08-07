import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { CASE_STUDIES, type CaseStudy, type Media } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'

const CASE_ORDER = ['Super Munchies', 'HUFT']
const FEATURED_CASES = CASE_ORDER.map((client) => CASE_STUDIES.find((study) => study.client === client)).filter(
  (study): study is CaseStudy => Boolean(study),
)

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
}

export function CaseStudiesFeature() {
  const section = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActiveIndex((current) => {
      if (current === 0 && value > 0.56) return 1
      if (current === 1 && value < 0.44) return 0
      return current
    })
  })

  return (
    <section
      id="case-studies"
      ref={section}
      className="relative border-y border-navy/15 bg-cream px-6 py-20 md:px-10 md:py-24 lg:h-[190svh] lg:py-0"
    >
      <div className="mx-auto max-w-7xl lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center">
        <SectionHead activeIndex={activeIndex} />

        <div className="hidden lg:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={FEATURED_CASES[activeIndex].client}
              initial={{ opacity: 0, y: 18, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.995 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <CaseStudySpread study={FEATURED_CASES[activeIndex]} scrollProgress={scrollYProgress} />
            </motion.div>
          </AnimatePresence>
        </div>

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
      <div className="mb-9 flex items-end justify-between gap-6 border-b border-navy/20 pb-7 lg:mb-8">
        <div>
          <p className="mb-4 text-[0.62rem] font-light uppercase tracking-[0.42em] text-navy/65 sm:text-[0.7rem]">
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
          <p className="text-sm font-light leading-relaxed text-navy/60">
            Real briefs. Clear decisions. Work built from a point of view.
          </p>
          <p className="mt-3 text-[0.58rem] font-light uppercase tracking-[0.28em] text-navy/45">
            0{activeIndex + 1} / 0{FEATURED_CASES.length}
          </p>
        </div>
      </div>
    </FadeIn>
  )
}

function CaseStudySpread({ study, scrollProgress }: { study: CaseStudy; scrollProgress: MotionValue<number> }) {
  const firstY = useTransform(scrollProgress, [0, 1], [-16, 16])
  const secondY = useTransform(scrollProgress, [0, 1], [16, -16])
  const heroY = useTransform(scrollProgress, [0, 1], ['-2.5%', '2.5%'])

  const detail = CASE_DETAILS[study.client]
  const first = detail.media[0]
  const second = detail.media[1]
  const hero = detail.media[2]

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(190px,0.32fr)_minmax(0,1fr)] lg:gap-7">
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

      <article className="grid min-h-[460px] overflow-hidden rounded-[1.75rem] border border-navy/10 bg-[#fffdf9] shadow-[0_18px_50px_rgba(4,46,105,0.09)] md:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] lg:min-h-[520px]">
        <div className="relative min-h-[280px] overflow-hidden md:min-h-0">
          <motion.img
            style={{ y: heroY }}
            src={hero.type === 'video' ? hero.poster ?? hero.src : hero.src}
            alt={`${study.client} campaign`}
            className="absolute -inset-y-[4%] inset-x-0 h-[108%] w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10">
          <div>
            <p className="mb-5 text-[0.58rem] font-light uppercase tracking-[0.32em] text-navy/55">
              {study.index} · {study.sector} · {detail.period}
            </p>
            <h3 className="font-serif text-3xl font-medium leading-tight text-navy sm:text-4xl">
              {study.client}
            </h3>
            <p className="mt-5 font-serif text-xl italic leading-snug text-navy/85 sm:text-2xl">
              {study.theory}
            </p>
            <p className="mt-6 text-sm font-light leading-relaxed text-navy/68 sm:text-[0.95rem]">
              {study.body}
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-3 border-t border-navy/15 pt-6">
            {detail.metrics.map((metric, index) => (
              <Metric key={metric.label} value={metric.value} label={metric.label} bordered={index === 1} />
            ))}
          </dl>
        </div>
      </article>
    </div>
  )
}

function Metric({ value, label, bordered = false }: { value: string; label: string; bordered?: boolean }) {
  return (
    <div className={bordered ? 'border-x border-navy/15 px-4' : 'px-2 first:pl-0 last:pr-0'}>
      <dt className="font-serif text-lg text-navy sm:text-xl">{value}</dt>
      <dd className="mt-1 text-[0.52rem] font-light uppercase tracking-[0.18em] text-navy/50 sm:text-[0.58rem]">
        {label}
      </dd>
    </div>
  )
}
