import { memo } from 'react'
import { NAV_LINKS } from '../../config/copy'
import { FadeIn } from '../shared/FadeIn'
import { Wordmark } from '../shared/Wordmark'

/**
 * Memoised, and it matters: this sits inside the opening section, which
 * re-renders every time the sector deck turns over. Without it the bar and its
 * entrance animation were being rebuilt on every card.
 */
export const Navbar = memo(function Navbar() {
  return (
    <FadeIn
      as="nav"
      delay={0}
      y={-20}
      className="relative z-30 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8"
    >
      <a href="#top" className="shrink-0 transition-opacity duration-200 hover:opacity-80">
        {/* The film behind is washed to cream, so the mark needs no plate. */}
        <Wordmark bare className="h-9 sm:h-11 md:h-12" />
      </a>

      <div className="flex items-center gap-3.5 sm:gap-8 md:gap-9">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[0.6rem] font-light uppercase tracking-[0.12em] text-navy/70 transition-opacity duration-200 hover:opacity-100 sm:text-xs sm:tracking-[0.2em] md:text-sm"
          >
            {link.label}
          </a>
        ))}
      </div>
    </FadeIn>
  )
})
