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

const SOURCE_DIR = 'D:/Reels -20260803T112555Z-1-001/Reels'
const OUT_DIR = 'public/video/cafe-pulp'

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
const CLIPS = [
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

async function transcode(ffmpeg, clip) {
  const input = path.join(SOURCE_DIR, clip.file)
  try {
    await access(input)
  } catch {
    console.warn(`  skip ${clip.name} — source missing: ${clip.file}`)
    return
  }

  const mp4 = path.join(OUT_DIR, `${clip.name}.mp4`)
  const poster = path.join(OUT_DIR, `${clip.name}.jpg`)

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
await mkdir(OUT_DIR, { recursive: true })

console.log(`ffmpeg: ${ffmpeg}\ntranscoding ${CLIPS.length} clips -> ${OUT_DIR}\n`)
for (const clip of CLIPS) {
  await transcode(ffmpeg, clip)
}
console.log('\ndone')
