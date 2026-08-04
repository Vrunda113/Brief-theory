import { useCallback, useState } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ColdOpen } from './components/cold-open/ColdOpen'
import { Hero } from './components/hero/Hero'
import { Prologue } from './components/question/Prologue'
import { ThinkingInPractice } from './components/question/ThinkingInPractice'
import { Practice } from './components/practice/Practice'
import { Expression } from './components/expression/Expression'
import { Method } from './components/method/Method'
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
      <ThinkingInPractice />
      <Practice />
      <Expression />
      <Method />
      <Invitation />
    </main>
  )
}
