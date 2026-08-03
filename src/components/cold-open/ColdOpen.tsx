import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COLD_OPEN } from '../../config/copy'
import { EASE, prefersReducedMotion } from '../../lib/motion'

type ColdOpenProps = {
  onComplete: () => void
}

/**
 * The film's first frame: a vague brief is struck through and replaced by the
 * idea that a theory was inside it all along. Runs once, then hands the page
 * over to the hero.
 */
export function ColdOpen({ onComplete }: ColdOpenProps) {
  const [phase, setPhase] = useState<'brief' | 'strike' | 'resolve' | 'done'>('brief')

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('done')
      onComplete()
      return
    }

    const timers = [
      window.setTimeout(() => setPhase('strike'), 1400),
      window.setTimeout(() => setPhase('resolve'), 2200),
      window.setTimeout(() => setPhase('done'), 4200),
      window.setTimeout(onComplete, 4900),
    ]

    return () => timers.forEach(window.clearTimeout)
  }, [onComplete])

  useEffect(() => {
    document.body.style.overflow = phase === 'done' ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [phase])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy px-6"
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="w-full max-w-3xl text-center">
            <motion.p
              className="mb-6 text-[0.65rem] font-light uppercase tracking-[0.45em] text-slate-brand sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {COLD_OPEN.label}
            </motion.p>

            <AnimatePresence mode="wait">
              {phase !== 'resolve' ? (
                <motion.p
                  key="brief"
                  className="relative inline-block text-2xl font-light text-cream sm:text-4xl md:text-5xl"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {COLD_OPEN.brief}
                  <motion.span
                    className="absolute left-0 top-1/2 h-px w-full origin-left bg-slate-steel"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: phase === 'strike' ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                </motion.p>
              ) : (
                <motion.p
                  key="resolve"
                  className="text-2xl font-medium text-cream sm:text-4xl md:text-5xl"
                  initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  {COLD_OPEN.resolve}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
