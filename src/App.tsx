import { useCallback, useState } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { Cursor } from './components/shared/Cursor'
import { Industries } from './components/industries/Industries'
import { Prologue } from './components/question/Prologue'
import { CaseStudiesFeature } from './components/case-studies/CaseStudiesFeature'
import { Services } from './components/services/Services'
import { Theory } from './components/theory/Theory'
import { Expression } from './components/expression/Expression'
import { Chapters } from './components/chapters/Chapters'
import { Founder } from './components/founder/Founder'
import { Testimonials } from './components/testimonials/Testimonials'
import { Invitation } from './components/invitation/Invitation'

export default function App() {
  useSmoothScroll()
  const [ready, setReady] = useState(false)
  const handleComplete = useCallback(() => setReady(true), [])

  return (
    <main className="relative bg-cream" style={{ overflowX: 'clip' }}>
      <Cursor />
      {/* The cold open lives inside the opening section now — it settles into
          it as the page's ground rather than lifting off it. */}
      <Industries ready={ready} onColdOpenComplete={handleComplete} />
      <Prologue />
      <CaseStudiesFeature />
      <Theory />
      <Services />
      <Chapters />
      <Expression />
      <Founder />
      <Testimonials />
      <Invitation />
    </main>
  )
}
