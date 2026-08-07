/**
 * Compresses a folder of source images into web-sized webp.
 *
 *   node scripts/optimise-images.mjs "public/images/HUFT" huft
 *
 * The source is never deleted. An earlier version of this wrote into a
 * lowercased sibling folder and then removed the source — which on Windows is
 * the *same* directory, so it deleted the freshly written files along with the
 * originals. Nothing here removes anything; clearing the source is a separate,
 * deliberate step once the output has been checked.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { access } from 'node:fs/promises'

const [src, slug] = process.argv.slice(2)
if (!src || !slug) {
  console.error('usage: node scripts/optimise-images.mjs <source-dir> <output-slug>')
  process.exit(1)
}

const out = path.join('public/images', slug)

// The guard the old script lacked: on a case-insensitive filesystem these can
// be the same directory even when the strings differ.
const same = path.resolve(src).toLowerCase() === path.resolve(out).toLowerCase()
if (same) {
  console.error(
    `refusing to run: "${src}" and "${out}" resolve to the same directory on this filesystem.\n` +
      'Pick an output slug that differs by more than letter case.',
  )
  process.exit(1)
}

try {
  await access(src)
} catch {
  console.error(`source not found: ${src}`)
  process.exit(1)
}

const py = `
import pathlib, sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src = pathlib.Path(r"${src}")
out = pathlib.Path(r"${out}")
out.mkdir(parents=True, exist_ok=True)
before = after = 0
for i, p in enumerate(sorted(q for q in src.iterdir() if q.is_file()), 1):
    try:
        im = Image.open(p).convert("RGB")
    except Exception:
        print("  skipped (not an image):", p.name); continue
    b = p.stat().st_size
    # Strip tiles render around 200x232 CSS px; 900 on the long edge is 2x.
    im.thumbnail((900, 900), Image.LANCZOS)
    dest = out / f"{i:02d}.webp"
    im.save(dest, "WEBP", quality=82, method=6)
    a = dest.stat().st_size
    before += b; after += a
    print(f"  {dest.name}  {im.size[0]}x{im.size[1]}  {b//1024}KB -> {a//1024}KB")
print(f"TOTAL {before/1024/1024:.1f}MB -> {after/1024:.0f}KB")
print("source left untouched:", src)
`

const child = spawn('python', ['-c', py], { stdio: 'inherit' })
child.on('exit', (code) => process.exit(code ?? 0))
