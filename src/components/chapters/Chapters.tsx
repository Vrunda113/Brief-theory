import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { METHOD_STAGES } from '../../config/copy'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion'

/**
 * Chapter 06 of the brand profile, presented as a single sheet: sticky at the
 * top of the viewport with a rounded fore-edge and a thrown shadow, so it still
 * reads as a page rising over the section above it. The label, display
 * and belief items cascade in as it arrives, on their own clock rather than
 * tied to the scrub — a stagger driven by scroll position smears into nothing.
 *
 * This used to be three chapters stacked as sheets that slid over one another;
 * 07 and 08 were removed and the covering/receding machinery went with them,
 * since it only ever did anything when one sheet had another to cover it.
 */

const beliefs = METHOD_STAGES[0]

export function Chapters() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const sheet = root.current?.querySelector<HTMLElement>('[data-sheet]')
      if (!sheet) return

      const lines = Array.from(sheet.querySelectorAll<HTMLElement>('[data-reveal]'))
      gsap.set(lines, { autoAlpha: 0, y: 26 })

      // The sheet's top edge tracks the scroll while it is still in flow, so
      // this fires as it rises into reach and resets on the way back out.
      ScrollTrigger.create({
        trigger: sheet,
        start: 'top 62%',
        onEnter: () =>
          gsap.to(lines, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.09,
            overwrite: 'auto',
          }),
        onLeaveBack: () => gsap.set(lines, { autoAlpha: 0, y: 26, overwrite: 'auto' }),
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="method" ref={root} className="relative border-t border-navy/15 bg-cream">
      {/* ------------------------------------------------ 04 · Core beliefs */}
      <Sheet folio="04">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="grid md:grid-cols-[minmax(0,1fr)_clamp(11rem,28vw,15rem)] md:gap-[clamp(2rem,4vw,3.5rem)]">
            <div>
              <Label>04 — Core beliefs</Label>
              <Display>{beliefs.heading}</Display>
            </div>
            <div className="hidden md:block" aria-hidden="true" />
          </div>

          {/* The film and the first belief now share the same top edge. */}
          <Body>
            <div className="grid md:grid-cols-[minmax(0,1fr)_clamp(11rem,28vw,15rem)] md:gap-[clamp(2rem,4vw,3.5rem)]">
              <div className="grid grid-cols-2 gap-x-5 gap-y-[clamp(1.25rem,3.5vh,2.5rem)] sm:gap-x-10 lg:grid-cols-3">
                {beliefs.items.map((item) => (
                  <div key={item.index} data-reveal>
                    <p className="font-serif text-base text-navy/70 sm:text-lg">
                      {item.index}
                    </p>
                    <h3
                      className="mb-1.5 mt-1.5 font-serif font-medium italic leading-snug text-navy"
                      style={{ fontSize: 'clamp(0.92rem, 1.55vw, 1.4rem)' }}
                    >
                      {item.title}
                    </h3>
                    <p className="max-w-[34ch] text-[0.72rem] font-light leading-relaxed text-navy/72 sm:text-[0.85rem]">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shown on a phone too. It was `hidden md:flex`, so the one
                  piece of moving work in the section was absent from exactly
                  the device most people would see it on. Stacked under the
                  beliefs at the narrow width, beside them from medium. */}
              {/* Stretched from medium up, so the handset takes its height
                  from the beliefs beside it and the two finish on the same
                  line. Left to its own size it stood a little proud of the
                  text, and by a margin that grew as the viewport got shorter —
                  the belief rows are spaced in vh, the handset was not. */}
              <div className="mt-8 flex items-start justify-center md:mt-0 md:items-stretch" data-reveal>
                <Film />
              </div>
            </div>
          </Body>
        </div>
      </Sheet>
    </section>
  )
}

/**
 * Seven client stories at their native 720x1280 — the format they were made in.
 * Held here rather than pulled from the case studies for the same reason the
 * hero keeps its own set: this is art direction, not a feed.
 */
const REEL = [
  '/images/skin-world/myth-and-fact.webp',
  '/images/skin-world/benefits-of-vitamin-c.webp',
  '/images/skin-world/lip-filler-story.webp',
  '/images/skin-world/laser-hair-removal-instagram-story.webp',
  '/images/skin-world/7-ways-to-control-oily-skin.webp',
  '/images/skin-world/this-isnt-selfcare-its-maintainence.webp',
  '/images/skin-world/benefits-of-micro-needling-instagram-story.webp',
] as const

/**
 * How the reel behaves: each story is held still, then the track glides to the
 * next one. A carousel is a sequence of stills, not a drift — moving
 * continuously reads as a ticker, and nothing is ever actually being looked at.
 */
const HOLD = 2.8
const GLIDE = 0.55

/** The set, plus the first frame again so the wrap has somewhere to land. */
const SLIDES = [...REEL, REEL[0]]

/**
 * The work, running as a reel inside a handset.
 *
 * Built rather than filmed. A scroll baked into a video can only ever run the
 * direction it was rendered, and the clip this replaces scrolled vertically —
 * no amount of markup turns that on its side. Real elements also stay crisp at
 * any size, and the loop is seamless, which the clip's was not: its last frame
 * did not match its first, so it jumped every twelve seconds.
 *
 * The screen is 18:35. A story is 9:16, so `cover` trims about four percent
 * from each side — enough to give the handset a modern proportion without
 * eating into artwork that sits near the edges.
 */
function Film() {
  /** Which story is being held. The last index is the repeated first frame. */
  const [index, setIndex] = useState(0)
  /** False for the single frame in which the track is snapped back. */
  const [gliding, setGliding] = useState(true)
  /** True when motion is turned down: the first story, and nothing moves. */
  const [still, setStill] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  /** Each slide is one part in the track, which is one screen wide. */
  const slideWidth = `${100 / SLIDES.length}%`

  useEffect(() => {
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setStill(quiet.matches)
    read()
    quiet.addEventListener('change', read)
    return () => quiet.removeEventListener('change', read)
  }, [])

  /*
   * Advances only while the handset is on screen. Off screen it is a timer
   * moving a picture nobody is looking at.
   */
  useEffect(() => {
    if (still) return

    let visible = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.15 },
    )
    if (root.current) observer.observe(root.current)

    const id = window.setInterval(
      () => {
        if (visible) setIndex((i) => i + 1)
      },
      (HOLD + GLIDE) * 1000,
    )

    return () => {
      observer.disconnect()
      window.clearInterval(id)
    }
  }, [still])

  /*
   * The wrap. The last slide is a copy of the first, so once the glide onto it
   * has finished the track can be moved back to the real first slide with the
   * transition switched off — the two frames are identical, so there is
   * nothing to see. Restoring the transition waits a beat rather than riding a
   * rAF, which stalls in a throttled tab and would strand the reel mid-track.
   */
  useEffect(() => {
    if (index !== REEL.length) return
    const t = window.setTimeout(() => {
      setGliding(false)
      setIndex(0)
    }, GLIDE * 1000)
    return () => window.clearTimeout(t)
  }, [index])

  useEffect(() => {
    if (gliding) return
    const t = window.setTimeout(() => setGliding(true), 60)
    return () => window.clearTimeout(t)
  }, [gliding])

  return (
    <div ref={root} className="relative w-[min(55vw,13rem)] md:h-full md:w-auto">
      {/* Side keys, sitting proud of the case. */}
      <span aria-hidden="true" className="absolute -left-[2px] top-[17%] h-[6%] w-[2px] rounded-l-sm bg-navy/35" />
      <span aria-hidden="true" className="absolute -left-[2px] top-[26%] h-[9%] w-[2px] rounded-l-sm bg-navy/35" />
      <span aria-hidden="true" className="absolute -right-[2px] top-[22%] h-[11%] w-[2px] rounded-r-sm bg-navy/35" />

      {/* The case: a graded band and a lit inner rim, so the edge reads as a
          machined bezel rather than a border drawn around a picture. */}
      {/* The case carries the ratio now, and the display simply fills it. On a
          phone the width is given and the height follows; from medium up the
          height is given by the row and the width follows, bounded so it can
          neither outgrow its column nor pinch to a sliver. */}
      <div className="relative aspect-[9/17] rounded-[2.15rem] bg-gradient-to-b from-[#22314e] via-[#0c1b33] to-[#18263f] p-[0.4rem] shadow-[0_26px_55px_-24px_rgba(4,46,105,0.55)] ring-1 ring-inset ring-white/10 md:h-full md:w-auto md:max-w-full">
        <div className="relative h-full w-full overflow-hidden rounded-[1.8rem] bg-navy-deep">
          <div
            data-reel
            className="flex h-full"
            style={{
              width: `${SLIDES.length * 100}%`,
              transform: `translate3d(-${index * (100 / SLIDES.length)}%, 0, 0)`,
              // Eased, and quicker out than in — the way a thumb-flicked
              // carousel settles rather than coasting to a stop.
              transition: gliding ? `transform ${GLIDE}s cubic-bezier(0.32, 0.72, 0, 1)` : 'none',
              willChange: 'transform',
            }}
          >
            {SLIDES.map((src, i) => (
              <div key={`${src}-${i}`} className="h-full shrink-0" style={{ width: slideWidth }}>
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Glass: a soft diagonal sheen across the artwork. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"
          />

          {/* A scrim, so the dots hold against a light story. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-black/40 to-transparent"
          />

          {/* Page dots, as a carousel under one post. The repeated last frame
              is index 0 again, so the modulo lands it on the first dot. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[0.5rem] flex items-center justify-center gap-[0.3rem]"
          >
            {REEL.map((_, i) => (
              <span
                key={i}
                className="h-[0.2rem] w-[0.2rem] rounded-full bg-white transition-opacity duration-500"
                style={{ opacity: index % REEL.length === i ? 0.95 : 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* The island, floating over the top of the display. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[0.66rem] h-[0.4rem] w-[20%] -translate-x-1/2 rounded-full bg-black/70"
        />
      </div>
    </div>
  )
}

/**
 * The sheet itself. Sticky, so it holds the viewport and its rounded fore-edge
 * reads as a page arriving over whatever section precedes it.
 */
function Sheet({ folio, children }: { folio: string; children: ReactNode }) {
  return (
    <article
      data-sheet
      // Navy rising over the cream section above it, so the fore-edge reads on
      // the colour change and the shadow only has to seat it.
      //
      // Sized by its content, with a floor — never a fixed screen.
      //
      // Pinned at exactly one screen this left whatever the content did not
      // use as dead cream: 375px on a 1920x1080 desktop and 774px on a portrait
      // iPad, where the sheet is 1366 tall and the content needs about 600. The
      // taller the display, the larger the empty band, which read as a missing
      // block rather than as space.
      //
      // The floor keeps it feeling like a page on a short laptop; the cap on
      // that floor is what stops a tall tablet from padding it back out. Going
      // the other way it simply grows, which is what a 375x812 handset needs —
      // heading, six beliefs and the phone come to about 1140px there, and
      // `overflow-hidden` used to cut the bottom of the handset clean off.
      className="sticky top-0 min-h-[min(100svh,46rem)] overflow-hidden rounded-t-[36px] bg-cream shadow-[0_-30px_60px_-20px_rgba(4,46,105,0.22)] md:rounded-t-[52px]"
    >
      <div className="h-full">
        {/* Folio numeral, cropped off the fore-edge the way a printed one
            would be. The working content sits up and left; this balances the
            remainder. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[0.16em] -right-[0.05em] select-none font-serif leading-none text-navy/[0.05]"
          style={{ fontSize: 'clamp(13rem, 28vw, 27rem)' }}
        >
          {folio}
        </span>

        {/* Anchored high like an editorial page: label and display hold a
            fixed head height, and the body balances whatever remains. */}
        <div
          data-col
          // The foot carries real margin now. With the sheet sized to its
          // content this padding *is* the space below the work, rather than
          // being lost inside a screen-height block that had slack to spare.
          className="relative flex h-full flex-col px-6 pb-[clamp(2.5rem,7vh,5rem)] pt-[clamp(2.75rem,9.5vh,6rem)] md:px-10"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">{children}</div>
        </div>
      </div>
    </article>
  )
}

/**
 * The sheet's working area below the display line.
 *
 * Aligned to the top, not centred. Centred inside a sheet that is always one
 * whole screen, the beliefs floated further from their heading the taller the
 * screen got — 155px away on a phone and 402px on a portrait tablet, which
 * read as a missing block rather than as breathing room. Sitting under the
 * heading at a fixed distance, the pair holds together at every height and the
 * slack collects at the foot, where the folio numeral already lives.
 */
function Body({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 items-start pt-[clamp(1.5rem,4vh,3rem)]">
      <div className="w-full">{children}</div>
    </div>
  )
}

function Display({ children }: { children: ReactNode }) {
  return (
    <h2
      data-reveal
      className="font-serif font-medium leading-[1.05] tracking-[-0.01em] text-navy"
      style={{
        // The vh term matters: the sheet is one screen, so on a short laptop
        // the display has to give room back to the content.
        fontSize: 'clamp(1.85rem, min(4.6vw, 7.4vh), 4.1rem)',
      }}
    >
      {children}
    </h2>
  )
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p
      data-reveal
      className="mb-[clamp(0.85rem,2.5vh,1.6rem)] text-[0.62rem] font-light uppercase tracking-[0.38em] text-navy/70 sm:text-[0.7rem]"
    >
      {children}
    </p>
  )
}
