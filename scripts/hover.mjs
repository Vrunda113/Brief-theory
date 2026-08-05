/**
 * Drives a real pointer onto one of the sequence discs and captures the result,
 * so the hover state is verified as the browser actually applies it rather than
 * by reading the stylesheet and hoping.
 */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const OUT =
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/hover'
const PORT = 9347
const W = Number(process.env.VW ?? 1900)
const H = Number(process.env.VH ?? 980)
/** Which disc to hover, 0-indexed. */
const STEP = Number(process.env.STEP ?? 2)

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
  await sleep(11000) // cold open, then a couple of arch steps

  await mkdir(OUT, { recursive: true })

  const where = await send('Runtime.evaluate', {
    expression: `(() => {
      const d = document.querySelectorAll('.seq-dot')[${STEP}]
      if (!d) return 'null'
      const r = d.getBoundingClientRect()
      return JSON.stringify({ x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) })
    })()`,
    returnByValue: true,
  })
  const at = JSON.parse(where.result.value)
  console.log('disc centre', at)

  // A real pointer move, so :hover and the cursor listeners both fire.
  for (const [x, y] of [
    [at.x - 220, at.y - 120],
    [at.x - 90, at.y - 40],
    [at.x, at.y],
  ]) {
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x,
      y,
      pointerType: 'mouse',
      buttons: 0,
    })
    await sleep(220)
  }
  await sleep(900)

  const state = await send('Runtime.evaluate', {
    expression: `(() => {
      const steps = [...document.querySelectorAll('.seq-step')]
      return JSON.stringify({
        opacity: steps.map((s) => getComputedStyle(s).opacity),
        dotBorder: getComputedStyle(document.querySelectorAll('.seq-dot')[${STEP}]).borderTopColor,
        tag: getComputedStyle(document.querySelectorAll('.seq-tag')[${STEP}]).color,
        cursorOn: document.documentElement.className,
      }, null, 1)
    })()`,
    returnByValue: true,
  })
  console.log(state.result.value)

  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  await writeFile(path.join(OUT, `hover-${STEP}.png`), Buffer.from(data, 'base64'))
  console.log('saved hover-' + STEP + '.png')
} finally {
  ws?.close()
  chrome.kill()
}
