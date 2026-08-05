/**
 * Reports every <video> on the page — whether it is paused, how far it has got,
 * and whether it errored — after scrolling to a given section. "The clips stop"
 * is a claim about runtime state, so it gets checked at runtime.
 */
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const PORT = 9349
const W = Number(process.env.VW ?? 1600)
const H = Number(process.env.VH ?? 900)
const SECTION = process.env.SECTION ?? '#expression'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--mute-audio',
  '--no-first-run',
  '--autoplay-policy=no-user-gesture-required',
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

  // Walk down rather than jump, so observers fire the way they do for a reader.
  const target = await send('Runtime.evaluate', {
    expression: `document.querySelector('${SECTION}').getBoundingClientRect().top + window.scrollY`,
    returnByValue: true,
  })
  const y = target.result.value + Number(process.env.EXTRA ?? 0)
  for (let s = 1; s <= 40; s++) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y} * ${s} / 40)` })
    await sleep(80)
  }
  await sleep(4000)

  const probe = `(() => {
    const vids = [...document.querySelectorAll('video')]
    const rows = vids.map((v) => {
      const r = v.getBoundingClientRect()
      const onScreen = r.bottom > 0 && r.top < innerHeight && r.width > 0
      return {
        src: (v.currentSrc || v.getAttribute('src') || '(none)').split('/').slice(-2).join('/'),
        onScreen,
        paused: v.paused,
        t: Number(v.currentTime.toFixed(2)),
        ready: v.readyState,
        err: v.error ? v.error.code : 0,
      }
    })
    const onScreen = rows.filter((r) => r.onScreen)
    return JSON.stringify({
      total: rows.length,
      onScreen: onScreen.length,
      playingOnScreen: onScreen.filter((r) => !r.paused && r.t > 0).length,
      stalledOnScreen: onScreen.filter((r) => r.paused || r.t === 0).map((r) => r.src),
      decodingOffScreen: rows.filter((r) => !r.onScreen && !r.paused).length,
      rows,
    }, null, 1)
  })()`

  const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true })
  console.log(r.result.value)
} finally {
  ws?.close()
  chrome.kill()
}
