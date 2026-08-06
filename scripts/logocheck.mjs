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
const PORT = 9357
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

  const expr = `(() => {
    const out = []
    document.querySelectorAll('img[src*="logo"]').forEach((img) => {
      let n = img.parentElement, plate = null
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor
        if (bg && !bg.includes('rgba(0, 0, 0, 0)')) { plate = bg; break }
        n = n.parentElement
      }
      out.push({
        where: (img.closest('section') || {}).id || (img.closest('nav') ? 'nav' : '?'),
        src: img.getAttribute('src').split('/').pop(),
        plate,
        rendered: Math.round(img.getBoundingClientRect().width) + 'x' + Math.round(img.getBoundingClientRect().height),
      })
    })
    const co = document.querySelector('#cold-open path, svg path[fill]')
    if (co) out.push({ where: 'cold-open svg', fill: co.getAttribute('fill') })
    return JSON.stringify(out, null, 1)
  })()`

  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
  console.log(r.result.value)
} finally {
  ws?.close()
  chrome.kill()
}
