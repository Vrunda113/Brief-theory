import { useCallback, useState } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ColdOpen } from './components/cold-open/ColdOpen'
import { Hero } from './components/hero/Hero'
import { Prologue } from './components/question/Prologue'
import { Expression } from './components/expression/Expression'
import { Chapters } from './components/chapters/Chapters'
import { Invitation } from './components/invitation/Invitation'

export default function App() {
  useSmoothScroll()
  const [ready, setReady] = useState(false)
  const handleComplete = useCallback(() => setReady(true), [])

  return (
    <main className="relative bg-navy" style={{ overflowX: 'clip' }}>
      <ColdOpen onComplete={handleComplete} />
      <Hero ready={ready} />
      <Prologue />
      <Expression />
      <Chapters />
      <Invitation />
    </main>
  )
}
