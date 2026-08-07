/**
 * Checks the case-study track: at every scroll position, how much of each card
 * is inside the stage. The claim being tested is that exactly one card is on
 * screen at a time and none of the others peek — so this measures the visible
 * fraction of each, not just the transform.
 */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const OUT =
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/track'
const PORT = 9381
const W = Number(process.env.VW ?? 1600)
const H = Number(process.env.VH ?? 900)
const STEPS = Number(process.env.STEPS ?? 20)
const SHOOT = process.env.SHOOT === '1'

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

  const raw = (
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.querySelector('#case-studies')
        if (!s) return JSON.stringify({ error: 'no #case-studies; sections: ' + [...document.querySelectorAll('section')].map(x => x.id || '?').join(',') })
        return JSON.stringify({ top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight })
      })()`,
      returnByValue: true,
    })
  ).result.value
  const b = JSON.parse(raw ?? '{"error":"eval returned nothing"}')
  if (b.error) { console.log('PROBE FAILED:', b.error); process.exit(1) }
  const span = b.h - H
  if (SHOOT) await mkdir(OUT, { recursive: true })

  console.log('p      visible fraction per card        on-stage')
  let worst = 0
  for (let i = 0; i <= STEPS; i++) {
    const p = i / STEPS
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${b.top} + ${span} * ${p})` })
    await sleep(300)

    const row = JSON.parse(
      (
        await send('Runtime.evaluate', {
          expression: `(() => {
            const stage = document.querySelector('#case-studies .overflow-hidden')
            const sr = stage.getBoundingClientRect()
            const cards = [...stage.querySelectorAll(':scope > div > div')]
            const vis = cards.map((c) => {
              const r = c.getBoundingClientRect()
              const overlap = Math.max(0, Math.min(r.right, sr.right) - Math.max(r.left, sr.left))
              return Math.round((overlap / sr.width) * 100)
            })
            return JSON.stringify(vis)
          })()`,
          returnByValue: true,
        })
      ).result.value,
    )
    const onStage = row.filter((v) => v > 0).length
    // Anything other than a clean single card, or a clean 2-card handover.
    if (onStage > 2) worst = Math.max(worst, onStage)
    console.log(
      p.toFixed(2),
      '  ',
      row.map((v, k) => `C${k}:${String(v).padStart(3)}%`).join('  '),
      '  ',
      onStage,
    )

    if (SHOOT) {
      const { data } = await send('Page.captureScreenshot', { format: 'png' })
      await writeFile(`${OUT}/p${String(i).padStart(2, '0')}.png`, Buffer.from(data, 'base64'))
    }
  }
  console.log(worst > 2 ? `\nFAIL: ${worst} cards on stage at once` : '\nOK: never more than two on stage')
} finally {
  ws?.close()
  chrome.kill()
}
