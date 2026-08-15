import { useEffect, useMemo, useRef } from 'react'
import { CASE_STUDIES } from '../../config/caseStudies'
import { SELECTED_WORK } from '../../config/selectedWork'
import { PALETTE } from '../../config/palette'
import type { CaseStudy, Media } from '../../config/work'

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

/** Videos carry a poster; stills are their own frame. */
const frameOf = (media: Media) =>
  media.type === 'video' ? (media.poster ?? media.src) : media.src

/**
 * Six cards, one per client — not six frames off the top of the pile, which
 * would take them all from the first two studies and show the same clients
 * twice.
 *
 * Dealt two apiece across three belts rather than three apiece across two. At
 * two columns the cards were 273px wide in a 640px window and only four were
 * ever on screen at once; narrower columns fit the whole set in the frame,
 * which is the point of having six.
 */
const COLUMNS = 3

function buildColumns(): string[][] {
  const studies: CaseStudy[] = [...CASE_STUDIES, ...SELECTED_WORK]
  const frames = [...new Set(studies.map((s) => frameOf(s.media[0])))].slice(0, 6)
  const columns: string[][] = Array.from({ length: COLUMNS }, () => [])
  frames.forEach((src, i) => columns[i % COLUMNS].push(src))
  return columns
}

/** Each belt sits at its own depth, so the columns are a room and not a wall. */
const DEPTH = [-120, 10, -60] as const
const DIM = [0.78, 1, 0.86] as const

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
          <div
            key={i}
            className="flex flex-1"
            style={{ transform: `translateZ(${DEPTH[i]}px)`, opacity: DIM[i] }}
          >
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
