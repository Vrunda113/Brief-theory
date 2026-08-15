/**
 * The hero's palette, taken from the supplied swatches.
 *
 * Two are fixed and everything else is built around them: `paper` is the page
 * and `ink` is the wordmark. The rest are the supporting blues, ordered from
 * deepest to palest, and they are the only colours the glass is allowed to
 * take — the reference leans on brass for its warmth and there is no brass in
 * this palette, so depth has to come from tone and blur instead of from a
 * second hue.
 */
export const PALETTE = {
  /** The ground. Fixed. */
  paper: '#F6F0E9',
  /** The wordmark. Fixed. */
  ink: '#16305C',

  /** Deepest — the plinth's core and the darkest edges. */
  abyss: '#0A2A5E',
  /** The primary navy of the swatches. */
  navy: '#032B6D',
  /** Mid navy — plinth faces catching light. */
  slate: '#2E4A76',
  /** Mid blue — glass at its most present. */
  steel: '#6B82A6',
  /** Pale blue — glass edges and rims. */
  mist: '#A5BAD5',
  /** Palest — highlights, the brightest edge a panel can carry. */
  frost: '#D9E6F5',
} as const

/**
 * Paper grain — a turbulence tile, multiplied over a ground so it reads as
 * stock rather than as a fill. Shared: the landing screen and the menu both
 * need it, and two copies of a data URI this size drift the moment either is
 * touched.
 */
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")"

/** Glass surfaces, as ready-made colour stops. */
export const GLASS = {
  /** A panel's fill — barely there, so what is behind it still reads. */
  panel: 'rgba(217, 230, 245, 0.34)',
  /** A panel sitting further back, cooled and dimmed by depth. */
  panelBack: 'rgba(165, 186, 213, 0.22)',
  /** The lit edge along a panel's top and left. */
  edge: 'rgba(255, 255, 255, 0.55)',
  /** The shaded edge along its bottom and right. */
  edgeDark: 'rgba(10, 42, 94, 0.18)',
  /** Cast shadow beneath a floating panel. */
  drop: 'rgba(10, 42, 94, 0.20)',
} as const
