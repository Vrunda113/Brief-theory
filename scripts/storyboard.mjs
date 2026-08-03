/**
 * Captures the film beat by beat in a single browser session and composes a
 * labelled storyboard. A full-page screenshot can't represent this site — the
 * pinned sequences only render their content at one scroll position each.
 */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const OUT =
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/storyboard'
const PORT = 9337
const W = 1440
const H = 900

const BEATS = [
  { at: 0.0, label: '1 — HERO' },
  { at: 0.115, label: '2 — PROLOGUE / the clarity argument' },
  { at: 0.185, label: '3 — THE QUESTION (01 of 04)' },
  { at: 0.25, label: '3 — THE QUESTION (03 of 04)' },
  { at: 0.35, label: '4 — THE CONTEXT (belief 01)' },
  { at: 0.52, label: '4 — THE CONTEXT (belief 06)' },
  { at: 0.6, label: '5 — FROM BRIEF TO THEORY' },
  { at: 0.68, label: '6 — PRACTICE (cut to cream)' },
  { at: 0.75, label: '6 — PRACTICE / pillars' },
  { at: 0.85, label: '7 — SELECTED WORK / stacking cards' },
  { at: 0.93, label: '7 — SELECTED WORK / card 03' },
  { at: 1.0, label: '8 — INVITATION / closing frame' },
]

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
  await sleep(9000) // let the cold open finish

  await mkdir(OUT, { recursive: true })
  let prev = 0

  for (const [i, beat] of BEATS.entries()) {
    // Walk to the position rather than jumping, so lazy media and
    // IntersectionObserver behave the way they do for a real visitor.
    const steps = Math.max(1, Math.round(Math.abs(beat.at - prev) * 40))
    for (let s = 1; s <= steps; s++) {
      const at = prev + ((beat.at - prev) * s) / steps
      await send('Runtime.evaluate', {
        expression: `window.scrollTo(0,(document.body.scrollHeight-innerHeight)*${at})`,
      })
      await sleep(110)
    }
    prev = beat.at
    await sleep(2000)

    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const file = path.join(OUT, `${String(i + 1).padStart(2, '0')}.png`)
    await writeFile(file, Buffer.from(data, 'base64'))
    console.log(`${beat.label}  ->  ${path.basename(file)}`)
  }

  await writeFile(
    path.join(OUT, 'labels.json'),
    JSON.stringify(BEATS.map((b) => b.label), null, 2),
  )
} finally {
  ws?.close()
  chrome.kill()
}
