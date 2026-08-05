/**
 * Reports whether each pinned spread's content actually fits the screen it is
 * held to, at a range of viewport sizes. "Looks fine on my monitor" is not a
 * measurement; this is.
 */
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const PORT = 9343

const SIZES = (process.env.SIZES ?? '1920x900,1600x900,1440x820,1280x740,390x844')
  .split(',')
  .map((s) => s.split('x').map(Number))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--mute-audio',
  '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  '--window-size=1600,900',
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

  for (const [w, h] of SIZES) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await sleep(1400)

    const expr = `(() => {
      const out = []
      for (const page of document.querySelectorAll('[data-sheet]')) {
        const col = page.querySelector('[data-col]')
        const inner = col.firstElementChild
        const folio = page.querySelector('h2') ? page.querySelector('h2').textContent.trim().slice(0, 22) : '?'
        // Content bottom relative to the padded column's bottom edge.
        const colBox = col.getBoundingClientRect()
        const innerBox = inner.getBoundingClientRect()
        const padBottom = parseFloat(getComputedStyle(col).paddingBottom)
        out.push({
          head: folio,
          spare: Math.round(colBox.bottom - padBottom - innerBox.bottom),
        })
      }
      return JSON.stringify(out)
    })()`

    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
    const rows = JSON.parse(r.result.value)
    const worst = Math.min(...rows.map((x) => x.spare))
    console.log(
      `${String(w).padStart(4)}x${String(h).padEnd(4)}  ${worst < 0 ? 'OVERFLOW' : 'ok      '}  ` +
        rows.map((x) => `${x.head.slice(0, 14)}:${String(x.spare).padStart(5)}`).join('  '),
    )
  }
} finally {
  ws?.close()
  chrome.kill()
}
