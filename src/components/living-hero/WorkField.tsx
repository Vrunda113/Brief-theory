import { useEffect, useMemo, useRef } from 'react'
import { PALETTE } from '../../config/palette'

/**
 * The work, as two belts of cards travelling in opposite directions.
 *
 * Six cards, each holding one piece of work for good. The version this
 * replaces had three cards swapping their pictures in place, which is a
 * slideshow wearing a card's clothes — the cards never went anywhere and the
 * work never arrived, it was simply substituted. Here every card owns its
 * image and the cards themselves move, so a new one is always entering the
 * frame and another is always leaving it.
 *
 * Two columns rather than one, running against each other. A single belt reads
 * as a list being scrolled; two in opposition read as a room with depth,
 * because nothing in the frame is moving in the same direction as anything
 * beside it.
 */

/**
 * Seconds for each belt to travel one full set. Deliberately unequal and not
 * multiples of one another, so the three never fall into step and start
 * reading as one object sliding about.
 */
const SPEEDS = [38, 47, 43] as const

/** How far the field turns toward the pointer, in degrees. */
const TURN = 5
/** Resting angle, so the field is a view rather than a flat wall. */
const REST_TURN = -9
const REST_PITCH = 2

/**
 * The six cards.
 *
 * Their own set, held here rather than pulled from the case studies: the hero
 * is art-directed, and the first frame of whatever happens to be the newest
 * study is not the same thing as a picture chosen to open the site with.
 *
 * The files come from the supplied section-one set, re-encoded on the way in.
 * As delivered they were 66 MB across six — a 6600px-wide PNG and one of
 * 31 MB — against cards that render at 173 x 225. They are now 1200px on the
 * long edge and 823 KB the set, which is still four times the density the
 * cards can show.
 */
const CARDS = [
  '/images/hero/picture0.jpg',
  '/images/hero/espresso-martini.jpg',
  '/images/hero/real-estate-2.jpg',
  '/images/hero/picture12.jpg',
  '/images/hero/matcha.jpg',
  '/images/hero/picture1.jpg',
] as const

/**
 * Dealt two apiece across three belts rather than three apiece across two. At
 * two columns the cards were 273px wide in a 640px window and only four were
 * ever on screen at once; narrower columns fit the whole set in the frame,
 * which is the point of having six.
 */
const COLUMNS = 3

function buildColumns(): string[][] {
  const columns: string[][] = Array.from({ length: COLUMNS }, () => [])
  CARDS.forEach((src, i) => columns[i % COLUMNS].push(src))
  return columns
}

/**
 * The columns are coplanar, and depth is carried by tone alone.
 *
 * They used to sit at separate Z offsets, which looked right in principle and
 * was wrong in practice: under perspective an element at z renders at
 * P / (P - z) of its laid-out size, about the perspective origin. At P = 1400
 * the three columns came out at 92%, 101% and 96% — so each was a different
 * width and each was pulled a different distance toward the centre, leaving
 * one gap noticeably wider than the other.
 *
 * The stage's own rotation still gives the field its perspective; that
 * foreshortens continuously across the whole width, so the spacing reads as a
 * view rather than as a mistake.
 */
const DIM = [0.8, 1, 0.88] as const

function Belt({
  frames,
  seconds,
  direction,
  offset,
}: {
  frames: string[]
  seconds: number
  direction: 'up' | 'down'
  offset: number
}) {
  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{
        // Cards dissolve into the paper at both ends rather than being cut off
        // by a hard edge, so the belt has no visible beginning or end.
        maskImage: 'linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent)',
        WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent)',
      }}
    >
      <div
        className="work-track flex flex-col gap-4"
        style={{
          animationName: direction === 'up' ? 'work-scroll-up' : 'work-scroll-down',
          animationDuration: `${seconds}s`,
          animationDelay: `-${offset}s`,
        }}
      >
        {/* The set, then the set again. The animation travels exactly one
            set's height, so the copy lands where the original started. */}
        {[...frames, ...frames].map((src, i) => (
          <figure
            key={`${src}-${i}`}
            className="relative shrink-0 overflow-hidden"
            style={{
              aspectRatio: '4 / 5',
              borderRadius: '2px',
              boxShadow: `0 26px 54px -26px rgba(10,42,94,0.28)`,
            }}
          >
            <img
              src={src}
              alt=""
              decoding="async"
              className="block h-full w-full object-cover"
              style={{ filter: 'saturate(0.82)' }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: `inset 0 0 0 1px ${PALETTE.ink}16` }}
            />
          </figure>
        ))}
      </div>
    </div>
  )
}

export function WorkField({ still }: { still: boolean }) {
  const stage = useRef<HTMLDivElement>(null)
  const columns = useMemo(buildColumns, [])
  const want = useRef({ x: 0, y: 0 })
  const shown = useRef({ x: 0, y: 0 })

  /*
   * The parallax runs on a frame loop rather than through React state. The
   * pointer fires continuously and re-rendering twelve cards on every event
   * would cost far more than writing one transform string.
   */
  useEffect(() => {
    if (still) return

    const onMove = (e: PointerEvent) => {
      want.current.x = (e.clientX / window.innerWidth) * 2 - 1
      want.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      shown.current.x += (want.current.x - shown.current.x) * 0.05
      shown.current.y += (want.current.y - shown.current.y) * 0.05
      const el = stage.current
      if (!el) return
      el.style.transform =
        `rotateX(${REST_PITCH - shown.current.y * TURN * 0.5}deg) ` +
        `rotateY(${REST_TURN + shown.current.x * TURN}deg)`
    }
    tick()

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [still])

  return (
    <div
      className="relative h-full w-full"
      style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
      aria-hidden="true"
    >
      <div
        ref={stage}
        className="flex h-full w-full gap-4"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${REST_PITCH}deg) rotateY(${REST_TURN}deg)`,
        }}
      >
        {columns.map((frames, i) => (
          <div key={i} className="flex flex-1" style={{ opacity: DIM[i] }}>
            <Belt
              frames={frames}
              seconds={SPEEDS[i]}
              // Alternating, so no two neighbouring belts travel together.
              direction={i % 2 === 0 ? 'up' : 'down'}
              offset={(SPEEDS[i] / COLUMNS) * i}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
