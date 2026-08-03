/**
 * Turns the raw client stills into web-ready tiles.
 *
 * Sources land as 1080x1920 PNG exports at 1.6–3.8 MB each — roughly 21 MB for
 * one case card, which is not shippable. Each is resized to the largest size a
 * tile ever renders at (accounting for 2x displays) and encoded as WebP.
 *
 * Sources live in source-images/, outside public/, so the multi-megabyte
 * originals are never copied into the build. Drop new stills there and re-run.
 *
 * Usage: node scripts/optimise-stills.mjs [--ffmpeg <path>]
 */
import { execFile } from 'node:child_process'
import { readdir, mkdir, stat } from 'node:fs/promises'
import { promisify } from 'node:util'
import path from 'node:path'

const run = promisify(execFile)

const FFMPEG_CANDIDATES = [
  process.env.FFMPEG_PATH,
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/pylibs/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe',
  'ffmpeg',
].filter(Boolean)

/**
 * A tile is about a fifth of a 1440px card and never taller than 320px, so 720
 * wide covers a 2x display with room to spare.
 */
const WIDTH = 720
const QUALITY = 80

/** Source folder -> output folder. Sources keep their original filenames. */
const SETS = [{ from: 'source-images/skin-world', to: 'public/images/skin-world' }]

async function resolveFfmpeg() {
  const argIdx = process.argv.indexOf('--ffmpeg')
  if (argIdx !== -1 && process.argv[argIdx + 1]) return process.argv[argIdx + 1]
  for (const candidate of FFMPEG_CANDIDATES) {
    try {
      await run(candidate, ['-version'])
      return candidate
    } catch {
      /* try the next one */
    }
  }
  throw new Error(`No ffmpeg found. Tried:\n  ${FFMPEG_CANDIDATES.join('\n  ')}`)
}

/** A stable, url-safe name — the source filenames carry spaces and numbering. */
function slugify(name) {
  return path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/^\d+_?\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const ffmpeg = await resolveFfmpeg()
console.log(`ffmpeg: ${ffmpeg}\n`)

for (const set of SETS) {
  await mkdir(set.to, { recursive: true })
  const files = (await readdir(set.from)).filter((f) => /\.(png|jpe?g)$/i.test(f))

  for (const file of files) {
    const src = path.join(set.from, file)
    const out = path.join(set.to, `${slugify(file)}.webp`)

    await run(ffmpeg, [
      '-y',
      '-loglevel',
      'error',
      '-i',
      src,
      '-vf',
      `scale=${WIDTH}:-2:flags=lanczos`,
      '-quality',
      String(QUALITY),
      out,
    ])

    const [a, b] = await Promise.all([stat(src), stat(out)])
    console.log(
      `${path.basename(out).padEnd(38)} ${(a.size / 1e6).toFixed(1)}MB -> ${(b.size / 1e3).toFixed(0)}KB`,
    )
  }
}
