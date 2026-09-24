import { useEffect, useMemo, useRef, useState } from 'react'
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
 * The hero cards, all in public/images/hero/.
 *
 * Pictures:  hero-01.jpg, hero-02.jpg, ...        count: HERO_IMAGE_COUNT
 * Videos:    hero-video-01.mp4, hero-video-02.mp4 count: HERO_VIDEO_COUNT
 *            each with a still of the same name,  hero-video-01.jpg, shown
 *            while the clip loads (and instead of it when motion is reduced).
 *
 * To replace one: save the new file over the old one under the same name.
 * Nothing in the code changes.
 * To add one: save it as the next number and raise the matching count.
 * To remove one: delete the highest-numbered file and lower the count — keep
 * the numbers unbroken, since the list is built from them.
 *
 * Pictures: JPG, portrait, around 1200px on the long edge.
 * Videos: MP4 (H.264), silent, portrait, around 540px wide. iPhone .mov files
 * are HEVC, which Chrome on Windows often will not play — convert them first.
 * The cards render at about 173 x 225, so anything larger only slows the
 * first screen down.
 */
const HERO_IMAGE_COUNT = 5
const HERO_VIDEO_COUNT = 1

type Card = { type: 'image'; src: string } | { type: 'video'; src: string; poster: string }

const num = (i: number) => String(i + 1).padStart(2, '0')

const IMAGES: Card[] = Array.from({ length: HERO_IMAGE_COUNT }, (_, i) => ({
  type: 'image',
  src: `/images/hero/hero-${num(i)}.jpg`,
}))

const VIDEOS: Card[] = Array.from({ length: HERO_VIDEO_COUNT }, (_, i) => ({
  type: 'video',
  src: `/images/hero/hero-video-${num(i)}.mp4`,
  poster: `/images/hero/hero-video-${num(i)}.jpg`,
}))

/**
 * Videos are spread through the pictures rather than bunched at the end —
 * the first lands second in the set, which deals it into the middle belt,
 * the brightest of the three.
 */
const CARDS: Card[] = (() => {
  const list = [...IMAGES]
  VIDEOS.forEach((video, k) => list.splice(Math.min(1 + k * 3, list.length), 0, video))
  return list
})()

/**
 * How many belts run, by width.
 *
 * Three on a wide screen: at two columns the cards were 273px in a 640px
 * window and only four of the six were ever on screen. Two on a phone for the
 * opposite reason — three would leave each card about 105px across, too small
 * to read as work rather than as wallpaper.
 *
 * Every belt gets at least two cards, cycling back through the set if there
 * are fewer pictures than slots — a belt with one card left an empty gap in
 * its loop. So any number of hero images fills the field.
 */
const WIDE_COLUMNS = 3
const NARROW_COLUMNS = 2
const MIN_PER_BELT = 2

function buildColumns(count: number): Card[][] {
  const columns: Card[][] = Array.from({ length: count }, () => [])
  const slots = Math.max(CARDS.length, count * MIN_PER_BELT)
  for (let i = 0; i < slots; i += 1) {
    columns[i % count].push(CARDS[i % CARDS.length])
  }
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

/** Speeds and dimming are indexed by belt, so both must cover the widest case. */
const beltSpeed = (i: number) => SPEEDS[i % SPEEDS.length]
const beltDim = (i: number) => DIM[i % DIM.length]

function Belt({
  frames,
  seconds,
  direction,
  offset,
  still,
}: {
  frames: Card[]
  seconds: number
  direction: 'up' | 'down'
  offset: number
  still: boolean
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
        {[...frames, ...frames].map((card, i) => (
          <figure
            key={`${card.src}-${i}`}
            className="relative shrink-0 overflow-hidden"
            style={{
              aspectRatio: '4 / 5',
              borderRadius: '2px',
              boxShadow: `0 26px 54px -26px rgba(10,42,94,0.28)`,
            }}
          >
            {card.type === 'video' && !still ? (
              // Muted and inline, or mobile browsers refuse to autoplay it.
              <video
                src={card.src}
                poster={card.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="block h-full w-full object-cover"
                style={{ filter: 'saturate(0.82)' }}
              />
            ) : (
              <img
                src={card.type === 'video' ? card.poster : card.src}
                alt=""
                decoding="async"
                className="block h-full w-full object-cover"
                style={{ filter: 'saturate(0.82)' }}
              />
            )}
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
  const [wide, setWide] = useState(true)
  const columns = useMemo(
    () => buildColumns(wide ? WIDE_COLUMNS : NARROW_COLUMNS),
    [wide],
  )
  const want = useRef({ x: 0, y: 0 })
  const shown = useRef({ x: 0, y: 0 })

  /*
   * Belt count follows the width, and is re-read rather than sampled once: a
   * window that happened to be narrow at load would otherwise keep two belts
   * for the rest of the session no matter how wide it was pulled.
   */
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const read = () => setWide(query.matches)
    read()
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [])

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
          <div key={i} className="flex flex-1" style={{ opacity: beltDim(i) }}>
            <Belt
              frames={frames}
              seconds={beltSpeed(i)}
              // Alternating, so no two neighbouring belts travel together.
              direction={i % 2 === 0 ? 'up' : 'down'}
              offset={(beltSpeed(i) / columns.length) * i}
              still={still}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
