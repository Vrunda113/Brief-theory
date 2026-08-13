/**
 * What a piece of work is, and where its files live.
 *
 * Shared by the two bodies of work that were previously one list — Selected
 * Work and Case Studies. They describe the same shape but are not the same
 * set, and keeping the shape here is what lets them stay separate without
 * either one re-declaring it.
 */

export type Media = { type: 'video' | 'image'; src: string; poster?: string }

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

export const riccis = (name: string): Media => ({
  type: 'video',
  src: `/video/riccis/${name}.mp4`,
  poster: `/video/riccis/${name}.jpg`,
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
