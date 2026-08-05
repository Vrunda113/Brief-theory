/**
 * Scrolls the founder section into reach and samples the portrait's transform
 * and its cover panel over time, so "the reveal animates" is checked rather
 * than assumed.
 */
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const PORT = 9353
const W = Number(process.env.VW ?? 1600)
const H = Number(process.env.VH ?? 900)

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
  await sleep(10000)

  // Park the section just below the fold, then bring it in.
  const y = (
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#founder').getBoundingClientRect().top + window.scrollY`,
      returnByValue: true,
    })
  ).result.value

  for (let s = 1; s <= 30; s++) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y - H * 0.9} * ${s} / 30)` })
    await sleep(70)
  }
  await sleep(600)

  const probe = `(() => {
    const img = document.querySelector('#founder img')
    const cover = document.querySelector('#founder [aria-hidden="true"]')
    const cs = img ? getComputedStyle(img) : null
    return JSON.stringify({
      imgTransform: cs ? cs.transform : 'none',
      coverTransform: cover ? getComputedStyle(cover).transform : '(no cover)',
    })
  })()`

  console.log('-- before it enters --')
  console.log((await send('Runtime.evaluate', { expression: probe, returnByValue: true })).result.value)

  // Bring it in.
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y - H * 0.15})` })
  await sleep(280)
  console.log('-- mid reveal --')
  console.log((await send('Runtime.evaluate', { expression: probe, returnByValue: true })).result.value)

  await sleep(2200)
  console.log('-- settled --')
  console.log((await send('Runtime.evaluate', { expression: probe, returnByValue: true })).result.value)
} finally {
  ws?.close()
  chrome.kill()
}
