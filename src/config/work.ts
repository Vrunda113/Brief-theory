/**
 * What a piece of work is, and where its files live.
 *
 * Shared by the two bodies of work that were previously one list — Selected
 * Work and Case Studies. They describe the same shape but are not the same
 * set, and keeping the shape here is what lets them stay separate without
 * either one re-declaring it.
 */

export type Media = {
  type: 'video' | 'image'
  src: string
  poster?: string
  /**
   * How the image fills its plate. Defaults to `'cover'` — the plates are
   * built for full-bleed campaign photography and crop to fill their box.
   * A product cutout on a transparent ground (a lipstick, a bottle) needs
   * `'contain'` instead, or cover crops straight through it.
   */
  fit?: 'cover' | 'contain'
}

export type CaseStudy = {
  index: string
  client: string
  category: string
  sector: string
  theory: string
  body: string
  media: Media[]
  live?: string
}

/* ------------------------------------------------------------ file paths */

export const reel = (name: string): Media => ({
  type: 'video',
  src: `/video/cafe-pulp/${name}.mp4`,
  poster: `/video/cafe-pulp/${name}.jpg`,
})

export const still = (name: string): Media => ({
  type: 'image',
  src: `/images/skin-world/${name}.webp`,
})

export const munchies = (n: string): Media => ({
  type: 'image',
  src: `/images/super-munchies/${n}.webp`,
})

/**
 * Note the folder: the case card's own strip reads from `huft-work`, while the
 * feature spread's plates come from `huft`. Two different sets of files for the
 * same client, both in use.
 */
export const huft = (n: string): Media => ({ type: 'image', src: `/images/huft-work/${n}.webp` })

export const mason = (n: string): Media => ({ type: 'image', src: `/images/mason-home/${n}.webp` })

/**
 * A shelf of shorter clips that don't belong to one client's story — kitchens,
 * product, a garage, whatever didn't earn a card of its own. Named `v1`
 * through `v5` because they were never meant to be read individually; the
 * card they sit in is titled plainly for the same reason.
 */
export const other = (n: string): Media => ({
  type: 'video',
  src: `/video/other/${n}.mp4`,
  poster: `/video/other/${n}.jpg`,
})
