/**
 * Screenshot helper for visual checks during development.
 *
 * Drives headless Chrome over CDP so waits and scroll positions are real —
 * Chrome's --virtual-time-budget doesn't advance the timers the intro relies on.
 *
 * Usage: node scripts/shot.mjs <name> [--scroll 0.5] [--wait 6000] [--w 1440] [--h 900]
 *        node scripts/shot.mjs full --fullpage
 */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const OUT_DIR =
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/shots'
const PORT = 9333

const args = process.argv.slice(2)
const name = args[0] ?? 'shot'
const flag = (key, fallback) => {
  const i = args.indexOf(`--${key}`)
  return i === -1 ? fallback : Number(args[i + 1])
}
const has = (key) => args.includes(`--${key}`)

const width = flag('w', 1440)
const height = flag('h', 900)
const waitMs = flag('wait', 6500)
const scroll = flag('scroll', 0)
const fullPage = has('fullpage')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--mute-audio',
  '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  `--window-size=${width},${height}`,
  'about:blank',
])

let ws
try {
  let targets
  for (let i = 0; i < 40; i++) {
    await sleep(250)
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      targets = await res.json()
      if (targets.some((t) => t.type === 'page')) break
    } catch {
      /* not up yet */
    }
  }
  const page = targets.find((t) => t.type === 'page')
  if (!page) throw new Error('no debuggable page')

  ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.onopen = res
    ws.onerror = rej
  })

  let id = 0
  const pending = new Map()
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result)
      pending.delete(msg.id)
    }
  }
  const send = (method, params = {}) =>
    new Promise((res) => {
      const msgId = ++id
      pending.set(msgId, res)
      ws.send(JSON.stringify({ id: msgId, method, params }))
    })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  })

  await send('Page.navigate', { url: URL })
  await sleep(waitMs)

  if (scroll > 0) {
    // Stepped rather than jumped: lazy-mounted media relies on
    // IntersectionObserver, which never fires for elements a jump skips past.
    const steps = 14
    for (let i = 1; i <= steps; i++) {
      await send('Runtime.evaluate', {
        expression: `(() => {
          const max = document.body.scrollHeight - window.innerHeight;
          window.scrollTo({ top: max * ${(scroll * i) / steps}, behavior: 'instant' });
        })()`,
      })
      await sleep(260)
    }
    await sleep(2400)
  }

  let clip
  if (fullPage) {
    const { result } = await send('Runtime.evaluate', {
      expression: 'JSON.stringify({h: document.body.scrollHeight, w: document.body.scrollWidth})',
      returnByValue: true,
    })
    const dims = JSON.parse(result.value)
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: Math.min(dims.h, 30000),
      deviceScaleFactor: 1,
      mobile: false,
    })
    await sleep(1200)
    clip = { x: 0, y: 0, width, height: Math.min(dims.h, 30000), scale: 1 }
  }

  const { data } = await send('Page.captureScreenshot', {
    format: 'png',
    ...(clip ? { clip, captureBeyondViewport: true } : {}),
  })

  await mkdir(OUT_DIR, { recursive: true })
  const out = path.join(OUT_DIR, `${name}.png`)
  await writeFile(out, Buffer.from(data, 'base64'))
  console.log(out)
} finally {
  ws?.close()
  chrome.kill()
}
