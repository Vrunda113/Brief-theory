/**
 * Reports the left edge and width of every section's headline container, so
 * "does the page line up" is answered with numbers rather than by eye.
 */
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const PORT = 9338
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
  await sleep(9000)

  const expr = `(() => {
    const out = []
    for (const sec of document.querySelectorAll('section')) {
      const h = sec.querySelector('h1, h2')
      if (!h) continue
      const hr = h.getBoundingClientRect()
      const cs = getComputedStyle(h)
      out.push({
        id: sec.id || '(none)',
        head: h.textContent.trim().slice(0, 26),
        left: Math.round(hr.left),
        size: Math.round(parseFloat(cs.fontSize)),
        align: cs.textAlign,
      })
    }
    return JSON.stringify(out, null, 1)
  })()`

  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
  console.log(r.result.value)
} finally {
  ws?.close()
  chrome.kill()
}
