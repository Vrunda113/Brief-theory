/**
 * Walks the page and reports the WCAG contrast ratio of every text node against
 * the ground it actually sits on. Inverting a site is exactly where readability
 * quietly breaks, so this is measured rather than eyeballed.
 *
 * Elements over film or imagery are reported separately — their computed
 * background is transparent, so the number would be meaningless.
 */
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const PORT = 9355
const W = Number(process.env.VW ?? 1600)
const H = Number(process.env.VH ?? 900)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--mute-audio',
  '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  `--window-size=${W},${H}`,
  'about:blank',
])

let ws
try {
  let targets
  for (let i = 0; i < 40; i++) {
    await sleep(250)
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      if (targets.some((t) => t.type === 'page')) break
    } catch {
      /* not up */
    }
  }
  ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.onopen = res
    ws.onerror = rej
  })

  let id = 0
  const pending = new Map()
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m.result)
      pending.delete(m.id)
    }
  }
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id
      pending.set(i, res)
      ws.send(JSON.stringify({ id: i, method, params }))
    })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Page.navigate', { url: URL })
  await sleep(10000)

  // Scroll the whole page so lazy sections have rendered and revealed.
  const h = (await send('Runtime.evaluate', { expression: 'document.body.scrollHeight', returnByValue: true })).result.value
  for (let s = 1; s <= 60; s++) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${h} * ${s} / 60)` })
    await sleep(60)
  }
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' })
  await sleep(1200)

  const probe = `(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\\(([^)]+)\\)/)
      if (!m) return null
      const p = m[1].split(',').map(Number)
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
    }
    const lum = ({ r, g, b }) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const over = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    })
    const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

    const groundOf = (el) => {
      let n = el
      while (n && n !== document.documentElement) {
        const bg = parse(getComputedStyle(n).backgroundColor)
        if (bg && bg.a === 1) return { colour: bg, media: false }
        n = n.parentElement
      }
      return { colour: { r: 246, g: 240, b: 233, a: 1 }, media: false }
    }

    const rows = []
    document.querySelectorAll('p, h1, h2, h3, li, a, span, blockquote').forEach((el) => {
      const txt = (el.textContent || '').trim()
      if (!txt || txt.length < 2) return
      // Only leaf-ish nodes, so headings are not counted twice.
      if (el.querySelector('p, h1, h2, h3, li, blockquote')) return
      const r = el.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) return
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return
      // Decoration is not text to be read: watermark folios, ghost numerals,
      // and anything already hidden from assistive tech.
      if (el.closest('[aria-hidden="true"]')) return
      // Gradient-filled headings paint through a transparent fill, so their
      // computed colour says nothing about what is actually on screen.
      const fill = cs.webkitTextFillColor || cs.color
      if (parse(fill) && parse(fill).a === 0) return
      const fg = parse(cs.color)
      if (!fg || fg.a === 0) return
      // Text over film/imagery: the ancestor chain has an image or video sibling.
      const onMedia = !!el.closest('#top')
      const g = groundOf(el)
      const eff = over(fg, g.colour)
      const size = parseFloat(cs.fontSize)
      const bold = Number(cs.fontWeight) >= 700
      const large = size >= 24 || (size >= 18.66 && bold)
      rows.push({
        text: txt.slice(0, 34),
        ratio: Number(ratio(eff, g.colour).toFixed(2)),
        size: Math.round(size),
        large,
        onMedia,
        section: (el.closest('section') || {}).id || '(none)',
      })
    })

    const solid = rows.filter((r) => !r.onMedia)
    const fails = solid.filter((r) => r.ratio < (r.large ? 3 : 4.5))
    return JSON.stringify({
      checked: rows.length,
      onSolidGround: solid.length,
      overFilm: rows.length - solid.length,
      failures: fails.length,
      worst: fails.sort((a, b) => a.ratio - b.ratio).map((f) => f.section + " | " + f.ratio + " | " + f.size + "px | " + f.text),
    }, null, 1)
  })()`

  const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true })
  console.log(r.result.value)
} finally {
  ws?.close()
  chrome.kill()
}
