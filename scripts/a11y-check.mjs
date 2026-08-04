/**
 * Verifies the reduced-motion path: with pinning and smooth scroll disabled,
 * every beat must still be readable and reachable.
 */
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const OUT_DIR =
  'C:/Users/vrund/AppData/Local/Temp/claude/D--DeepFack-main/4e5e8675-6bf1-4504-94c3-282edbb43007/scratchpad/shots'
const PORT = 9335
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  '--window-size=1440,900',
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
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  })
  await send('Page.navigate', { url: URL })
  await sleep(6000)

  const probe = await send('Runtime.evaluate', {
    expression: `(() => {
      // Probe the overlay itself. Sniffing for its copy is unreliable now that
      // "We need more customers" is also permanent text in the case logic.
      const overlayGone = !document.querySelector('[data-cold-open]');
      const hidden = [...document.querySelectorAll('[data-step], [data-stage]')]
        .filter(el => {
          const s = getComputedStyle(el);
          return s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05;
        }).length;
      return JSON.stringify({
        scrollHeight: document.body.scrollHeight,
        steps: document.querySelectorAll('[data-step]').length,
        stages: document.querySelectorAll('[data-stage]').length,
        hiddenPanels: hidden,
        heroVisible: !!document.querySelector('h1'),
        pinSpacers: document.querySelectorAll('.pin-spacer').length,
        coldOpenDismissed: overlayGone,
      });
    })()`,
    returnByValue: true,
  })
  console.log('REDUCED-MOTION PROBE:', probe.result.value)

  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(path.join(OUT_DIR, 'reduced-motion.png'), Buffer.from(data, 'base64'))
  console.log('shot ->', path.join(OUT_DIR, 'reduced-motion.png'))
} finally {
  ws?.close()
  chrome.kill()
}
