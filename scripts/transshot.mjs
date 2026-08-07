/**
 * Samples the case-study layers' computed transforms across the pinned scroll,
 * so "it breaks somewhere" becomes a specific scroll position and a specific
 * bad value rather than a feeling.
 */
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const PORT = 9379
const W = Number(process.env.VW ?? 1600)
const H = Number(process.env.VH ?? 900)
const STEPS = Number(process.env.STEPS ?? 22)
const FROM = Number(process.env.FROM ?? 0)
const TO = Number(process.env.TO ?? 1)

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

  const bounds = (
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.querySelector('#case-studies')
        return JSON.stringify({ top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight })
      })()`,
      returnByValue: true,
    })
  ).result.value
  const { top, h } = JSON.parse(bounds)
  console.log('section top', Math.round(top), 'height', h, 'viewport', H)

  const span = h - H
  console.log('\np     layer transforms (translateY px / scale)          visible?')

  for (let i = 0; i <= STEPS; i++) {
    const p = FROM + ((TO - FROM) * i) / STEPS
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${top} + ${span} * ${p})` })
    await sleep(320)

    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const fs = await import('node:fs/promises')
    await fs.mkdir('C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/trans', { recursive: true })
    await fs.writeFile(`C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/trans/t${String(i).padStart(2,'0')}.png`, Buffer.from(data, 'base64'))

    const row = (
      await send('Runtime.evaluate', {
        expression: `(() => {
          const wrap = document.querySelector('#case-studies .relative.hidden')
                    || document.querySelectorAll('#case-studies div')[0]
          const layers = [...document.querySelectorAll('#case-studies [data-layer]')]
          const src = layers.length ? layers : [...document.querySelectorAll('#case-studies .absolute.inset-0')]
          const out = src.map((el) => {
            const cs = getComputedStyle(el)
            const t = cs.transform
            const r = el.getBoundingClientRect()
            return {
              t: t === 'none' ? 'none' : t.replace(/matrix\\(|\\)/g, '').split(',').map(Number).map(n => Math.round(n*1000)/1000).join(','),
              top: Math.round(r.top),
              h: Math.round(r.height),
              nan: t.includes('NaN'),
            }
          })
          // Is anything actually painted in the stage area?
          const stage = document.querySelector('#case-studies .relative.hidden.lg\\\\:block')
          return JSON.stringify({ layers: out, stage: stage ? Math.round(stage.getBoundingClientRect().height) : null })
        })()`,
        returnByValue: true,
      })
    ).result.value
    const d = JSON.parse(row)
    const desc = d.layers
      .map((l, k) => `L${k}:${l.nan ? 'NaN!' : l.t === 'none' ? 'none' : l.t.split(',').slice(4).join(',') + '/' + l.t.split(',')[0]}`)
      .join('  ')
    console.log(p.toFixed(2), ' ', desc)
  }
} finally {
  ws?.close()
  chrome.kill()
}
