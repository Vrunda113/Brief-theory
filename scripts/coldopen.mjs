/**
 * Samples the cold open at close intervals from page load, so the writing
 * animation can be checked frame by frame rather than guessed at.
 */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const OUT =
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/coldopen'
const PORT = 9338
const AT_MS = [400, 700, 1000, 1300, 1600, 1900, 2200, 2500, 2900, 3400, 4200, 5200]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--mute-audio',
  '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  '--window-size=1280,800',
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
      /* not up yet */
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
  await mkdir(OUT, { recursive: true })

  // Reload so the once-only cold open replays, then sample against that clock.
  await send('Page.navigate', { url: URL })
  const t0 = Date.now()

  for (const [i, at] of AT_MS.entries()) {
    const wait = at - (Date.now() - t0)
    if (wait > 0) await sleep(wait)
    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(
      path.join(OUT, `${String(i + 1).padStart(2, '0')}_${at}ms.png`),
      Buffer.from(data, 'base64'),
    )
    console.log(`t=${at}ms`)
  }
} finally {
  ws?.close()
  chrome.kill()
}
