import { useCallback, useState } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { Cursor } from './components/shared/Cursor'
import { Navbar } from './components/hero/Navbar'
import { LivingHero } from './components/living-hero/LivingHero'
import { Prologue } from './components/question/Prologue'
import { CaseStudiesFeature } from './components/case-studies/CaseStudiesFeature'
// Services is held out of the page for now — see below. The import goes with
// it: the build runs `tsc -b` with unused locals treated as errors, so leaving
// it here fails the deploy rather than merely warning.
// import { Services } from './components/services/Services'
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
      {/* Outside the hero and fixed, so the navigation travels the whole page
          rather than scrolling away with the first screen. It reads the ground
          beneath it and changes tone to suit. */}
      <Navbar />
      <LivingHero ready={ready} onColdOpenComplete={handleComplete} />
      <Prologue />
      <CaseStudiesFeature />
      <Theory />
      {/* <Services /> — restore this line and its import together. */}
      <Chapters />
      <Expression />
      <Founder />
      <Testimonials />
      <Invitation />
    </main>
  )
}
