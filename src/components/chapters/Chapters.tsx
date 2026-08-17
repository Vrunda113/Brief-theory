import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { METHOD_STAGES } from '../../config/copy'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion'
import { CinematicVideo } from '../shared/CinematicVideo'

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
          <div className="grid md:grid-cols-[minmax(0,1fr)_clamp(8.5rem,14vw,11rem)] md:gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,1fr)_clamp(9.5rem,15vw,12rem)]">
            <div>
              <Label>04 — Core beliefs</Label>
              <Display>{beliefs.heading}</Display>
            </div>
            <div className="hidden md:block" aria-hidden="true" />
          </div>

          {/* The film and the first belief now share the same top edge. */}
          <Body>
            <div className="grid md:grid-cols-[minmax(0,1fr)_clamp(8.5rem,14vw,11rem)] md:gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,1fr)_clamp(9.5rem,15vw,12rem)]">
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
                  the device it was shot for. Stacked under the beliefs at the
                  narrow width, beside them from medium. */}
              <div className="mt-8 flex justify-center md:mt-0" data-reveal>
                <PhoneFilm />
              </div>
            </div>
          </Body>
        </div>
      </Sheet>
    </section>
  )
}

/** A deliberately quiet phone mockup: supporting texture, never the headline. */
function PhoneFilm() {
  return (
    // Smaller on a phone: the sheet is one screen tall and already carries a
    // heading and six beliefs, so at its full width the mockup was the thing
    // that pushed the foot of the section past the fold.
    <div className="relative w-full max-w-[7.5rem] rounded-[2.05rem] border border-navy/20 bg-[#071733] p-[5px] shadow-[0_18px_45px_rgba(0,0,0,0.28)] md:max-w-[11rem] lg:max-w-[12rem]">
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.72rem] bg-black">
        <CinematicVideo
          src="/video/core-beliefs-phone.mp4"
          poster="/video/core-beliefs-phone.jpg"
          className="h-full w-full object-cover"
          rootMargin="250px"
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
      className="sticky top-0 h-svh overflow-hidden rounded-t-[36px] bg-cream shadow-[0_-30px_60px_-20px_rgba(4,46,105,0.22)] md:rounded-t-[52px]"
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
          className="relative flex h-full flex-col px-6 pb-[clamp(1.75rem,5vh,3rem)] pt-[clamp(2.75rem,9.5vh,6rem)] md:px-10"
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
