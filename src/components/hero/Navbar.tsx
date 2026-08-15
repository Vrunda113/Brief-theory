import { memo, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND, NAV_LINKS } from '../../config/copy'
import { EASE } from '../../lib/motion'
import { GRAIN, PALETTE } from '../../config/palette'
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

        It is a lit surface rather than a fill. A single flat navy across a
        whole screen has no light in it and nothing for the eye to travel
        along, which is what makes a full-bleed colour read as a slide. Three
        cheap things fix it: the ground deepens diagonally, one soft key sits
        off the top-left corner, and the whole thing carries the same paper
        grain as the landing screen so it is stock rather than paint.
      */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 origin-top overflow-hidden"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        style={{
          background: `linear-gradient(145deg, ${PALETTE.ink} 0%, ${PALETTE.abyss} 52%, #071F47 100%)`,
        }}
      >
        {/* The key: a wide, very soft pool, kept low enough that it lifts the
            corner without ever reading as a shape of its own. */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '-32%',
            left: '-18%',
            width: '85%',
            height: '110%',
            background: `radial-gradient(closest-side, ${PALETTE.steel}3D, transparent 72%)`,
          }}
        />
        {/* A cooler counter-light from the far edge, so the panel has two sides
            to it rather than one lit corner and a dead remainder. */}
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: '-28%',
            right: '-14%',
            width: '62%',
            height: '86%',
            background: `radial-gradient(closest-side, ${PALETTE.slate}33, transparent 74%)`,
          }}
        />
        {/* Grain over everything, screened rather than multiplied — on a dark
            ground multiply has nothing to darken and the tile disappears. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-screen"
          style={{ backgroundImage: GRAIN }}
        />
      </motion.div>

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

/** Relative luminance, for deciding whether a ground is dark. */
function luminance(rgb: [number, number, number]) {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])
}

export const Navbar = memo(function Navbar() {
  const [open, setOpen] = useState(false)
  /** True once the page has moved, so the bar can seat itself. */
  const [seated, setSeated] = useState(false)
  /** True when the section under the bar is a dark one. */
  const [onDark, setOnDark] = useState(false)
  const bar = useRef<HTMLDivElement>(null)

  /*
   * The bar follows the page, so it has to work over both grounds. Rather than
   * being told which sections are navy — a list that goes stale the moment one
   * is added or reordered — it reads the computed background of whichever
   * section is actually beneath it and decides from that. Sections can be
   * recoloured freely and the bar keeps up on its own.
   */
  useEffect(() => {
    /*
     * Read straight off the scroll rather than deferring to a frame callback.
     * Queued through requestAnimationFrame this stopped updating entirely
     * wherever frames are throttled — a background tab, a stalled compositor —
     * and the bar sat in whichever tone it happened to be in. Measuring a
     * handful of section rects is cheap enough to do inline.
     */
    const read = () => {
      const el = bar.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setSeated(window.scrollY > 12)

      /*
       * Hit-tests the point just under the bar rather than scanning the
       * top-level sections. Sections are not the only things that carry a
       * ground — the closing band is a navy block inside a cream section, and
       * checking only its parent had the bar reading cream while sitting on
       * navy. Whatever is actually painted there is what it has to answer to.
       */
      const stack = document.elementsFromPoint(rect.left + rect.width / 2, rect.bottom + 8)
      const ground = stack.find(
        (node) =>
          // The bar hit-tests itself; skip it and anything it contains.
          !el.contains(node) &&
          node !== el &&
          (() => {
            const parsed = getComputedStyle(node).backgroundColor.match(/[\d.]+/g)
            // Only a surface opaque enough to actually be the ground counts;
            // transparent wrappers in between are passed over.
            return !!parsed && parsed.length >= 3 && (parsed[3] === undefined || +parsed[3] > 0.6)
          })(),
      )
      if (!ground) return

      const parsed = getComputedStyle(ground).backgroundColor.match(/[\d.]+/g)
      if (!parsed) return
      setOnDark(luminance([+parsed[0], +parsed[1], +parsed[2]]) < 0.4)
    }

    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read, { passive: true })
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

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
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6"
      >
        {/*
          A bar with its own ground, inset from the page edges rather than sat
          on them. Bare over the cream the navigation had nothing holding it and
          read as two items that had drifted to the top of the screen; given a
          pane of its own it reads as furniture the page is arranged under.

          Glass rather than a solid fill, so whatever passes beneath stays
          visible — and because it now travels the whole page, the glass takes
          its tone from the section under it. Cream over navy, navy over cream,
          each with the type inverted to match.
        */}
        <div
          ref={bar}
          className="flex items-center justify-between rounded-full py-2.5 pl-5 pr-5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:py-3 sm:pl-6 sm:pr-7"
          style={{
            background: onDark ? 'rgba(10, 42, 94, 0.42)' : 'rgba(246, 240, 233, 0.62)',
            border: `1px solid ${onDark ? 'rgba(246,240,233,0.20)' : `${PALETTE.ink}14`}`,
            // Untethered at the top of the page and lifted once it is travelling
            // over content, so the bar gains weight only when it needs it.
            boxShadow: seated
              ? `0 18px 40px -28px ${PALETTE.abyss}59, inset 0 1px 0 rgba(255,255,255,${onDark ? 0.18 : 0.6})`
              : `inset 0 1px 0 rgba(255,255,255,${onDark ? 0.14 : 0.5})`,
          }}
        >
          <a href="#top" className="shrink-0 transition-opacity duration-200 hover:opacity-80">
            {/* On navy the mark carries its own cream plate; on cream it needs
                none. Same file either way — never a recoloured second copy. */}
            {onDark ? (
              <Wordmark className="h-9 sm:h-10 md:h-11" />
            ) : (
              <Wordmark bare className="h-8 sm:h-9 md:h-10" />
            )}
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="dialog"
            className="group flex items-center gap-3.5 transition-colors duration-500"
            style={{ color: onDark ? PALETTE.paper : PALETTE.ink }}
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
        </div>
      </FadeIn>

      <AnimatePresence>{open && <MenuPanel onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
})
