/** Dumps console output and page errors. Usage: node scripts/console.mjs [scroll] */
import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const PORT = 9334
const scroll = Number(process.argv[2] ?? 0)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--mute-audio',
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
      /* not up yet */
    }
  }
  const page = targets.find((t) => t.type === 'page')
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
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ')
      console.log(`[${msg.params.type}] ${text}`)
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails
      console.log(`[error] ${d.exception?.description ?? d.text}`)
    }
  }
  const send = (method, params = {}) =>
    new Promise((res) => {
      const msgId = ++id
      pending.set(msgId, res)
      ws.send(JSON.stringify({ id: msgId, method, params }))
    })

  await send('Runtime.enable')
  await send('Page.enable')
  await send('Log.enable')
  await send('Page.navigate', { url: URL })
  await sleep(7000)

  if (scroll > 0) {
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({top:(document.body.scrollHeight-innerHeight)*${scroll},behavior:'instant'})`,
    })
    await sleep(2500)
  }

  const probe = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      counter: document.querySelector('[data-counter]')?.textContent,
      beliefs: document.querySelectorAll('[data-belief]').length,
      questions: document.querySelectorAll('[data-question]').length,
      videos: [...document.querySelectorAll('video')].map(v => ({src: v.getAttribute('src'), ready: v.readyState})),
      scrollH: document.body.scrollHeight,
    })`,
    returnByValue: true,
  })
  console.log('PROBE', probe.result.value)
} finally {
  ws?.close()
  chrome.kill()
}
