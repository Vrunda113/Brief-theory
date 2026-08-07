/** Navigates straight to a section by id/selector and screenshots it. */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const OUT =
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/anchor'
const PORT = 9371
const W = Number(process.env.VW ?? 1600)
const H = Number(process.env.VH ?? 900)
const SEL = process.env.SECTION ?? '#method'
const EXTRA = Number(process.env.EXTRA ?? 0)
const NAME = process.env.NAME ?? 'shot'

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
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  }
  await send('Runtime.enable')
  await send('Page.navigate', { url: URL })
  await sleep(10000)

  const target = await send('Runtime.evaluate', {
    expression: `document.querySelector('${SEL}').getBoundingClientRect().top + window.scrollY`,
    returnByValue: true,
  })
  const y = target.result.value
  for (let s = 1; s <= 30; s++) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y} * ${s} / 30 + ${EXTRA} * ${s} / 30)` })
    await sleep(90)
  }
  await sleep(1500)

  if (process.env.HOLD) {
    const read = `document.querySelector('${SEL} blockquote, ${SEL} p.font-serif').textContent.slice(0, 60)`
    const a = (await send('Runtime.evaluate', { expression: read, returnByValue: true })).result.value
    console.log('t=0s   ', a)
    await sleep(Number(process.env.HOLD))
    const b = (await send('Runtime.evaluate', { expression: read, returnByValue: true })).result.value
    console.log(`t=${Number(process.env.HOLD) / 1000}s `, b)
    console.log(a === b ? 'NOT ADVANCING' : 'ADVANCED')
  }

  await mkdir(OUT, { recursive: true })
  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  const file = path.join(OUT, `${NAME}.png`)
  await writeFile(file, Buffer.from(data, 'base64'))
  console.log('saved', file)
} finally {
  ws?.close()
  chrome.kill()
}
