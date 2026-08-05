/**
 * Captures frames across the pinned chapters section by *pin progress* rather
 * than by a fraction of the whole document, so a requested frame lands where it
 * was asked for. ScrollTrigger's pin-spacer gives the exact mapping: progress p
 * is spacerTop + p * (spacerHeight - viewport).
 *
 *   node scripts/turns.mjs 0 0.2 0.24 0.28
 */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const OUT =
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/turns'
const PORT = 9341
const W = Number(process.env.VW ?? 1600)
const H = Number(process.env.VH ?? 900)
const SECTION = process.env.SECTION ?? '#method'

const marks = process.argv.slice(2).map(Number)
if (!marks.length) marks.push(0, 0.15, 0.2, 0.25, 0.3, 0.5, 0.75, 1)

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
  if (process.env.REDUCED === '1') {
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    })
  }
  await send('Runtime.enable')
  await send('Page.navigate', { url: URL })
  await sleep(9000) // let the cold open finish

  await mkdir(OUT, { recursive: true })

  // Walk to the top of the pin first, so lazy media and observers behave the
  // way they do for a real visitor arriving by scroll.
  for (let s = 1; s <= 30; s++) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('${SECTION}')
        const sp = sec.closest('.pin-spacer') || sec
        window.scrollTo(0, sp.offsetTop * ${s} / 30)
      })()`,
    })
    await sleep(90)
  }
  await sleep(1200)

  for (const [i, p] of marks.entries()) {
    if (process.env.CLOCK === '1') {
      await sleep(p * 1000 - (i === 0 ? 0 : marks[i - 1] * 1000))
    } else {
      await send('Runtime.evaluate', {
        expression: `(() => {
          const sec = document.querySelector('${SECTION}')
          const sp = sec.closest('.pin-spacer') || sec
          const span = sp.offsetHeight - window.innerHeight
          window.scrollTo(0, sp.offsetTop + span * ${p})
          return sp.offsetTop + span * ${p}
        })()`,
      })
      await sleep(Number(process.env.WAIT ?? 2200))
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const name = `${String(i + 1).padStart(2, '0')}_p${String(p).replace('.', '-')}.png`
    await writeFile(path.join(OUT, name), Buffer.from(data, 'base64'))
    console.log(`progress ${p}  ->  ${name}`)
  }
} finally {
  ws?.close()
  chrome.kill()
}
