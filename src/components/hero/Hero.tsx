import { motion } from 'framer-motion'
import { BRAND, HERO } from '../../config/copy'
import { EASE } from '../../lib/motion'
import { FadeIn } from '../shared/FadeIn'
import { ContactButton } from '../shared/Buttons'
import { Navbar } from './Navbar'

type HeroProps = {
  ready: boolean
}

export function Hero({ ready }: HeroProps) {
  return (
    <section
      id="top"
      className="relative flex h-svh min-h-[600px] flex-col bg-cream"
      style={{ overflowX: 'clip' }}
    >
      <Navbar />

      {/* A slow drifting bloom keeps the field from reading as flat paint. On
          cream it has to stay within a shade or two of the paper: a wide blur
          across a long colour distance quantises into visible rings. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, #E9E0D2 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 md:px-10">
        <div className="overflow-hidden">
          {/* Two lines on phones, one on anything wider — the full lockup at a
              legible size overruns a narrow viewport. */}
          <motion.h1
            className="headline-gradient-ink w-full text-center text-[16vw] font-black uppercase leading-[0.88] tracking-tight sm:whitespace-nowrap sm:text-[12vw] sm:leading-none"
            initial={{ opacity: 0, y: 60 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 1.1, ease: EASE }}
          >
            <span className="block sm:inline">Brief</span>
            <span className="block sm:ml-[0.25em] sm:inline">Theory</span>
          </motion.h1>
        </div>

        <motion.p
          className="mx-auto mt-5 max-w-[420px] text-center text-[0.7rem] font-light uppercase tracking-[0.25em] text-navy/55 sm:mt-7 sm:text-xs md:text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
        >
          {BRAND.tagline}
        </motion.p>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-6 px-6 pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.75} y={20} className="max-w-[200px] sm:max-w-[280px] md:max-w-[340px]">
          <p
            className="font-light uppercase leading-snug tracking-wide text-navy/70"
            style={{ fontSize: 'clamp(0.66rem, 1.05vw, 0.88rem)' }}
          >
            {HERO.intro}
          </p>
        </FadeIn>

        <FadeIn delay={0.9} y={20} className="shrink-0">
          <ContactButton on="cream">{HERO.cta}</ContactButton>
        </FadeIn>
      </div>
    </section>
  )
}
