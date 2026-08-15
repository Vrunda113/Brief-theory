import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Bot, Compass, Monitor, PenTool, TrendingUp, type LucideIcon } from 'lucide-react'
import { PRACTICE } from '../../config/copy'
import { EASE } from '../../lib/motion'
import { FadeIn } from '../shared/FadeIn'

/**
 * Section 03 — the practice, set out as a route.
 *
 * Five equal columns side by side read as a menu: a list of things that can be
 * bought separately, in no particular order. The offer is not that. Each
 * discipline stands on the one before it, and the section has to show that
 * without ever saying "step" or numbering itself into a process diagram.
 *
 * So the stops descend, and a line is drawn through them as the section is
 * reached. The order is carried by the geometry and by the drawing — the eye
 * travels the route rather than being told there is one.
 */

const PILLAR_ICONS: Record<string, LucideIcon> = {
  Strategy: Compass,
  Identity: PenTool,
  Digital: Monitor,
  'AI Systems': Bot,
  Growth: TrendingUp,
}

/** Seconds the route takes to draw itself once the section is reached. */
const DRAW = 2.1

/**
 * The bow of the route: how far the middle of the run falls below its ends.
 *
 * A steady descent from left to right is a slope, and a slope has no shape —
 * it reads as a list that has been tilted. Bowing the run gives it the one
 * form the eye recognises as a single continuous movement: the line leaves,
 * travels, and returns, so the five stops read as one route rather than five
 * points that happen to be joined.
 */
const BOW = 104

/**
 * Which way the route bows. 1 hangs it like a slung cable — the middle drops
 * and the ends lift. -1 mirrors it into an arch.
 */
const BOW_DIRECTION = 1

/**
 * Where a stop sits, in px below the line of the row.
 *
 * A sine across the run, so the curve is steepest between the stops and
 * flattest at them — the same reason the path eases flat into each node. An
 * arc of a circle would bunch the change at the ends and leave the middle
 * three almost level with one another.
 */
function dropFor(index: number, total: number): number {
  if (total < 2) return 0
  const t = index / (total - 1)
  const bow = Math.sin(Math.PI * t) * BOW * BOW_DIRECTION
  // Held clear of the row's own line so the arch never lifts a stop above it.
  return Math.round(BOW_DIRECTION > 0 ? bow : BOW + bow)
}

/**
 * The route, built from where the nodes actually are.
 *
 * Measured rather than computed from the grid. Worked out on paper the path
 * has to assume each node sits at its column's centre — and they sit at its
 * left edge, on a pitch that includes a fixed gap, so the fraction of the row
 * a node stands at changes with the width of the row. A stretched viewBox
 * cannot stay registered to that at every size. Reading the positions back
 * costs one pass and is right by construction.
 */
