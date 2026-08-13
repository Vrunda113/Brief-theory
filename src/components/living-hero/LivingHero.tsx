import { lazy, Suspense, useEffect, useState } from 'react'
import { Navbar } from '../hero/Navbar'

/**
 * The homepage hero: the navigation, the mark, and a sculptural form framing it.
 * Nothing else on the screen.
 *
 * The mark is the flat original, laid over the canvas rather than built into
 * it. That is deliberate and load-bearing: extruded into geometry it would be
 * lit, foreshortened and turned by the same rig as the sculpture, and a
 * wordmark that is being lit and turned is no longer a wordmark. Kept as the
 * source SVG on its own layer it cannot be distorted, cannot be covered, and is
 * pixel-for-pixel the mark the landing screen just wrote.
 */

/**
 * The renderer is the larger half of the bundle and only ever runs on a pointer
 * device with motion allowed, so it is fetched only when it will be used.
 */
const HeroSculpture = lazy(() =>
  import('./HeroSculpture').then((m) => ({ default: m.HeroSculpture })),
)

export function LivingHero({ ready }: { ready: boolean }) {
  /** False on phones and without WebGL — there, the mark stands alone. */
  const [rich, setRich] = useState(false)
  /**
   * True when motion is turned down. The sculpture is still shown — it is
   * composition, not decoration — but it arrives already unfolded and does not
   * move or answer the cursor.
   */
  const [still, setStill] = useState(false)

  /*
   * Re-read on every change rather than once at mount. Checked once, a window
   * that happened to be narrow when the page loaded would be left without the
   * sculpture for the rest of the session even after it was widened.
   */
  useEffect(() => {
    let webgl = false
    try {
      const probe = document.createElement('canvas')
      webgl = !!(probe.getContext('webgl2') || probe.getContext('webgl'))
    } catch {
      webgl = false
    }
    if (!webgl) return

    const small = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => {
      setRich(!small.matches)
      setStill(quiet.matches)
    }

    read()
    small.addEventListener('change', read)
    quiet.addEventListener('change', read)
    return () => {
      small.removeEventListener('change', read)
      quiet.removeEventListener('change', read)
    }
  }, [])

  return (
    <section id="top" className="relative h-svh min-h-[600px] overflow-hidden bg-cream">
      {/*
        The mark is centred on the viewport, not on the space under the bar —
        so the composition fills the whole frame and the navigation floats over
        it. In flow above it, the bar pushed the centre down by its own height.
      */}
      <div
        className="absolute inset-0"
        // Brought up as the landing screen lifts, so the hero arrives rather
        // than being found already there behind it.
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 900ms ease 150ms' }}
      >
        {/* The form, behind. */}
        {rich && (
          <Suspense fallback={null}>
            <div className="absolute inset-0">
              <HeroSculpture ready={ready} still={still} />
            </div>
          </Suspense>
        )}

        {/* The mark, over it and centred. Above the canvas in the stacking
            order, so no part of the sculpture can ever cross in front of it. */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <img
            src="/images/brand/logo-navy.svg"
            alt="Brief Theory"
            className="w-full max-w-[268px] sm:max-w-[320px] lg:max-w-[368px]"
          />
        </div>
      </div>

      {/* Over the composition, unchanged. */}
      <div className="relative z-30">
        <Navbar />
      </div>
    </section>
  )
}
