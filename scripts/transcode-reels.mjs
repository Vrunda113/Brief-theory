/**
 * Turns the raw client reels into web-ready loops.
 *
 * Sources are 1080x1920 at 8–30 Mbps (40–225 MB each) — unusable on the web as
 * shipped. Each entry below picks a segment that loops cleanly and avoids the
 * clip's title cards.
 *
 * Usage: node scripts/transcode-reels.mjs [--ffmpeg <path>]
 */
import { execFile } from 'node:child_process'
import { mkdir, access } from 'node:fs/promises'
import { promisify } from 'node:util'
import path from 'node:path'

const run = promisify(execFile)

const SETS = [
  {
    source: 'D:/Reels -20260803T112555Z-1-001/Reels',
    out: 'public/video/cafe-pulp',
    clips: 'CAFE_PULP',
  },
  {
    source: 'source-videos/riccis',
    out: 'public/video/riccis',
    clips: 'RICCIS',
  },
]

const FFMPEG_CANDIDATES = [
  process.env.FFMPEG_PATH,
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/pylibs/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe',
  'ffmpeg',
].filter(Boolean)

/**
 * start = seconds into the source, duration = length of the exported loop.
 * crop  = ffmpeg crop expression, for sources that arrive letterboxed.
 * width = output width; landscape crops need more pixels than 9:16 portraits.
 */
const CAFE_PULP = [
  { file: 'Pulp Kitchen Reel.mp4', name: 'kitchen', start: 6, duration: 9 },
  { file: 'evening reel final.mp4', name: 'evening', start: 3, duration: 8 },
  {
    file: 'orange matcha.mp4',
    name: 'orange-matcha',
    start: 4,
    duration: 8,
    crop: '1080:616:0:652',
    width: 1280,
  },
  { file: 'strawberry matcha.mp4', name: 'strawberry-matcha', start: 4, duration: 8 },
  { file: 'Sushi Cups .mp4', name: 'sushi', start: 10, duration: 9 },
  { file: 'north indian final.mp4', name: 'north-indian', start: 8, duration: 8 },
  { file: 'trend 1.mp4', name: 'trend-1', start: 2, duration: 8 },
]

const RICCIS = [
  { file: 'ESPRESSO MARTINI.mp4', name: 'espresso-martini', start: 5, duration: 9 },
  { file: 'Coffee cup rotating .mp4', name: 'coffee-cup', start: 0.6, duration: 5.8 },
  { file: 'Evening At Ricci Final.mp4', name: 'evening', start: 5, duration: 8 },
  { file: 'Island Reel Final.mp4', name: 'island', start: 44, duration: 9 },
  { file: 'When manager is away .mp4', name: 'manager-away', start: 3.5, duration: 8 },
  { file: 'Matcha.mp4', name: 'matcha', start: 13, duration: 8 },
  { file: 'Tiramisu.mp4', name: 'tiramisu', start: 2, duration: 7 },
]

const CLIP_SETS = { CAFE_PULP, RICCIS }

async function resolveFfmpeg() {
  for (const candidate of FFMPEG_CANDIDATES) {
    try {
      await run(candidate, ['-version'])
      return candidate
    } catch {
      /* try next */
    }
  }
  throw new Error(`No ffmpeg found. Tried:\n  ${FFMPEG_CANDIDATES.join('\n  ')}`)
}

async function transcode(ffmpeg, clip, sourceDir, outDir) {
  const input = path.join(sourceDir, clip.file)
  try {
    await access(input)
  } catch {
    console.warn(`  skip ${clip.name} — source missing: ${clip.file}`)
    return
  }

  const mp4 = path.join(outDir, `${clip.name}.mp4`)
  const poster = path.join(outDir, `${clip.name}.jpg`)

  // 720px wide keeps a 9:16 frame sharp on mobile without shipping full 1080p.
  const width = clip.width ?? 720
  const chain = [clip.crop && `crop=${clip.crop}`, `scale=${width}:-2`]
    .filter(Boolean)
    .join(',')

  await run(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-ss', String(clip.start),
    '-t', String(clip.duration),
    '-i', input,
    '-an',
    '-vf', `${chain},fps=30`,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-crf', '27',
    '-preset', 'slow',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mp4,
  ])

  await run(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-ss', String(clip.start + 0.5),
    '-i', input,
    '-frames:v', '1',
    '-vf', chain,
    '-q:v', '5',
    poster,
  ])

  console.log(`  ok   ${clip.name}`)
}

const ffmpeg = await resolveFfmpeg()
console.log(`ffmpeg: ${ffmpeg}\n`)

// Limit to one set with: node scripts/transcode-reels.mjs RICCIS
const only = process.argv[2]

for (const set of SETS) {
  if (only && set.clips !== only) continue
  const clips = CLIP_SETS[set.clips]
  await mkdir(set.out, { recursive: true })
  console.log(`${set.clips}: ${clips.length} clips -> ${set.out}`)
  for (const clip of clips) {
    await transcode(ffmpeg, clip, set.source, set.out)
  }
  console.log('')
}
console.log('done')