function pathThrough(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''

  /*
   * Catmull-Rom, converted to cubics. Each node's handles are taken from the
   * neighbours either side of it, so the curve carries its direction through
   * a stop instead of stopping at it.
   *
   * The first version pinned both handles horizontally at every node, which is
   * right for a staircase — it makes the line arrive flat into each tread. On
   * a bow it is wrong: flat at every node scallops the run into five separate
   * humps, and what should read as one continuous arc reads as a wave.
   */
  const at = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))]

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x} ${p2.y}`
  }
  return d
}

export function Services() {
  const wrap = useRef<HTMLDivElement>(null)
  const [route, setRoute] = useState('')
  const [box, setBox] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return

    const measure = () => {
      const nodes = [...el.querySelectorAll<HTMLElement>('[data-route-node]')]
      if (nodes.length < 2) return
      const base = el.getBoundingClientRect()
      const points = nodes.map((n) => {
        const r = n.getBoundingClientRect()
        return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top }
      })

      /*
       * A lead-in and a lead-out, carrying the route to both edges of the row.
       *
       * Every node sits at the left of its own column, so a route drawn only
       * between them stops a whole column short of the right-hand edge while
       * the type beneath carries on — which is what made the whole run look
       * pushed to the left. Running it out to the margins balances it, and it
       * reads better besides: a road passing through rather than one that
       * begins and ends at two arbitrary points.
       */
      const first = points[0]
      const last = points[points.length - 1]
      const withRunOff = [
        { x: 0, y: first.y },
        ...points,
        { x: base.width, y: last.y },
      ]

      setRoute(pathThrough(withRunOff))
      setBox({ w: base.width, h: base.height })
    }

    measure()

    /*
     * Three triggers, because a route drawn for the previous layout is worse
     * than no route at all.
     *
     * The observer catches reflows the window never hears about. The window
     * listener is the fallback for anywhere the observer is unavailable or
     * throttled. And `fonts.ready` matters most of the three in practice: the
     * display and body faces load after first paint, and when they swap in,
     * every line of type re-measures and the stops move — a route drawn before
     * that lands threaded past its own nodes.
     */
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure, { passive: true })
    let cancelled = false
    void document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })

    return () => {
      cancelled = true
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section
      id="services"
      className="relative z-20 scroll-mt-4 border-t border-navy/15 bg-cream-dim px-6 py-20 md:px-10 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 md:mb-16">
          <FadeIn y={20}>
            <p className="mb-5 text-[0.65rem] font-light uppercase tracking-[0.42em] text-navy/70 sm:text-xs">
              03 — Where strategy becomes tangible
            </p>
          </FadeIn>

          <FadeIn y={28} delay={0.05}>
            <h2
              className="max-w-3xl font-serif font-medium leading-[1.04] text-navy"
              style={{ fontSize: 'clamp(2.15rem, 4vw, 3.65rem)' }}
            >
              We don’t create deliverables.{' '}
              <em className="font-serif italic text-slate-brand">We build brand systems.</em>
            </h2>
          </FadeIn>
        </header>

        {/* Room below for the bow, which is a transform and so takes no space
            of its own. */}
        <div ref={wrap} className="relative lg:pb-[130px]">
          {route && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0"
              width={box.w}
              height={box.h}
              viewBox={`0 0 ${box.w} ${box.h}`}
              fill="none"
            >
              {/* The route as it will be, held faint underneath. */}
              <path d={route} stroke="currentColor" className="text-navy/14" strokeWidth={1} />
              {/* The route being travelled. */}
              <motion.path
                d={route}
                stroke="currentColor"
                className="text-navy/50"
                strokeWidth={1}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: DRAW, ease: EASE }}
              />
            </svg>
          )}

          <ol className="relative grid gap-11 lg:grid-cols-5 lg:gap-6">
            {PRACTICE.pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[pillar.name]

              return (
                <li
                  key={pillar.name}
                  className="route-stop group relative lg:pr-3"
                  style={
                    {
                      '--drop': `${dropFor(i, PRACTICE.pillars.length)}px`,
                    } as CSSProperties
                  }
                >
                  {/*
                    Fades only — nothing here may move. The route is drawn to
                    where the nodes are, so a stop that slides into place
                    measures at one position and settles at another, and the
                    line ends up threaded past its own nodes.
                  */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    // Arrives as the line reaches it, so the route appears to
                    // deliver each discipline rather than the two running to
                    // their own clocks.
                    transition={{ delay: 0.2 + i * (DRAW / PRACTICE.pillars.length), duration: 0.7, ease: EASE }}
                  >
                    <div className="flex items-center gap-4 lg:block">
                      {/* The node the route passes through. Its ground is the
                          section's own, so the line is cut rather than crossed. */}
                      <span
                        data-route-node
                        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-navy/30 bg-cream-dim text-navy transition-colors duration-500 group-hover:border-navy group-hover:bg-navy group-hover:text-cream"
                      >
                        <Icon aria-hidden="true" strokeWidth={1.4} className="h-[0.82rem] w-[0.82rem]" />
                      </span>

                      <p className="font-serif text-[0.7rem] text-navy/45 lg:mt-5">{pillar.index}</p>
                    </div>

                    <h3
                      className="mt-1 font-medium leading-tight text-navy lg:mt-1.5"
                      style={{ fontSize: 'clamp(1.15rem, 1.5vw, 1.5rem)' }}
                    >
                      {pillar.name}
                    </h3>

                    <p className="mt-3 max-w-[34ch] text-[0.78rem] font-light leading-relaxed text-navy/70 lg:mt-4 lg:text-[0.8rem]">
                      {pillar.body}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-navy/15 pt-4">
                      {pillar.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[0.72rem] font-light leading-snug text-navy/72"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] h-px w-2 shrink-0 bg-navy/35 transition-colors duration-500 group-hover:bg-navy"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
