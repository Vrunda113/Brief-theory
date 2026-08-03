import { useCallback, useState } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ColdOpen } from './components/cold-open/ColdOpen'
import { Hero } from './components/hero/Hero'
import { Prologue } from './components/question/Prologue'
import { QuestionSequence } from './components/question/QuestionSequence'
import { Practice } from './components/practice/Practice'
import { Expression } from './components/expression/Expression'
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
      <QuestionSequence />
      <Practice />
      <Expression />
      <Invitation />
    </main>
  )
}
