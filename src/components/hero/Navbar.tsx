import { memo, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND, NAV_LINKS } from '../../config/copy'
import { EASE } from '../../lib/motion'
import { PALETTE } from '../../config/palette'
import { FadeIn } from '../shared/FadeIn'
import { Wordmark } from '../shared/Wordmark'

/**
 * The bar: the mark, and one word.
 *
 * A row of five links spends the whole top of every screen on navigation that
 * is read once. Collapsed to a single control the header gives that width back
 * to the page, and the links get a screen of their own where they can be set
 * at a size worth reading — which is the only way a five-item menu earns being
 * a full-screen event rather than an annoyance.
 */

/** Items rise in this far, and this far apart. */
const ITEM_RISE = 34
const ITEM_STEP = 0.055

function MenuPanel({ onClose }: { onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)

  /*
   * Escape closes, and focus moves into the panel — without that the tab order
   * stays back on the page behind and a keyboard reader is left navigating a
   * screen they cannot see.
   *
   * The scroll lock is deliberately *not* here. Released on unmount it is
   * released by the exit animation finishing, and anything that interrupts
   * that animation leaves the whole page frozen with no way back. It belongs
   * to the open/closed state, which is upstream of any animation.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    panel.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[90] outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{ backgroundColor: PALETTE.ink }}
    >
      {/*
        The ground arrives as a wipe from the top rather than a fade: a panel
        that fades in reads as a layer sitting over the page, one that travels
        reads as a surface arriving in front of it.
      */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 origin-top"
        style={{ backgroundColor: PALETTE.abyss }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      />

      <div className="relative flex h-full flex-col px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-start justify-between">
          <a href="#top" onClick={onClose} className="shrink-0">
            <Wordmark className="h-12 md:h-14" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="group flex items-center gap-3 pt-2"
            style={{ color: PALETTE.paper }}
          >
            <span className="text-[0.62rem] font-light uppercase tracking-[0.32em] opacity-70 transition-opacity group-hover:opacity-100">
              Close
            </span>
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center">
          <ul className="space-y-1 md:space-y-2">
            {NAV_LINKS.map((link, i) => (
              // Each line is clipped by its own row, so it rises out of the
              // rule above it rather than sliding over the panel.
              <li key={link.href} className="overflow-hidden">
                <motion.div
                  initial={{ y: ITEM_RISE, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: ITEM_RISE * 0.5, opacity: 0, transition: { duration: 0.18 } }}
                  transition={{ delay: 0.28 + i * ITEM_STEP, duration: 0.6, ease: EASE }}
                >
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-5 py-1"
                    style={{ color: PALETTE.paper }}
                  >
                    <span
                      className="font-serif text-[0.68rem] tabular-nums"
                      style={{ color: PALETTE.steel }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-serif leading-[1.06] transition-opacity duration-300 group-hover:opacity-60"
                      style={{ fontSize: 'clamp(2.2rem, 7vw, 5.2rem)' }}
                    >
                      {link.label}
                    </span>
                  </a>
                </motion.div>
              </li>
            ))}
          </ul>
        </nav>

        <motion.div
          className="flex flex-wrap items-end justify-between gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
        >
          <a
            href={`mailto:${BRAND.email}`}
            className="text-sm font-light transition-opacity hover:opacity-100 sm:text-base"
            style={{ color: PALETTE.mist }}
          >
            {BRAND.email}
          </a>
          <div className="flex gap-6">
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[0.6rem] font-light uppercase tracking-[0.24em] transition-opacity hover:opacity-100"
              style={{ color: PALETTE.mist }}
            >
              Instagram
            </a>
            <a
              href={BRAND.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[0.6rem] font-light uppercase tracking-[0.24em] transition-opacity hover:opacity-100"
              style={{ color: PALETTE.mist }}
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export const Navbar = memo(function Navbar() {
  const [open, setOpen] = useState(false)

  /*
   * Held here rather than inside the panel, and keyed on the state rather than
   * on the panel's lifetime: the page unlocks the moment the menu is dismissed,
   * whether or not the closing animation ever finishes.
   */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <>
      <FadeIn
        as="header"
        delay={0}
        y={-20}
        className="relative z-30 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8"
      >
        <a href="#top" className="shrink-0 transition-opacity duration-200 hover:opacity-80">
          <Wordmark bare className="h-9 sm:h-11 md:h-12" />
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="group flex items-center gap-3.5"
          style={{ color: PALETTE.ink }}
        >
          <span className="text-[0.62rem] font-light uppercase tracking-[0.3em] sm:text-xs">
            Menu
          </span>
          {/* Two rules that draw apart on approach — the least the control can
              do and still say it opens something. */}
          <span aria-hidden="true" className="relative block h-[9px] w-6">
            <span className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ease-out group-hover:-translate-y-[2px]" />
            <span className="absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ease-out group-hover:translate-y-[2px]" />
          </span>
        </button>
      </FadeIn>

      <AnimatePresence>{open && <MenuPanel onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
})
