import { useCallback, useState } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ColdOpen } from './components/cold-open/ColdOpen'
import { Cursor } from './components/shared/Cursor'
import { Industries } from './components/industries/Industries'
import { Prologue } from './components/question/Prologue'
import { Services } from './components/services/Services'
import { Theory } from './components/theory/Theory'
import { Expression } from './components/expression/Expression'
import { Chapters } from './components/chapters/Chapters'
import { Founder } from './components/founder/Founder'
import { Invitation } from './components/invitation/Invitation'

export default function App() {
  useSmoothScroll()
  const [ready, setReady] = useState(false)
  const handleComplete = useCallback(() => setReady(true), [])

  return (
    <main className="relative bg-cream" style={{ overflowX: 'clip' }}>
      <Cursor />
      <ColdOpen onComplete={handleComplete} />
      <Industries ready={ready} />
      <Prologue />
      <Theory />
      <Services />
      <Chapters />
      <Expression />
      <Founder />
      <Invitation />
    </main>
  )
}
