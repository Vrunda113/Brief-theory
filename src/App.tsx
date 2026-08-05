import { useCallback, useState } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ColdOpen } from './components/cold-open/ColdOpen'
import { Cursor } from './components/shared/Cursor'
import { Industries } from './components/industries/Industries'
import { Prologue } from './components/question/Prologue'
import { Expression } from './components/expression/Expression'
import { Chapters } from './components/chapters/Chapters'
import { Founder } from './components/founder/Founder'
import { Invitation } from './components/invitation/Invitation'

export default function App() {
  useSmoothScroll()
  const [ready, setReady] = useState(false)
  const handleComplete = useCallback(() => setReady(true), [])

  return (
    <main className="relative bg-navy" style={{ overflowX: 'clip' }}>
      <Cursor />
      <ColdOpen onComplete={handleComplete} />
      <Industries ready={ready} />
      <Prologue />
      <Expression />
      <Chapters />
      <Founder />
      <Invitation />
    </main>
  )
}
